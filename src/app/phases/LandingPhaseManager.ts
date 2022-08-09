import {
    audioManager, CANNON, fpsManager, THREE, MobileDetector, gsap, type CollisionEvent, game,
    playersManager, modes, trainingManager, tutorialManager, corePhasesManager
} from '@powerplay/core-minigames'
import { inputsManager } from '../InputsManager'
import { player } from '../Player'
import {
    type DisciplinePhaseManager, PlayerAnimationsNames, landingStates, type displayMessage, Tasks,
    CalculatedDataTypesForOneJump, WindDirection, TutorialObjectiveIds
} from '../types'
import { gameConfig, landingConfig } from '../config'
import { endCalculationsManager } from '../EndCalculationsManager'
import { hillCurveCalculator } from '../HillCurveCalculator'
import store from '@/store'
import { AudioGroups, AudioNames } from '../types/audio'
import { hill } from '../Hill'
import { trainingTasks } from '../modes/training/TrainingTasks'
import { startGateManager } from '../StartGateManager'
import { windManager } from '../WindManager'
import { endManager } from '../EndManager'
import { tutorialObjectives } from '../modes/tutorial/TutorialObjectives'

/**
 * Trieda na fazu pristavania
 */
export class LandingPhaseManager implements DisciplinePhaseManager {

    /** trigger konca fazy */
    endOfPhysicsMovementTrigger?: CANNON.Body;

    /** ci bezi animacia pristatia */
    isLandedAnimationRunning = false;

    /** ci sme stlacili akciu */
    actionPressed = false;

    /** ci faza skoncila */
    ended = false;

    /** ako daleko od idealneho bodu sme stlacili tlacidlo */
    distanceFromIdeal = -1;

    /** aktualny stav */
    actualState = landingStates.expectingInput;

    /** kolko sme presli */
    metersPassed = 0;

    /** kolko mame prejst */
    metersToPass!: number;

    /** ci sme uz pristali */
    isLanded = false;

    /** kde sme pristali na osi x */
    landedPositionX = 0;

    /** kolko frameov som na zemi */
    framesOnGround = 0;

    /** kolko frameov preslo po dopade */
    framesAfterLanding = 0;

    /** ci sme uz nastavili final kameru */
    isFinalCameraSet = false

    /** tween textu pri dopade */
    landingTextTween !: gsap.core.Tween

    /** Ci bolo skipnute alebo nie */
    skipped = false;

    /** pomocka tutorialu */
    private tutorialHelper = false

    /** da sa skipnut */
    private skippable = false
    
    /** krok pohybu po pade */
    private speedStepOnFall!: number
    
    /** pocitame framy pre znizenie rychlosti */
    private framesDecreaseSpeed = 0

    /** ako dlho zobrazujeme text pri dopade */
    private LANDING_MESSAGE_DURATION = 3

    /** po kolkych metroch vytvarame bod pre krivku  */
    private LADING_CURVE_PRECISION = 0.3;

    /** callback na zavolanie po akcii */
    callbackAction: () => unknown;

    /** callback na zavolanie po skonceni fazy */
    callbackEnd: () => unknown;

    /** Konstruktor */
    constructor (callbackAction: () => unknown, callbackEnd: () => unknown) {

        this.callbackAction = callbackAction
        this.callbackEnd = callbackEnd

    }

    /**
     * Pripravenie fazy
     */
    preparePhase (): void {

        //

    }

    /**
     * Zacatie fazy
     */
    startPhase (): void {

        console.warn('starting landing phase')
        if (modes.isTutorial() && tutorialManager.getActualSectionId() !== 13) {

            store.commit('ActionButtonState/SET_DISABLED', true)

        } else {

            store.commit('ActionButtonState/SET_DISABLED', false)

        }
        this.preparePhase()

        this.setUpCollision()

        this.setPhaseCameraSettings()
        
        player.speedStep = landingConfig.curveMovementSpeed / fpsManager.fpsLimit
        this.speedStepOnFall = landingConfig.curveMovementSpeedFoul / fpsManager.fpsLimit

    }
    
    /**
     * nastavime nastavenia kamery pre fazu
     */
    private setPhaseCameraSettings (): void {

        if (!landingConfig.cameraConfig.enabled) return

        player.changeCameraSettings(
            landingConfig.cameraConfig.idealOffset,
            landingConfig.cameraConfig.idealLookAt,
            landingConfig.cameraConfig.coefSize,
            landingConfig.cameraConfig.changeLerp
        )

    }

    /**
     * Update kazdy frame
     */
    update (): void {

        const distanceFromGround = player.intersectionDistance
        // netreba mi podmienku ak raycast nic nepretne a vrati 0?
        if (this.actualState === landingStates.expectingInput) {

            this.checkInputs(distanceFromGround)

        }

        if (this.actualState < landingStates.landingAnimation) {

            this.checkFoulDistance(distanceFromGround)

        }

        if (this.actualState === landingStates.landingAnimationLoop) {

            this.checkFinishLoop()

        }

        // TODO: Pridam stav
        if (
            this.actualState > landingStates.inputPressed &&
            this.actualState < landingStates.end
        ) {

            this.moveOnCurve()

        }

        if (this.actualState === landingStates.end) {

            this.finishPhase()

        }
        
        if (this.isLanded) {

            this.framesAfterLanding++
            
        }

        this.skipMovement()

    }

    /**
     * skipnutie po dopade
     */
    private skipMovement (): void {

        if (modes.isTutorial()) return
        if (!this.skippable || !inputsManager.actionPressed) return

        this.skipped = true

        // ukoncime vsetky tweeny
        gsap.globalTimeline.getChildren().forEach(t => t.kill())

        // stopneme vsetky animacne callbacky
        player.animationsManager.removeCallbacksFromAllAnimations()

        // vsetko UI dame prec, co treba
        store.commit('TakeoffState/RESET')
        store.commit('LandingState/RESET')

        this.finishPhase()

    }

    /**
     * Akcia na inputy
     */
    public inputsAction (distanceFromGround: number): void {

        // Guard
        if (this.actualState !== landingStates.expectingInput) return

        this.actualState++

        console.log(`LANDING height (pressed): ${distanceFromGround}`)
        const landingQuality = endCalculationsManager.setActualCalculatedData(
            CalculatedDataTypesForOneJump.landingQuality,
            this.getLandingQuality(distanceFromGround)
        ) as number

        console.log(`LANDING quality ${landingQuality}`)

        // ukoncenie predoslej fazy
        this.callbackAction()

        store.commit('FlightBalanceState/SET_STATE', {
            isActive: false
        })

        store.commit('InputsState/SET_VISIBLE', false)
        game.physics.setGravity(landingConfig.fallGravity)

    }
    
    /**
     * zatrasieme kamerou pri dopade
     */
    private shakeCameraOnGround (): void {
        
        if (!landingConfig.cameraShake.enabled) return
        
        const config = landingConfig.cameraShake
        const downLookAt = landingConfig.cameraConfig.idealLookAt.clone()
        downLookAt.y -= config.shiftDown
        
        player.changeCameraSettings(
            landingConfig.cameraConfig.idealOffset,
            downLookAt,
            landingConfig.cameraConfig.coefSize,
            config.shiftDownCameraLerp
        )
        
        gsap.timeline().to({}, {
            duration: config.shiftDownDuration,
            onComplete: () => {
            
                const upLookAt = landingConfig.cameraConfig.idealLookAt.clone()
                upLookAt.y += config.shiftUp
                
                player.changeCameraSettings(
                    landingConfig.cameraConfig.idealOffset,
                    upLookAt,
                    landingConfig.cameraConfig.coefSize,
                    config.shiftUpCameraLerp
                )
            
            }
        }).to({}, {
            duration: config.shiftUpDuration,
            onComplete: () => {
            
                // reset ak by sme nemali zapnute specificke settings pre fazu
                player.changeCameraSettings(undefined, undefined, undefined, 0.1)
                this.setPhaseCameraSettings()
            
            }
        })
        
    }

    /**
     * zistujeme ci sme na zemi
     */
    private onGroundLanding (): void {

        if (this.isLanded) return

        console.log('is landed!')
        
        this.shakeCameraOnGround()

        this.isLanded = true
        this.landedPositionX = player.physicsBody.position.x
        this.calculatePoints()

        // zapiseme este data o vetre
        const windData = windManager.actualValue
        endCalculationsManager.setActualCalculatedData(
            CalculatedDataTypesForOneJump.windValue,
            windData.speed
        )

        endCalculationsManager.setActualCalculatedData(
            CalculatedDataTypesForOneJump.windDirection,
            WindDirection[windData.direction]
        )

        audioManager.stopAudioByName(AudioNames.wind)

        if (endCalculationsManager.getActualCalculatedData().fall) {

            store.commit('StartPhaseState/SET_STATE', {
                value: 0,
                direction: '',
                showPlayerInfo: false,
                showWind: false,
                showSpeed: false
            })

        }

        audioManager.play(AudioNames.skiingLanding)
        audioManager.play(AudioNames.skiing)

        this.showLandingText()

        playersManager.setPlayerResults(
            endCalculationsManager.getActualCalculatedData().points,
            endCalculationsManager.getActualCalculatedData().meters
        )

        playersManager.setStandings()
        console.log('STANDINGS', playersManager.getStandings())

        const animationsSad = [PlayerAnimationsNames.fall, PlayerAnimationsNames.twoFootedTouch]
        if (
            endCalculationsManager.getActualCalculatedData().meters - gameConfig.kPoint < 0 ||
            animationsSad.includes(player.landingAnimation)
        ) {

            audioManager.play(AudioNames.audienceSad)

        } else {

            audioManager.play(AudioNames.audienceYay)

        }

        gsap.to({}, {
            duration: 0.5,
            onComplete: () => {

                this.skippable = true

            }
        })
        
        this.playLandingAudio()

        // ukoncime pri pade
        if (endCalculationsManager.getActualCalculatedData().fall) return

        endCalculationsManager.setInformations()
        
        const attemptCount = corePhasesManager.disciplineAttemptsCount
        
        store.commit(
            'UiState/SET_FINISH_TOP_BOX_VISIBILITY',
            ((!modes.isTutorial() && !modes.isTrainingMode()) &&
            (corePhasesManager.disciplineActualAttempt === attemptCount))
        )
        this.setFinishTopBoxData()

    }
    
    /**
     * nastavime data pre top box
     */
    private setFinishTopBoxData (): void {
        
        if (!playersManager.isPlayerImproved()) return
        
        const personalBest = playersManager.getPlayer().personalBest
        const points = endCalculationsManager.getTotalPointsAllAttempts()
        const position = playersManager.getPlayerActualPosition()
        
        const showFirstBox = position < 4
        const showSecondBox = false // nezobrazujeme vobec
        
        store.commit('FinishTopBoxState/SET_STATE', {
            showFirstBox: showFirstBox,
            showSecondBox: showSecondBox,
            firstPlace: position === 1,
            personalBest: points === personalBest,
            newPersonalBest: points > personalBest,
            position: position
        })
        
        if (!showFirstBox && !showSecondBox) {

            store.commit(
                'UiState/SET_FINISH_TOP_BOX_VISIBILITY',
                false
            )
        
        }
        
    }
    
    /**
     * nastavime audio po dopade
     */
    private playLandingAudio (): void {
        
        this.playCommentJumpQuality()
        
        if (modes.isDailyLeague()) return
        this.playLandingAudioFinalJump()
        
    }
    
    /**
     * zahrame komentatora po konecnom dopade
     */
    private playLandingAudioFinalJump (): void {
        
        const attempt = corePhasesManager.disciplineActualAttempt
        const maxAttempt = corePhasesManager.disciplineAttemptsCount
        if (attempt < maxAttempt) return
        
        const pos = playersManager.getPlayerActualPosition()
        let audio = AudioNames.commentAfterSecondJump6
        
        if (pos === 1) {
            
            audio = AudioNames.commentAfterSecondJump1
            
        } else if (pos <= 3) {
            
            audio = AudioNames.commentAfterSecondJump23
            
        } else if (pos <= (modes.isDailyLeague() || modes.isBossFight() ? 10 : 5)) {
            
            audio = AudioNames.commentAfterSecondJump45
            
        }
                
        audioManager.play(audio)
        
    }
    
    /**
     * zahrame komentatora po ne poslednom dopade
     */
    private playCommentJumpQuality (): void {
        
        const attempt = corePhasesManager.disciplineActualAttempt
        const maxAttempt = corePhasesManager.disciplineAttemptsCount
        if (attempt >= maxAttempt && !modes.isDailyLeague()) return
        
        const calculatedData = endCalculationsManager.getActualCalculatedData()
        const landingQuality = calculatedData.landingQuality
        const fall = calculatedData.fall
        let audio = AudioNames.commentAfterLandingDefault
        
        if (landingQuality >= landingConfig.telemarkMinQualityPoor) {
            
            if (endCalculationsManager.isOverHillSize) {

                audio = AudioNames.commentAfterLandingHsTelemark

            }
            if (endCalculationsManager.isOverKpoint) {

                audio = AudioNames.commentAfterLandingKpointTelemark

            }
            
        } else if (landingQuality >= landingConfig.minQualityTwoFooted) {
            
            if (endCalculationsManager.isOverHillSize) {

                audio = AudioNames.commentAfterLandingHsTwoFooted

            }
            if (endCalculationsManager.isOverKpoint) {

                audio = AudioNames.commentAfterLandingKpointTwoFooted

            }
        
        } else if (fall) {
            
            audio = AudioNames.commentAfterLandingFall
          
        } else if (endCalculationsManager.isTouchedSnow) {
            
            audio = AudioNames.commentAfterLandingHandTouch
          
        }
        
        if (!audio) return
        
        audioManager.stopAudioByGroup(AudioGroups.commentators)
        audioManager.play(audio)
        
    }

    /**
     * shows text when landing
     */
    private showLandingText (): void {

        const message = this.getLandingText()
        const { meters, points } = endCalculationsManager.getActualCalculatedData()
        
        let personalBestText = ''
        const personalBest = playersManager.getPlayer().personalBest
        if (points > personalBest) personalBestText = 'newPersonalBest'
        if (points === personalBest) personalBestText = 'personalBest'

        store.commit('LandingState/SET_STATE', {
            isActive: true,
            color: message.color,
            text: message.text,
            meters: `${meters.toFixed(1)}m`,
            personalBestText: personalBestText
        })

        this.landingTextTween = gsap.to({}, {
            duration: this.LANDING_MESSAGE_DURATION,
            onComplete: () => {

                store.commit('LandingState/SET_STATE', {
                    isActive: false
                })

            }

        })

    }

    /**
     * ziskame text a farbu podla telemarku
     * @returns - text a farba textu
     */
    private getLandingText (): displayMessage {

        const message = { text: 'fall', color: 2 }

        const quality = endCalculationsManager.getActualCalculatedData().landingQuality

        if (quality >= landingConfig.telemarkMinQualityIdeal) {

            message.text = 'perfectLanding'
            message.color = 0

        } else if (quality >= landingConfig.telemarkMinQualityMedium) {

            message.text = 'excellentLanding'
            message.color = 0

        } else if (quality >= landingConfig.telemarkMinQualityPoor) {

            console.warn('yellow color not implemented')

            message.text = 'goodLanding'
            message.color = 0

        } else if (quality >= landingConfig.minQualityTwoFooted) {

            message.text = 'poorLanding'
            message.color = 1

        } else if (!endCalculationsManager.getActualCalculatedData().fall) {

            message.text = 'lateLanding'
            message.color = 1

        }

        return message

    }

    /**
     * check if player triggered input
     * @param distanceFromGround - Vzdialenost od zeme
     */
    private checkInputs (distanceFromGround: number): void {

        if (modes.isTutorial() && tutorialManager.getActualSectionId() !== 13) {

            if (distanceFromGround < 3) {

                if (!this.tutorialHelper) {

                    this.tutorialHelper = true
                    tutorialManager.nextSection()

                }

            }

            if (!this.tutorialHelper) return

        }

        if (MobileDetector.isMobile()) {

            if (store.getters['ActionButtonState/getLandingPressed'] && !this.actionPressed) {

                /** Dolezite aby bolo id 13 inak sme v zlom tutoriale */
                if (tutorialManager.getActualSectionId() === 13) {

                    tutorialObjectives.passObjective(TutorialObjectiveIds.landing as string)

                }
                this.inputsAction(distanceFromGround)

            }

        } else {

            // on action pressed
            if (inputsManager.actionPressed && !this.actionPressed) {

                /** Dolezite aby bolo id 13 inak sme v zlom tutoriale */
                if (tutorialManager.getActualSectionId() === 13) {

                    tutorialObjectives.passObjective(TutorialObjectiveIds.landing as string)

                }
                this.inputsAction(distanceFromGround)

            }

        }

    }

    /**
     * pohubujeme sa po krivke
     */
    moveOnCurve (): void {

        if (!hillCurveCalculator.landingCurveObject) this.setUpMovementOnCurve()
        
        this.framesDecreaseSpeed++
        
        if (!(this.framesDecreaseSpeed % landingConfig.speedDecreaseFrames)) {

            player.speedStep *= landingConfig.speedDescreaseCoef
        
        }

        let speed = player.speedStep
        if (endCalculationsManager.getActualCalculatedData().fall) {

            speed = this.speedStepOnFall

        }

        this.metersPassed += speed

        if (this.metersPassed > this.metersToPass) {

            this.metersPassed = this.metersToPass
            if (!endCalculationsManager.getActualCalculatedData().fall) {

                this.actualState = landingStates.end

            }

        }
        const point = hillCurveCalculator.landingCurveObject?.getPoint(
            this.metersPassed / this.metersToPass
        )

        if (!point) return

        const offsetY = 1 // offset aby sme neboli pod zemou
        player.physicsBody.position.set(
            point.x,
            point.y + offsetY,
            player.physicsBody.position.z
        )

    }

    /**
     * nastavime pohyb po krivke
     */
    setUpMovementOnCurve (): void {

        this.metersToPass = landingConfig.metersToPassOnFoul
        if (!endCalculationsManager.getActualCalculatedData().fall) {

            this.metersToPass = player.physicsBody.position.x - landingConfig.posEndPhaseX

        }

        // vypocitame krivku
        hillCurveCalculator.calculateLandingCurve(
            new THREE.Vector3(
                player.physicsBody.position.x,
                player.physicsBody.position.y,
                player.physicsBody.position.z
            ),
            this.metersToPass,
            this.LADING_CURVE_PRECISION
        )
        player.physicsBody.type = CANNON.BODY_TYPES.STATIC

    }

    /**
     * kontrola ci loop bezi dost dlho
     */
    checkFinishLoop (): void {

        if (this.actualState !== landingStates.landingAnimationLoop || !this.isLanded) return

        this.framesOnGround++
        const secondsPassed = this.framesOnGround / fpsManager.fpsLimit
        const landingQuality = endCalculationsManager.getActualCalculatedData().landingQuality
        const wasTelemark = landingQuality >= landingConfig.telemarkMinQualityPoor

        // ak ma este bezat loop tak koncime
        if (secondsPassed < landingConfig.secondsToPlayLoop && wasTelemark) return

        this.actualState = landingStates.afterLoopAnimation

        player.afterLoopAction(landingQuality, () => {

            this.actualState = landingStates.emotion
            this.playEmotion()

        })

    }

    /**
     * determines which animation emotion to play and plays it
     */
    private playEmotion (): void {

        const callback = () => {

            this.actualState = landingStates.afterEmotion

        }

        if (modes.isTrainingMode()) {

            store.commit('TrainingState/SET_HIGH_SCORE', {
                newHighScore: Math.ceil(trainingManager.getNewPotentialHighScore()),
                showNewHighScore: trainingManager.isNewHighScore()
            })

        }
        
        const emotion = player.getEmotionAnimation()
        if (emotion) {
        
            player.playEmotionAnimation(emotion, callback)
        
        } else {
        
            callback()
        
        }

    }

    /**
     * sets flags based on distance from ground
     * @param distance - Vzdialenost od zeme
     */
    private checkFoulDistance (distance: number): void {

        if (distance < landingConfig.foulHeight) {

            // foul budeme davat iba ked nepojde o najazdove okno pre zaciatocnikov
            if (this.actualState === landingStates.expectingInput) {

                if (startGateManager.isHighestGateForBegginers()) {

                    this.setNormalLandingForNoobs()

                } else {

                    console.log(`LANDING height (NOT pressed): ${distance} => 0`)
                    this.setFoul()

                }

            }

            this.onGroundLanding()

        }

    }

    /**
     * nastavime koliziu so zemou
     */
    private setUpCollision (): void {

        console.log('setting up collision')

        player.physicsBody.addEventListener('collide', this.onCollideWithPlayer)

    }

    /**
     * Callback pri kolidovani s hracom
     * @param e - Event pre kolizie
     */
    onCollideWithPlayer = (e: CollisionEvent): void => {

        console.log('e.body.name:', e.body.name, 'e:', e)

        if (hill.allPhysicalMeshNames.includes(e.body.name ?? '')) {

            // ak sme na zemi tak je vzdialenost od zeme 0
            this.collisionEventWork()

        }

    }

    /**
     * Spravenie veci po kolizii so zemou
     */
    private collisionEventWork () {

        if (this.actualState === landingStates.inputPressed) {

            this.actualState++

            // ground
            player.landingAction(
                endCalculationsManager.getActualCalculatedData().landingQuality, () => {

                    this.actualState = landingStates.landingAnimationLoop

                }
            )

        }

        this.checkFoulDistance(0)
        game.togglePhysics(false)
        player.putPlayerOnSurface()

    }

    /**
     * Nastavenie padu
     */
    private setFoul (): void {

        // ukoncenie predoslej fazy
        this.callbackAction()

        this.actualState = landingStates.foul

        endCalculationsManager.setActualCalculatedData(
            CalculatedDataTypesForOneJump.fall,
            true
        )

        const landingQuality = endCalculationsManager.setActualCalculatedData(
            CalculatedDataTypesForOneJump.landingQuality,
            this.getLandingQuality(0)
        ) as number
        player.landingFoul(() => {

            gsap.to({}, {
                duration: 4,
                onComplete: () => {

                    player.animationsManager.resetSpeed()
                    this.actualState = landingStates.end
                
                }
            })

        })
        console.log(`LANDING FAILED quality ${landingQuality}`)
        trainingTasks.saveTaskValue(Tasks.landing, landingQuality)

        store.commit('FlightBalanceState/SET_STATE', {
            isActive: false
        })

        store.commit('InputsState/SET_VISIBLE', false)

    }

    /** Metoda pre pripad trenovania a teda sa tvarime ze je good guy */
    private setNormalLandingForNoobs (): void {

        this.actualState++

        console.log(`LANDING height (not-pressed-training): ${0}`)
        const landingQuality = endCalculationsManager.setActualCalculatedData(
            CalculatedDataTypesForOneJump.landingQuality,
            0
        ) as number

        // ukoncenie predoslej fazy
        this.callbackAction()

        player.landingAction(landingQuality, () => {

            this.actualState = landingStates.landingAnimationLoop

        })

        trainingTasks.saveTaskValue(Tasks.landing, landingQuality)

        store.commit('FlightBalanceState/SET_STATE', {
            isActive: false
        })

        store.commit('InputsState/SET_VISIBLE', false)

        this.actualState = landingStates.foul

    }

    /**
     * vypocitanie bodov po dopade
     */
    private calculatePoints (): void {

        endCalculationsManager.calculateLandingDistance(this.landedPositionX)
        endCalculationsManager.getTotalPoints()

    }
    
    /**
     * gets lading quality based on height in which player clicked
     *
     * @returns landing quality
     */
    private getLandingQuality (realHeight: number): number {

        let quality = realHeight / landingConfig.idealActionHeight

        if (quality > 1) quality = 1

        return quality

    }

    /**
     * Ukoncene fazy
     */
    finishPhase (): void {

        if (this.ended) return

        const landingQuality = endCalculationsManager.getActualCalculatedData().landingQuality
        const wasTelemark = landingQuality >= landingConfig.telemarkMinQualityPoor

        if (wasTelemark) endManager.telemarksLog += 1
        
        console.warn('finishing landing phase!')

        // this.landingTextTween.kill()

        player.physicsBody.removeEventListener('collide', this.onCollideWithPlayer)

        this.ended = true

        this.callbackEnd()

        audioManager.stopAudioByName(AudioNames.skiing)

    }

    /**
     * Resetovanie managera
     */
    reset (): void {

        this.isLandedAnimationRunning = false
        this.actionPressed = false
        this.ended = false
        this.distanceFromIdeal = -1
        this.metersToPass = 0
        this.actualState = landingStates.expectingInput
        this.metersPassed = 0
        this.isLanded = false
        this.landedPositionX = 0
        this.framesOnGround = 0
        this.framesAfterLanding = 0
        this.isFinalCameraSet = false
        hillCurveCalculator.landingCurveObject = undefined
        this.skippable = false
        this.skipped = false

    }

}
