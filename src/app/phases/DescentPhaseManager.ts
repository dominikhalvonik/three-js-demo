import {
    fpsManager,
    audioManager,
    game,
    THREE,
    tutorialManager,
    modes
} from '@powerplay/core-minigames'
import {
    CalculatedDataTypesForOneJump,
    Tasks,
    TutorialObjectiveIds,
    type DisciplinePhaseManager} from '../types'
import store from '@/store'
import { descentConfig, END_OF_SPRING_BOARD_POSITION, takeoffConfig } from '../config'
import { descentBalanceManager } from '../DescentBalanceManager'
import { player } from '../Player'
import { hillCurveCalculator } from '../HillCurveCalculator'
import { AudioNames } from '../types/audio'
import { trainingTasks } from '../modes/training/TrainingTasks'
import { endCalculationsManager } from '../EndCalculationsManager'
import { startGateManager } from '../StartGateManager'
import { tutorialObjectives } from '../modes/tutorial/TutorialObjectives'

/**
 * manage descent phase
 */
export class DescentPhaseManager implements DisciplinePhaseManager {
    
    /** ci faza skoncila */
    private ended = false;
    
    /** Rychlost lyziara v najazdovej faze vo frameoch za sekundu */
    speed: number;
    
    /** Pocet metrov, ktore uz boli prejdene z krivky */
    private metersPassed = 0
    
    /** Pocet metrov, ktore maju byt prejdene */
    private metersToPass!: number;
    
    /** Ci sa preslo triggerom alebo este nie */
    private passedTrigger = false;
    
    /** ukazanie zaciatku dalsej fazy */
    private debugNextPhaseTriggerPosition!: THREE.Mesh;
    
    /** Koeficient pre akceleraciu na pripocitavanie */
    private coefAccelerationAdd = 0;
    
    /** Koeficient pre akceleraciu na delenie */
    private coefAccelerationDivide = 0;

    /** Frame vo faze */
    private frames = 0
    
    /** Ci uz neskoncila faza virtualne  */
    private virtualEndOfPhase = false

    /** callback na zavolanie pri triggery */
    private callbackTrigger: () => unknown;
    
    /** callback na zavolanie po skonceni fazy */
    private callbackEnd: () => unknown;
    
    /** Konstruktor */
    constructor (
        callbackOnTrigger: () => unknown,
        callbackEnd: () => unknown
    ) {

        this.callbackTrigger = callbackOnTrigger
        this.callbackEnd = callbackEnd
        
        // na zaciatok davame rychlost z konfigu
        this.speed = descentConfig.startSpeed
        
        if (takeoffConfig.debugShowPhaseStart) this.debugShowTrigger()
        
    }
    
    /**
     * show next phase start trigger
     */
    private debugShowTrigger (): void {

        const geometry = new THREE.PlaneGeometry(1, 100)
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        })
        console.log('material:', material)
        
        this.debugNextPhaseTriggerPosition = new THREE.Mesh(geometry, material)
        game.scene.add(this.debugNextPhaseTriggerPosition)
        
        this.debugNextPhaseTriggerPosition.rotation.y = Math.PI / 2
        this.debugNextPhaseTriggerPosition.position.set(
            takeoffConfig.startPhaseX,
            END_OF_SPRING_BOARD_POSITION.y - 10,
            END_OF_SPRING_BOARD_POSITION.z
        )
    
    }
    
    /**
     * Pripravenie fazy
     */
    preparePhase (): void {

        // netreba nic
        
    }
    
    /**
     * Zacatie fazy
     */
    startPhase (): void {

        console.warn('starting descent phase')
        store.commit('InputsState/SET_DISABLED', false)
        
        this.metersToPass = hillCurveCalculator.curveObject.getLength()
        
        audioManager.play(AudioNames.skiingStart)
        audioManager.play(AudioNames.rampLoop)
        
        player.startDescend()
        
        if (descentConfig.cameraConfig.enabled) {
        
            player.changeCameraSettings(
                descentConfig.cameraConfig.idealOffset,
                descentConfig.cameraConfig.idealLookAt,
                descentConfig.cameraConfig.coefSize,
                descentConfig.cameraConfig.changeLerp
            )
        
        }
        
        this.setAccelerationCoefs()
            
        store.commit('ActionButtonState/SET_SHOW_JOYSTICK', true)
        store.commit('ActionButtonState/SET_START_BUTTON', false)
        store.commit('ActionButtonState/SET_DISABLED', true)
    
    }
    
    /**
     * Nastavenie koeficientov pre akceleraciu
     */
    private setAccelerationCoefs (): void {
        
        const {
            otherGates, highestStartGate, secondHighestStartGate
        } = descentConfig.accelerationCoefs
        
        this.coefAccelerationAdd = otherGates.add
        this.coefAccelerationDivide = otherGates.divide
        
        if (startGateManager.isHighestGateForBegginers()) {

            this.coefAccelerationAdd = highestStartGate.add
            this.coefAccelerationDivide = highestStartGate.divide
        
        }
        
        if (startGateManager.isSecondHighestGateForBegginers()) {

            this.coefAccelerationAdd = secondHighestStartGate.add
            this.coefAccelerationDivide = secondHighestStartGate.divide
        
        }
        
    }
    
    /**
     * Update kazdy frame
     */
    update (): void {
        
        this.frames++
        
        const farAway = player.physicsBody.position.x >= descentConfig.stopPhaseX
        
        const isActive = modes.isTutorial() && [3, 4].includes(tutorialManager.getActualSectionId())
            ? false
            : !descentBalanceManager.clicked && farAway

        if (farAway && isActive) descentBalanceManager.update()

        // manualane hybeme hracom podla rychlosti
        this.updatePlayerAndSpeed(descentBalanceManager.getBalanceQuality())
        
        // ked sme este nepresli triggerom, tak zistujeme, ci sa tak nestalo
        if (
            !this.passedTrigger &&
            player.physicsBody.position.x <= takeoffConfig.startPhaseX
        ) {
            
            this.passedTrigger = true
            this.callbackTrigger()
            
            if (takeoffConfig.debugShowPhaseStart) {
            
                this.debugNextPhaseTriggerPosition.visible = false
            
            }
            
        }
        
        store.commit('DescentBalanceState/SET_STATE', {
            isActive,
            value: descentBalanceManager.actualValue
        })
        
        // musime nastavit virtualny koniec fazy
        if (!farAway && !this.virtualEndOfPhase) {
            
            this.virtualEndOfPhase = true
            const averageQuality = endCalculationsManager.setActualCalculatedData(
                CalculatedDataTypesForOneJump.descentQuality,
                descentBalanceManager.getAverageQuality()
            ) as number
            
            console.log(`DESCENT average quality: ${averageQuality}`)
            trainingTasks.saveTaskValue(Tasks.descend, averageQuality)
            
        }
        
    }
    
    /**
     * Aktualizovanie rychlosti a hraca
     */
    updatePlayerAndSpeed (balanceQuality: number): void {
        
        // uhol s povrchom musime odratat od 90 stupnov kvoli implementacii threejs rotacii
        const slope = (Math.PI / 2) - player.intersectionNormal.y
        
        const baseAcceleration = slope * descentConfig.accelerationCoef
        const acceleration = baseAcceleration *
            ((this.coefAccelerationAdd + balanceQuality) / this.coefAccelerationDivide)
        
        this.speed += acceleration
        
        const frameSpeed = this.speed / fpsManager.fpsLimit
        
        this.metersPassed += frameSpeed
        if (this.metersPassed > this.metersToPass) this.metersPassed = this.metersToPass
        
        const point = hillCurveCalculator.curveObject.getPoint(
            this.metersPassed / this.metersToPass
        )
        
        player.physicsBody.position.set(
            point.x,
            point.y + descentConfig.coefAdjustPositionY,
            player.physicsBody.position.z
        )

        /** Dolezite aby bolo id 13 inak sme v zlom tutoriale */
        if (this.speed * 3.6 >= 90 && tutorialManager.getActualSectionId() === 13) {

            tutorialObjectives.passObjective(TutorialObjectiveIds.speed as string)
        
        }
        
        store.commit('SpeedMeterState/SET_STATE', {
            speed: this.speed * 3.6
        })
        
    }
    
    /**
     * Co sa stane po kliknuti pri odraze este pocas balancovania
     */
    onClicked (): void {
        
        descentBalanceManager.clicked = true
        
    }
    
    /**
     * Ukoncene fazy
     */
    finishPhase (): void {
        
        store.commit('DescentBalanceState/SET_STATE', {
            isActive: false,
            value: descentBalanceManager.actualValue
        })
        
        if (this.ended) return
            
        this.ended = true
        
        this.callbackEnd()
        
    }
    
    /**
     * reset
     */
    reset (): void {

        this.ended = false
        this.speed = descentConfig.startSpeed
        this.metersPassed = 0
        this.passedTrigger = false
        this.virtualEndOfPhase = false
    
    }
    
}
