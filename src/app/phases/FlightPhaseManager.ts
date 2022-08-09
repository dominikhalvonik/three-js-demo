import {
    audioManager, game, modes, THREE
} from '@powerplay/core-minigames'
import { player } from '../Player'
import {
    AudioNames, CalculatedDataTypesForOneJump, Tasks, WindDirection, type DisciplinePhaseManager} from '../types'
import { flightConfig } from '../config/flightConfig'
import store from '@/store'
import { flightBalanceManager } from '../FlightBalanceManager'
import { windManager } from '../WindManager'
import { END_OF_SPRING_BOARD_POSITION, gameConfig, hillCurveHalfmetersConfig } from '../config'
import { trainingTasks } from '../modes/training/TrainingTasks'
import { endCalculationsManager } from '../EndCalculationsManager'
import { startGateManager } from '../StartGateManager'
import { hillCurveCalculator } from '../HillCurveCalculator'

/**
 * Trieda pre spravovanie letovej fazy
 */
export class FlightPhaseManager implements DisciplinePhaseManager {

    /** ci faza skoncila */
    nextPhaseStarted = false;

    /** ci faza skoncila */
    ended = false;

    /** vyska v ktorej zaciname */
    startingYposition = 0;

    /** pre debug vypis */
    debugFrameCount = 0

    /** Koeficient pre vypocet kvality balansovania */
    private deviatonCoef = 0;

    /** callback ktory spusta novu fazu v dobrej vyske */
    callbackNextPhase: () => unknown;

    /** callback na zavolanie po skonceni fazy */
    callbackEnd: () => unknown;

    /** v ktorom smere skace skokan */
    JUMP_DIRECTION = WindDirection.N;
    
    /** semafor kvoli balancebaru v tutoriali */
    private tutorialFirstflight = true;

    /** Konstruktor */
    constructor (callbackNextPhase: () => unknown, callbackEnd: () => unknown) {

        this.callbackNextPhase = callbackNextPhase
        this.callbackEnd = callbackEnd

    }

    /**
     * Pripravenie fazy
     */
    preparePhase (): void {

        this.startingYposition = player.physicsBody.position.y
        flightBalanceManager.setAutoMovementValue()
        this.setHighScoreJumpLine()

    }

    /**
     * Zacatie fazy
     */
    startPhase (): void {

        let isActive = true
        if (modes.isTutorial() && this.tutorialFirstflight) {

            this.tutorialFirstflight = false
            isActive = false
        
        }
        
        store.commit('FlightBalanceState/SET_STATE', {
            isActive
        })

        console.warn('starting flight phase')
        this.preparePhase()
        store.commit('ActionButtonState/SET_DISABLED', true)

        audioManager.play(AudioNames.heartbeat)
        audioManager.play(AudioNames.audienceHype)

        if (flightConfig.cameraConfig.enabled) {

            player.changeCameraSettings(
                flightConfig.cameraConfig.idealOffset,
                flightConfig.cameraConfig.idealLookAt,
                flightConfig.cameraConfig.coefSize,
                flightConfig.cameraConfig.changeLerp
            )

        }

        // deviation coef
        const {
            highestStartGate, secondHighestStartGate, otherGates
        } = flightConfig.balanceQualityCoefs

        this.deviatonCoef = otherGates
        if (startGateManager.isHighestGateForBegginers()) this.deviatonCoef = highestStartGate
        if (startGateManager.isSecondHighestGateForBegginers()) {

            this.deviatonCoef = secondHighestStartGate

        }

    }
    
    /**
     * Nastavenie target ciary na dopadisku
     */
    private setHighScoreJumpLine (): void {
        
        if (modes.isTrainingMode() || modes.isTutorial()) return
        
        const { minValue, maxValue } = gameConfig.highScoreJumpLineCoefs
        const distance = endCalculationsManager.getTargetDistanceToWin(true)
        
        console.log('Target ciara:', distance)
        
        let plane = game.scene.getObjectByName('high_score_jump_line') as THREE.Mesh
        
        // pokial je moc mala alebo moc velka vzdialenost, tak neukazujeme, prip schovame staru
        if (distance < minValue || distance > maxValue) {

            if (plane) plane.visible = false
            return
        
        }
        
        const x = hillCurveHalfmetersConfig[(distance - 10) * 2]
        const z = END_OF_SPRING_BOARD_POSITION.z
        
        const { y, intersectionNormal } = hillCurveCalculator.getHeightAtPosition(
            new THREE.Vector3(
                x,
                END_OF_SPRING_BOARD_POSITION.y,
                z
            )
        )
        
        if (!plane) plane = this.createHighScoreJumpLine()
        plane.visible = true
        
        const percentDistance = (distance - 30) / (160 - 30)
        const scale = 0.6 + (percentDistance * 0.4)
        
        plane.position.set(x, y + 0.02, z)
        plane.scale.setX(scale)
        console.log('plane:', plane)
        
        plane.up.set(
            intersectionNormal.x,
            intersectionNormal.y,
            intersectionNormal.z
        )
        
        intersectionNormal.set(0, 0, 0)
        intersectionNormal.add(plane.position)
        plane.lookAt(intersectionNormal)
        
        plane.updateMatrix()
        
    }
    
    /**
     * vykreslime ciaru najdlhsieho skoku
     * @returns Mesh ciary
     */
    private createHighScoreJumpLine (): THREE.Mesh {
        
        const geometry = new THREE.PlaneGeometry(25, 0.5)
        geometry.rotateX(Math.PI / 2)
        geometry.rotateY(Math.PI / 2)
        const material = new THREE.MeshBasicMaterial({
            color: 0x00FF00,
            side: THREE.DoubleSide,
            opacity: 0.8,
            transparent: true
        })
        const plane = new THREE.Mesh(geometry, material)
        plane.name = 'high_score_jump_line'
        game.scene.add(plane)
        
        return plane
    
    }

    /**
     * Update kazdy frame
     */
    update (): void {

        // cek balansovania
        if (store.getters['FlightBalanceState/getFlightBalanceState'].isActive) {
            
            flightBalanceManager.update()
        
        }

        const balanceQuality = flightBalanceManager.getBalanceQuality(this.deviatonCoef)

        // uprava gravitacie podla vetra a balansovania
        const gravityY = this.getGravityY(balanceQuality)
        game.physics.setGravity({
            x: gameConfig.gravitation.x,
            y: gravityY,
            z: gameConfig.gravitation.z
        })
        
        // toto zabezpeci aby po kliku zostal ukazovatel "zaseknuty" po kliku
        // pri tutorialy mame viac pokusov v jednom pokuse tak to tam nevieme spravit
        const data = endCalculationsManager.getActualCalculatedData()
        let height = data[CalculatedDataTypesForOneJump.meters] || player.intersectionDistance
        if (modes.isTutorial()) height = player.intersectionDistance
        
        store.commit('FlightBalanceState/SET_STATE', {
            valueX: flightBalanceManager.actualValue.x,
            valueY: flightBalanceManager.actualValue.y,
            actualHeight: height
        })

        this.checkRaycast()

        this.debugFrameCount++
        const debug = flightConfig.debugLogHeight
        if (debug.enabled && this.debugFrameCount % debug.frequencyFrames) {

            console.log('momentalna vyska:', player.intersectionDistance)

        }

    }

    /**
     * calculates gravity to use on Y axis
     * @param balanceQuality - Kvalita balancu
     * @returns gravity on Y axis
     */
    private getGravityY (balanceQuality: number): number {

        const windInfluence = this.getWindInfluence()

        const defaultGravityY = gameConfig.gravitation.y
        const [windCoef, balanceCoef] = [flightConfig.windGravityYCoef, flightConfig.balanceCoef]

        return defaultGravityY + (windInfluence * windCoef) + (balanceQuality * balanceCoef)

    }

    /**
     * gets wind influence for gravity calculation
     *
     * @returns wind influence
     */
    private getWindInfluence (): number {

        const windVal = windManager.actualValue

        // bezvetrie
        if (windVal.speed === 0) windVal.direction = WindDirection.N

        // vetry v smere skoku
        const jumpDirections = [
            (this.JUMP_DIRECTION + 7) % 8,
            (this.JUMP_DIRECTION) % 8,
            (this.JUMP_DIRECTION + 1) % 8
        ]

        // vetry v protismere skoku
        const jumpOppositeDirections = [
            (this.JUMP_DIRECTION + 4 + 7) % 8,
            (this.JUMP_DIRECTION + 4) % 8,
            (this.JUMP_DIRECTION + 4 + 1) % 8
        ]

        // default je ked fuka protivietor
        let windCoef = flightConfig.windDirectionCoef

        if (WindDirection[windVal.direction].length === 2) windCoef /= 2

        if (jumpOppositeDirections.includes(windVal.direction)) {

            // pre opacne otocime znamienko - fuka od chrbta
            windCoef *= -1

        } else if (!jumpDirections.includes(windVal.direction)) {

            // ak nieje ani v smere tak nastavime na 0
            windCoef = 0

        }

        return windVal.speed * windCoef

    }

    /**
     * check raycast which ends phase
     */
    private checkRaycast (): void {

        // ak by sme nemali impulz smerom hore, tak skokan pada v podstate hned dole a prvou
        // podmienkou osetrime to, aby sa hned nepreplo na fazu pristavania
        if (
            player.physicsBody.position.y < this.startingYposition - 1 &&
            player.intersectionDistance <= flightConfig.distanceStartNextPhase
        ) {

            this.startNextPhase()

        }

    }

    /**
     * Spustenie nasledujucej fazy
     */
    private startNextPhase (): void {

        if (this.nextPhaseStarted) return

        this.nextPhaseStarted = true

        this.callbackNextPhase()

    }

    /**
     * Ukoncene fazy
     */
    finishPhase (): void {

        // Set inputs to disabled on landing
        store.commit('InputsState/SET_DISABLED', true)
        store.commit('ActionButtonState/SET_DISABLED', true)

        if (this.ended) return

        this.ended = true

        audioManager.stopAudioByName(AudioNames.heartbeat)
        audioManager.stopAudioByName(AudioNames.audienceHype)

        const averageFlight = endCalculationsManager.setActualCalculatedData(
            CalculatedDataTypesForOneJump.flightQuality,
            flightBalanceManager.getAverageQuality()
        ) as number

        console.log(`FLIGHT average quality: ${averageFlight}`)
        trainingTasks.saveTaskValue(Tasks.flight, averageFlight)
        
        const landingQuality = endCalculationsManager.getActualCalculatedData().landingQuality
        trainingTasks.saveTaskValue(Tasks.landing, landingQuality)

        this.callbackEnd()

    }

    /**
     * reset
     */
    reset (): void {

        flightBalanceManager.reset()

        store.commit('FlightBalanceState/SET_STATE', {
            isActive: false,
            valueX: 0,
            valueY: 0
        })

        this.nextPhaseStarted = false
        this.ended = false
        this.startingYposition = 0
        this.debugFrameCount = 0

    }

}
