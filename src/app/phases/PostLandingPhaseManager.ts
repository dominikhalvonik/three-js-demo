import {
    CANNON, THREE, CallbackAnimationTypes, audioManager, modes, CameraStates, fpsManager,
    cameraManager
} from '@powerplay/core-minigames'
import { player } from '../Player'
import {
    AudioNames, type DisciplinePhaseManager
} from '../types'
import { postLandingConfig } from '../config'
import { endCalculationsManager } from '../EndCalculationsManager'
import { inputsManager } from '../InputsManager'
import store from '@/store'
import { endManager } from '../EndManager'
import { tutorialFlow } from '../modes/tutorial/TutorialFlow'

/**
 * Trieda na fazu pristavania
 */
export class PostLandingPhaseManager implements DisciplinePhaseManager {

    /** ci faza skoncila */
    ended = false;

    /** ci sme zacali staticky pohyb */
    isStaticMovementStarted = false;

    /** krivka pocas ktorej urobi lyziar animaciu END */
    curveEndAnimation!: THREE.QuadraticBezierCurve3;

    /** konecna krivka */
    private curve!: THREE.CatmullRomCurve3
    
    /** dlzka krivky */
    private curveLength = 0
    
    /** kolko metrov na krivke sme presli */
    private metersPassed = 0

    /** aktualna pozicia na krivke endAnimation */
    actualPositionEndAnimation = 0

    /** ci je aktivny pohyb na krivke */
    isMoveOnCurveActive = false;
    
    /** Ci uz bola prehrana emocna animacia */
    private playedEmotionAnimation = false;

    /** posledna pozicia hraca */
    finalEndPoint!: THREE.Vector3;

    /** smer raycastu */
    rayDirection = new THREE.Vector3(0, -1, 0)
    
    /** pocitadlo framov fazy */
    private frames = 0
    
    /** tween na ukoncenie fazy */
    private finishPhaseTween!: gsap.core.Tween
    
    /** callback na zavolanie po skonceni fazy */
    callbackEnd: () => unknown;

    /** Konstruktor */
    constructor (callbackEnd: () => unknown) {

        this.callbackEnd = callbackEnd

    }

    /**
     * Pripravenie fazy
     */
    preparePhase (): void {

        // zatial nic

    }

    /**
     * Zacatie fazy
     */
    startPhase (): void {

        console.warn('starting post landing phase')
        this.preparePhase()
        player.physicsBody.type = CANNON.BODY_TYPES.STATIC

        this.setFinalCamera()
        
        // preskocenie animacii pri foule
        if (endCalculationsManager.getActualCalculatedData().fall) {

            this.isStaticMovementStarted = true
            this.isMoveOnCurveActive = false
            this.finishPhase()

        }
        store.commit('UiState/SET_FINISH_TOP_BOX_VISIBILITY', false)

        // ak treba zmenime kameru
        // if (postLandingConfig.cameraConfig.enabled) {

        //     player.changeCameraSettings(
        //         postLandingConfig.cameraConfig.idealOffset,
        //         postLandingConfig.cameraConfig.idealLookAt,
        //         postLandingConfig.cameraConfig.coefSize,
        //         postLandingConfig.cameraConfig.changeLerp
        //     )

        // }

    }

    /**
     * Nastavenie finalnej kamery
     */
    private setFinalCamera (): void {

        cameraManager.setState(CameraStates.disciplineOutro)
        cameraManager.playTween()
    
        store.commit('StartPhaseState/SET_STATE', {
            value: 0,
            direction: '',
            showPlayerInfo: false,
            showWind: false,
            showSpeed: false
        })
    
        store.commit('InformationState/SET_STATE', {
            showState: true
        })
    
    }
    
    /**
     * Update kazdy frame
     */
    update (): void {

        this.frames++
        this.checkDecreaseSpeed()
        this.startStaticMovement()
        this.moveOnCurve()
        this.skipMovement()

    }
    
    /**
     * kontrola ci mame znizit rychlost pohybu po krivke
     */
    private checkDecreaseSpeed (): void {

        if (this.frames % postLandingConfig.speedDecreaseFrames) return
        
        player.speedStep *= postLandingConfig.speedDescreaseCoef
    
    }

    /**
     * Prehratie emocnej animacie
     */
    private playEmotionAnimation (): void {
        
        const emotion = player.getEmotionAnimation()
        
        player.animationsManager.resetSpeed()
        
        if (emotion) {

            player.animationsManager.addAnimationCallback(
                emotion,
                CallbackAnimationTypes.end,
                () => {

                    player.animationsManager.removeAnimationCallback(
                        emotion,
                        CallbackAnimationTypes.end
                    )
                    
                }
            )
            
            player.animationsManager.reset(emotion)
            player.animationsManager.changeTo(emotion)

        }
        
    }

    private skipMovement (): void {

        if (!inputsManager.actionPressed) return
        
        this.isMoveOnCurveActive = false
        this.playedEmotionAnimation = true
        
        audioManager.stopAudioByName(AudioNames.skiingBreak)

        // hadzalo chybu, tak osetrujeme
        if (this.finalEndPoint) {

            player.physicsBody.position.set(
                this.finalEndPoint.x,
                this.finalEndPoint.y,
                this.finalEndPoint.z
            )

        }

        player.putPlayerOnSurface()
        
        this.finishPhase()

    }

    /**
     * start static movement
     */
    private startStaticMovement (): void {

        if (this.isStaticMovementStarted) return

        this.isStaticMovementStarted = true

        this.curve = new THREE.CatmullRomCurve3(this.getRealCurvePoints())
        this.curveLength = this.curve.getLength()
        this.finalEndPoint = this.curve.getPointAt(1)
        
        // spustime animaciu
        player.playEndAnimation(true)
        player.animationsManager.setSpeed(postLandingConfig.animationSpeed)

        this.isMoveOnCurveActive = true
        
        audioManager.play(AudioNames.skiingBreak)

    }
    
    /**
     * zmenime offsety z konfigu na realne vektory
     * @returns pole vektorov
     */
    getRealCurvePoints (): THREE.Vector3[] {
        
        const offsets = postLandingConfig.curvePoints
        const vectors: THREE.Vector3[] = []
        
        for (let i = 0; i < offsets.length; i++) {
            
            if (i === 0) {

                vectors.push(offsets[i]
                    .clone()
                    .add(new THREE.Vector3(
                        player.physicsBody.position.x,
                        player.physicsBody.position.y,
                        player.physicsBody.position.z
                    )))
                continue
            
            }
            
            vectors.push(vectors[i - 1].clone().add(offsets[i]))
            
        }
        
        vectors.splice(0, 0, new THREE.Vector3(
            player.physicsBody.position.x,
            player.physicsBody.position.y,
            player.physicsBody.position.z
        ))
        
        return vectors
    
    }

    /**
     * hybeme lyziarom na spravnej krivke
     */
    private moveOnCurve (): void {

        if (!this.isMoveOnCurveActive) return
        
        const { minSpeed, finishInPercent, playEmotionAnimationInPercent } = postLandingConfig
        
        const speed = player.speedStep < minSpeed ? minSpeed : player.speedStep
        
        this.metersPassed += speed
        
        const curveEmotionPercent = this.curveLength * playEmotionAnimationInPercent
        if (!this.playedEmotionAnimation && this.metersPassed >= curveEmotionPercent) {
            
            this.playedEmotionAnimation = true
            this.playEmotionAnimation()
            
        }
        
        if (this.metersPassed >= this.curveLength * finishInPercent) {
        
            this.metersPassed = this.curveLength
            this.isMoveOnCurveActive = false
            this.finishPhase()
            
        }
        
        if (this.curveLength === 0) return
        
        const position = this.curve.getPoint(this.metersPassed / this.curveLength)
        
        if (!position) return
        
        player.physicsBody.position.set(
            position.x,
            position.y,
            position.z
        )
        player.putPlayerOnSurface()

    }

    /**
     * Ukoncene fazy
     */
    finishPhase = (): void => {

        if (this.ended) return
        
        tutorialFlow.finishAction()
        if (modes.isTutorial()) return

        console.warn('finishing post landing phase!')

        if (this.finishPhaseTween) this.finishPhaseTween.kill()

        this.ended = true

        store.commit('UiState/SET_STATE', {
            isTraining: modes.isTrainingMode(),
            isTutorial: modes.isTutorial(),
            showTrainingLayout: false
        })
        if (modes.isTrainingMode()) {

            store.commit('TrainingState/SET_HIGH_SCORE', {
                showHighScore: false
            })

        }
        
        fpsManager.pauseCounting()
        endManager.sendLogEnd()
        endManager.sendSaveResult()

        console.warn('finish phase ended')
        this.callbackEnd()

    }

    /**
     * reset
     */
    reset (): void {

        this.ended = false
        this.isStaticMovementStarted = false
        this.actualPositionEndAnimation = 0
        this.isMoveOnCurveActive = false
        this.rayDirection = new THREE.Vector3(0, -1, 0)
        if (this.finishPhaseTween) this.finishPhaseTween.kill()
        this.frames = 0
        this.curveLength = 0
        this.metersPassed = 0
        this.playedEmotionAnimation = false
    
    }

}
