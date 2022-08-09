import {
    gsap, game, THREE, CANNON, MobileDetector, errorManager, modes, tutorialManager, audioManager
} from '@powerplay/core-minigames'
import {
    AudioGroups,
    AudioNames,
    CalculatedDataTypesForOneJump,
    Tasks,
    TutorialObjectiveIds,
    type DisciplinePhaseManager,
    type displayMessage} from '../types'
import { player } from '../Player'
import { inputsManager } from '../InputsManager'
import { descentConfig, END_OF_SPRING_BOARD_POSITION, takeoffConfig } from '../config'
import { hill } from '../Hill'
import store from '@/store'
import { trainingTasks } from '../modes/training/TrainingTasks'
import { startGateManager } from '../StartGateManager'
import { endCalculationsManager } from '../EndCalculationsManager'
import { endManager } from '../EndManager'
import { tutorialObjectives } from '../modes/tutorial/TutorialObjectives'
/**
 * Faza na spravu odrazu
 */
export class TakeOffPhaseManager implements DisciplinePhaseManager {

    /** ci uz je mozne odstartovat */
    private startable = false;

    /** ci faza skoncila */
    private ended = false;

    /** ideal takeoff point */
    private idealTakeoffPoint!: CANNON.Vec3;

    /** impulz aplikovany na konci fazy */
    private impulse!: CANNON.Vec3

    /** ci je nastaveny impulz */
    private isImpulseSet = false;

    /** Ci sa preslo triggerom alebo este nie */
    private passedTrigger = false;

    /** Rychlost pri odraze v m/s */
    private takeoffSpeed = 0;

    /** Kvalita odrazu */
    private quality = 0

    /** Pomocny vector pre tutorial */
    private tutorialVec: CANNON.Vec3 = new CANNON.Vec3()

    /** Pomocka pre tutorial */
    private tutorialHelperBool = false

    /** ci sme zavolali takeoff */
    isTakeoffCalled = false

    /** tween textu pri odraze */
    takeoffTextTween !: gsap.core.Tween

    /** tween to set this.startable = true */
    setIsStartableTween !: gsap.core.Tween

    /** ako dlho zobrazujeme text pri odraze */
    private TAKEOFF_MESSAGE_DURATION = 3
    
    /** ci sme klikli pred idealnym miestom */
    isClickBefore = false

    /** callback na zavolanie pre vypocet impulzu a velocity */
    private callbackOnAction: () => unknown;

    /** Callback na zavolanie pred odrazenim */
    private callbackBeforeTakeoff: () => unknown;

    /** callback na zavolanie po skonceni fazy */
    private callbackEnd: () => unknown;

    /** Konstruktor */
    constructor (
        callbackOnAction: () => unknown,
        callbackBeforeTakeoff: () => unknown,
        callbackEnd: () => unknown
    ) {

        this.callbackOnAction = callbackOnAction
        this.callbackBeforeTakeoff = callbackBeforeTakeoff
        this.callbackEnd = callbackEnd

    }

    /**
     * Pripravenie fazy
     */
    preparePhase (): void {

        this.createIdealTakeoffPoint()
        this.showIdeal()

    }

    /**
     * creates ideal takeoff point
     */
    private createIdealTakeoffPoint (): void {

        const idealPoint = new THREE.Vector3(
            takeoffConfig.idealTakeoffPointX,
            player.physicsBody.position.y,
            END_OF_SPRING_BOARD_POSITION.z
        )
        const raycaster = new THREE.Raycaster(idealPoint, new THREE.Vector3(0, -1, 0), 0, 100)
        const intersects = raycaster.intersectObject(hill.springBoardMesh)

        if (!intersects[0]) {

            throw new Error(errorManager.showBox('intersect of spring board and ideal is missing'))

        }

        idealPoint.y = idealPoint.y - intersects[0].distance

        this.idealTakeoffPoint = new CANNON.Vec3(
            idealPoint.x,
            idealPoint.y,
            idealPoint.z
        )

    }

    /**
     * show end of phase trigger
     */
    private showIdeal (): void {

        const mesh = game.getMesh('JumpIndicator')
        if (!mesh) {

            throw new Error('Jump indicator is missing!')

        }

        mesh.position.set(
            this.idealTakeoffPoint.x,
            this.idealTakeoffPoint.y,
            this.idealTakeoffPoint.z
        )
        mesh.updateMatrix()

    }

    /**
     * Zacatie fazy
     */
    startPhase (): void {

        console.warn('starting takeoff phase')
        // this.preparePhase()
        if (modes.isTutorial() && tutorialManager.getActualSectionId() !== 13) {

            store.commit('ActionButtonState/SET_DISABLED', true)

        } else {

            store.commit('ActionButtonState/SET_DISABLED', false)

        }

        // prevents immediate game finish
        this.setIsStartableTween = gsap.to({}, {
            onComplete: () => {

                this.startable = true

            },
            callbackScope: this,
            duration: 0.5
        })

        // ak treba zmenime kameru
        if (takeoffConfig.cameraConfig.enabled) {

            player.changeCameraSettings(
                takeoffConfig.cameraConfig.idealOffset,
                takeoffConfig.cameraConfig.idealLookAt,
                takeoffConfig.cameraConfig.coefSize,
                takeoffConfig.cameraConfig.changeLerp
            )

        }

    }

    /**
     * Update kazdy frame
     */
    update (): void {
        
        /** Musime to riesit iba okrem casu ked uz zbierame body */
        if (modes.isTutorial() && tutorialManager.getActualSectionId() !== 13) {

            // pozerat ci je na perfektnom mieste a vtedy zastavit hru.
            this.tutorialVec.x = player.physicsBody.position.x
            this.tutorialVec.y = player.physicsBody.position.y - descentConfig.coefAdjustPositionY
            this.tutorialVec.z = player.physicsBody.position.z
            const dist = this.tutorialVec.distanceTo(this.idealTakeoffPoint)
            if (dist <= 0.5) {

                if (!this.tutorialHelperBool) {

                    this.tutorialHelperBool = true
                    tutorialManager.nextSection()

                }

            }

            if (!this.tutorialHelperBool) return

        }

        // Po kliknuti vypocitame impulz
        if (MobileDetector.isMobile()) {

            if (!this.isImpulseSet && store.getters['ActionButtonState/getTakeOffPressed']) {

                /** Dolezite aby bolo id 13 inak sme v zlom tutoriale */
                if (tutorialManager.getActualSectionId() === 13) {

                    tutorialObjectives.passObjective(TutorialObjectiveIds.jump as string)

                }
                this.calculateImpulse(true)

            }

        } else {

            if (!this.isImpulseSet && inputsManager.actionPressed) {

                /** Dolezite aby bolo id 13 inak sme v zlom tutoriale */
                if (tutorialManager.getActualSectionId() === 13) {

                    tutorialObjectives.passObjective(TutorialObjectiveIds.jump as string)

                }
                this.calculateImpulse(true)

            }

        }

        // ked sme este nepresli triggerom, tak zistujeme, ci sa tak nestalo
        if (
            !this.passedTrigger &&
            player.physicsBody.position.x <= takeoffConfig.triggerFinishPhaseX
        ) {

            this.passedTrigger = true
            this.finishPhase()

        }

        if (
            player.physicsBody.position.x <= takeoffConfig.takeoffAnimationPositionX &&
            !this.isTakeoffCalled
        ) {

            this.isTakeoffCalled = true
            game.togglePhysics(true)
            player.takeoff(takeoffConfig.takeoffAnimationSpeed)

        }

        player.physicsBody.velocity.z = 0 // toto musime robit, aby nam nesiel do stran

    }

    /**
     * Vtpocitanie impulzu
     * @param isClicked - ci bolo kliknute
     */
    public calculateImpulse (isClicked: boolean): void {

        this.isImpulseSet = true

        this.quality = this.getTakeoffQuality(!isClicked)

        trainingTasks.saveTaskValue(Tasks.takeOff, this.quality)

        console.log(`takeoff quality is ${this.quality}`)

        const impulseY = this.getYimpulse(this.quality)
        this.impulse = new CANNON.Vec3(
            0,
            impulseY,
            0
        )

        this.callbackOnAction()
        this.showTakeoffMessage()

        console.log('ODRAZ .. impulse:', this.impulse)

    }

    /**
     * zobrazime takeoff message
     */
    showTakeoffMessage (): void {

        const message = this.getTakeoffText()

        store.commit('TakeoffState/SET_STATE', {
            isActive: true,
            color: message.color,
            text: message.text
        })

        this.takeoffTextTween = gsap.to({}, {
            duration: this.TAKEOFF_MESSAGE_DURATION,
            onComplete: () => {

                store.commit('TakeoffState/SET_STATE', {
                    isActive: false
                })

            }

        })

    }

    /**
     * ziskame text a farbu podla odrazu
     * @returns - text a farba textu
     */
    private getTakeoffText (): displayMessage {

        const message = { text: 'poorTakeOff', color: 2 }

        if (this.quality >= takeoffConfig.takeoffQuality.perfect) {

            message.text = 'perfectTakeOff'
            message.color = 0

            endManager.perfectTakeoffsLog += 1

        } else if (this.quality >= takeoffConfig.takeoffQuality.excellent) {

            message.text = 'excellentTakeOff'
            message.color = 0

        } else if (this.quality >= takeoffConfig.takeoffQuality.good) {

            message.text = 'goodTakeOff'
            message.color = 1

        }

        return message

    }

    /**
     * gets coeficient to multiply velocity on X axis
     *
     * @param quality-kvalita skoku
     * @returns Coef
     */
    private getVelocityCoef (): number {

        const maxVelocityCoef = 0.99 - startGateManager.startPercent * 0.001

        const {
            highestStartGate, otherGates, secondHighestStartGate
        } = takeoffConfig.minVelocityCoefSub

        let coefSub = otherGates
        if (startGateManager.isHighestGateForBegginers()) coefSub = highestStartGate
        if (startGateManager.isSecondHighestGateForBegginers()) coefSub = secondHighestStartGate

        const minVelocityCoef = maxVelocityCoef - coefSub
        const attributeCoef = startGateManager.getAttributeCoef()

        return minVelocityCoef + attributeCoef * (maxVelocityCoef - minVelocityCoef)

    }

    /**
     * gets takeoff quality based on distance from ideal zone
     * @param notClicked - Ci hrac neklikol
     * @returns takeoff Quality
     */
    private getTakeoffQuality (notClicked = false): number {

        if (notClicked) return 0

        const playerPosition = player.physicsBody.position.clone()
        // musime este dat naspat to, co sme pridali na y, aby to sedelo s tratou
        playerPosition.y -= descentConfig.coefAdjustPositionY
        
        if (playerPosition.x > this.idealTakeoffPoint.x) this.isClickBefore = true

        const distance = playerPosition.distanceTo(this.idealTakeoffPoint)
        let takeoffDifference = distance - takeoffConfig.idealTakeoffOffset
        if (takeoffDifference < 0) takeoffDifference = 0

        console.log(
            `TAKEOFF click position x: ${player.physicsBody.position.x}`,
            `, distance diff from ideal ${takeoffDifference}`
        )

        const coef = takeoffConfig.coefTakeoffQuality
        let quality = (coef - takeoffDifference) / coef
        if (quality < 0) quality = 0

        const takeoffQuality = endCalculationsManager.setActualCalculatedData(
            CalculatedDataTypesForOneJump.takeoffQuality,
            quality
        ) as number

        return takeoffQuality

    }

    /**
     * gets impulse on axis Y
     *
     * @param quality-kvalita skoku
     *
     * @returns impulse on axis Y
     */
    private getYimpulse (quality: number): number {

        const max = takeoffConfig.maxImpulseY

        const { highestStartGate, otherGates, secondHighestStartGate } = takeoffConfig.minImpulseY

        let min = otherGates
        if (startGateManager.isHighestGateForBegginers()) min = highestStartGate
        if (startGateManager.isSecondHighestGateForBegginers()) min = secondHighestStartGate

        return ((max - min) * quality) + min

    }

    /**
     * Nastavenie rychlosti pri odraze
     * @param speed - Rychlost
     */
    setTakeoffSpeed (speed: number): void {

        console.log(`set takeoff speed ${speed}`)
        this.takeoffSpeed = speed

        store.commit('SpeedMeterState/SET_STATE', {
            takeoffSpeed: speed * 3.6
        })

    }

    /**
     * Ukoncene fazy
     */
    finishPhase (): void {

        this.startable = false

        if (this.ended) return

        if (this.setIsStartableTween) this.setIsStartableTween.kill()

        // pred vypoctom velocity musime este zavolat callback, aby sa zapisala takeoff speed
        this.callbackBeforeTakeoff()

        if (!this.isImpulseSet) {

            this.calculateImpulse(false)

        }

        player.physicsBody.type = CANNON.BODY_TYPES.DYNAMIC

        const velocityCoef = this.getVelocityCoef()
        console.log('Velocity Coef', velocityCoef)
        player.physicsBody.velocity.x = -this.takeoffSpeed * velocityCoef

        player.physicsBody.applyImpulse(this.impulse)

        this.ended = true
        if (modes.isTutorial() && tutorialManager.getActualSectionId() !== 13) {

            setTimeout(() => {

                tutorialManager.nextSection()

            }, 1000)

        }
        
        this.playFinishCommentator()

        this.callbackEnd()

    }
    
    /**
     * nastavime finish audio
     */
    private playFinishCommentator (): void {

        let audio = AudioNames.commentAfterTakeoffGoodOrWorseLate
        
        if (this.quality >= takeoffConfig.takeoffQuality.excellent) {
            
            audio = AudioNames.commentAfterTakeoffExcellentOrBetter

        } else if (this.isClickBefore) {
            
            audio = AudioNames.commentAfterTakeoffGoodOrWorseEarly

        }
        
        if (!audio) return
        
        audioManager.stopAudioByGroup(AudioGroups.commentators)
        audioManager.play(audio)
        
    }

    /**
     * reset
     */
    reset (): void {

        this.startable = false
        this.ended = false
        this.isImpulseSet = false
        this.passedTrigger = false
        this.takeoffSpeed = 0
        this.quality = 0
        this.isTakeoffCalled = false
        store.commit('SpeedMeterState/SET_STATE', {
            speed: 0,
            takeoffSpeed: 0
        })

    }

}
