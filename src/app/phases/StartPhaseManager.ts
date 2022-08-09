import {
    gsap,
    game,
    audioManager,
    CameraStates,
    MobileDetector,
    modes,
    tutorialManager,
    cameraManager
} from '@powerplay/core-minigames'
import { inputsManager } from '../InputsManager'
import { player } from '../Player'
import {
    WindDirection,
    type DisciplinePhaseManager,
    type WindValue
} from '../types'
import { windManager } from '../WindManager'
import store from '@/store'
import { gameConfig } from '../config'
import { AudioGroups, AudioNames } from '../types/audio'
import { disciplinePhasesManager } from '.'
import { tutorialFlow } from '../modes/tutorial/TutorialFlow'
import { tutorialUIChange } from '../modes/tutorial/TutorialUIChange'
import { startGateManager } from '../StartGateManager'
import { startGateConfig } from '../config/startGateConfig'

/**
 * Trieda pre startovaciu fazu
 */
export class StartPhaseManager implements DisciplinePhaseManager {

    /** tween spustenia konca fazy */
    private finishPhaseTween!: gsap.core.Tween;

    /** tween po konci tweenu disciplinoveho intra */
    private afterCameraTween!: gsap.core.Tween;

    /** tween ktory spusta start tween */
    private afterLaunchSystemTween!: gsap.core.Tween;

    /** ci sa deje nieco skipnutelne */
    private skippable = true;

    /** ci uz je mozne odstartovat */
    private startable = false;

    /** ci zobrazovat boxik vetra */
    private showWind = false;

    /** Hack na initial start */
    public isAfterIntro = false

    /** ci bolo skipnute */
    private skipped = false;

    /** ci faza skoncila */
    private ended = false;

    /** Pocet frameov od zaciatku fazy */
    private framesInPhase = 0;

    /** ci uz zobrazit ui player-info-avatar */
    private showName = false;

    /** ci zobrazit odpocitavanie v StartStatsBoxe */
    private showCountDown = true;

    /** odpocitvanie */
    private counter = 0;

    /** blikanie buttonu */
    private flicker = false;
    
    /** ci zobrazujeme start gate */
    private showStartGateSmall = false;
    
    /** ci zobrazujeme start gate */
    private showStartGateBig = false;

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

        console.log('prepare')

    }

    /**
     * Zacatie fazy
     */
    startPhase (): void {

        console.warn('starting start phase')
        store.commit('InputsState/SET_DISABLED', true)
        game.physics.setGravity(gameConfig.gravitation)

        // ak sme nahodou spustili tuto fazu inak ako tweenom
        disciplinePhasesManager.setStartPhaseTween?.kill()

        audioManager.play(AudioNames.wind)
        windManager.updateAudioVolume()

        this.setStartingPositionAndRotation()

        this.showName = !modes.isTutorial()
        this.showStartGateBig = !modes.isTutorial()

        this.setCameraForDisciplineIntro()
        
        store.commit('StartGateState/SET_STATE', {
            showSmall: false,
            showBig: false,
            actual: startGateManager.info.gate,
            total: startGateConfig.highestGateForBegginers
        })

    }

    /**
     * nastavi hraca na lavicku
     */
    setStartingPositionAndRotation (): void {

        player.playerObject.rotateX(0.035)
        player.physicsBody.position.y += 0.1

    }

    /**
     * Nastavenie kamery pre intro
     */
    private setCameraForDisciplineIntro (): void {

        if (gameConfig.cameraConfig.enabled) {

            player.changeCameraSettings(
                gameConfig.cameraConfig.idealOffset,
                gameConfig.cameraConfig.idealLookAt,
                gameConfig.cameraConfig.coefSize,
                gameConfig.cameraConfig.changeLerp
            )

        }

        if (modes.isTutorial()) {

            this.afterCameraDisciplineIntroTween()
            tutorialFlow.init()
            tutorialUIChange.init()
            return

        }

        cameraManager.setState(CameraStates.disciplineIntro)
        cameraManager.playTween(false, this.afterCameraDisciplineIntroTween)

    }

    /**
     * Spravenie veci po konci tweenu disciplinoveho intra
     */
    private afterCameraDisciplineIntroTween = (): void => {

        cameraManager.setState(CameraStates.discipline)

        if (!modes.isTutorial()) store.commit('InputsState/SET_VISIBLE', true)
        this.afterCameraTween = gsap.to({}, {

            onComplete: this.launchSystem,
            callbackScope: this,
            duration: 0.5
        })

    }

    /**
     * Update kazdy frame
     */
    update (): void {

        this.framesInPhase++

        windManager.update()

        // Skipnutie uvodneho intra kamery
        // davame po 10 frameoch, aby sme predisli viacerym klikom po sebe
        if (this.skippable && inputsManager.actionPressed && this.framesInPhase > 10) {

            this.skipped = true
            this.skippable = false
            cameraManager.skipTween()

            // nulujeme kvoli odstartovaniu
            this.framesInPhase = 0

        }

        // Odstartovanie
        if (MobileDetector.isMobile()) {

            if (store.getters['ActionButtonState/getStart'] && this.startable) {

                console.log('bol stlaceny button start')

                this.startable = false
                this.flicker = false
                this.finishPhaseTween?.progress(1)

                if (modes.isTrainingMode()) this.finishPhase()
                if (modes.isTutorial() &&
                    tutorialManager.getActualSectionId() !== 13
                ) store.commit('InputsState/SET_VISIBLE', false)

            }

        } else {

            if (inputsManager.actionPressed && this.startable) {

                console.log('action pressed')

                this.startable = false
                this.flicker = false
                this.finishPhaseTween?.progress(1)

                if (modes.isTrainingMode()) this.finishPhase()
                if (modes.isTutorial() &&
                    tutorialManager.getActualSectionId() !== 13
                ) store.commit('InputsState/SET_VISIBLE', false)

            }

        }

        this.storeState()

    }

    /**
     * Spustenie pipania
     */
    launchSystem = (): void => {

        let duration = 0
        if (this.skipped) duration = 1

        this.showWind = true
        this.showName = false
        this.counter = 10
        this.showStartGateSmall = true
        this.showStartGateBig = false

        store.commit('UiState/SET_STATE', {
            isTraining: modes.isTrainingMode(),
            isTutorial: modes.isTutorial(),
            showTrainingLayout: modes.isTrainingMode()
        })

        if (
            !modes.isTrainingMode() &&
            (!modes.isTutorial() ||
                tutorialManager.getActualSectionId() === 13)
        ) {

            gsap.timeline().to(this, {
                onComplete: () => {

                    this.flicker = true

                },
                callbackScope: this,
                ease: 'none',
                counter: 5,
                duration: 5
            }).to(this, {
                onComplete: () => {

                    this.startable = false
                    this.flicker = false
                    this.finishPhaseTween?.progress(1)

                },
                callbackScope: this,
                ease: 'none',
                counter: 0,
                duration: 5
            })

        }
        // davam maly delay kvoli tomu, ze predtym mohol byt skip
        this.afterLaunchSystemTween = gsap.to({}, {
            onComplete: () => {

                this.startable = true
                this.isAfterIntro = true
                store.commit('ActionButtonState/SET_DISABLED', false)
                store.commit('ActionButtonState/SET_START_BUTTON', true)
                if (!modes.isTrainingMode()) {

                    this.runStartTween()

                }

            },
            duration
        })

    }

    /**
     * Spustenie tweenu ktory ukoncuje fazu
     */
    runStartTween (): void {

        this.finishPhaseTween = gsap.to({}, {
            onComplete: this.finishPhase,
            callbackScope: this,
            // Hack ale funguje a neviem preco to neislo jednoduchsie.
            duration: (tutorialManager.getActualSectionId() !== 13 && modes.isTutorial())
                ? 99999 : 10
        })

        this.playStartCommentator()

    }

    /**
     * zahrame komentatora na zaciatku
     */
    private playStartCommentator (): void {

        audioManager.stopAudioByGroup(AudioGroups.commentators)
        audioManager.play(AudioNames.commentDuringCountdown)

    }

    /**
     * kill all tweens
     */
    killAllTweens (): void {

        if (this.afterCameraTween) this.afterCameraTween.kill()
        if (this.finishPhaseTween) this.finishPhaseTween.kill()
        if (this.afterLaunchSystemTween) this.afterLaunchSystemTween.kill()

    }

    /**
     * Ukoncene fazy
     */
    finishPhase (): void {

        console.warn('finishing start phase!')

        this.startable = false
        this.showCountDown = false
        this.showStartGateSmall = false

        if (!this.ended) {

            this.killAllTweens()

            this.ended = true
            if (modes.isTutorial() && tutorialManager.getActualSectionId() !== 13) {

                setTimeout(() => {

                    tutorialManager.nextSection()

                }, 2000)

            }

            this.callbackEnd()

        }

        store.commit('InputsState/SET_DISABLED', false)
        store.commit('InputsState/SET_VISIBLE', true)
        this.storeState()

    }

    /**
     * Ulozenie stavov pre UI
     */
    storeState (): void {

        const windVal: WindValue = windManager.actualValue

        const showCountDown = modes.isTutorial() &&
            tutorialManager.getActualSectionId() !== 13
            ? false
            : this.showCountDown

        store.commit('StartPhaseState/SET_STATE', {
            value: windVal.speed,
            direction: WindDirection[windVal.direction],
            showWind: this.showWind,
            showSpeed: this.ended,
            showPlayerInfo: !this.ended,
            showName: this.showName,
            showCountDown,
            counter: this.counter,
            flicker: this.flicker
        })
        store.commit('StartGateState/SHOW_SMALL', this.showStartGateSmall)
        store.commit('StartGateState/SHOW_BIG', this.showStartGateBig)

    }

    /**
     * reset
     */
    reset (): void {

        store.commit('InputsState/SET_STATE', {
            disabled: true,
            isVisible: false
        })

        this.skippable = true
        this.startable = false
        this.showWind = false
        this.skipped = false
        this.ended = false
        this.framesInPhase = 0
        this.showName = false
        this.showCountDown = true
        this.counter = 0
        this.flicker = false
        this.isAfterIntro = false

        this.storeState()

    }

}
