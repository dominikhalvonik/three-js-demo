import store from '@/store'
import {
    CustomEvents, game, MainCore, timeManager, CameraStates, PlayersSecondResultTypes,
    AppWSM2021DifficultyTypes, playersManager, PlayersSortTypes, playersConfig, TimesTypes,
    PlayersResultTypes, AudioManager, requestManager, corePhasesManager, modes,
    settings, SettingsTypes, gameStats, fpsManager, cameraManager, appWSM2021Config, errorManager
    
} from '@powerplay/core-minigames'
import {
    modelsConfig,
    texturesConfig,
    debugConfig,
    audioConfig,
    batchingConfig,
    gameConfig
} from './config'
import { hill } from './Hill'
import { inputsManager } from './InputsManager'
import { disciplinePhasesManager } from './phases/DisciplinePhasesManager'
import { player } from './Player'
import {
    DisciplinePhases,
    type SpecialDataFromInit
} from './types'
import {
    MaterialsNames,
    TexturesNames
} from './types'
import { cameraConfig } from './config/cameraConfig'
import { endCalculationsManager } from './EndCalculationsManager'
import { appWSM2021AllDifficultiesConfig } from './config/appWSM2021AllDifficultiesConfig'
import { descentBalanceManager } from './DescentBalanceManager'
import { flightBalanceManager } from './FlightBalanceManager'
import { hillCurveCalculator } from './HillCurveCalculator'
import { windManager } from './WindManager'
import { trainingTasks } from './modes/training/TrainingTasks'
import { materialsConfig } from './config/materialsConfig'
import { startGateManager } from './StartGateManager'
import { tutorialFlow } from './modes/tutorial/TutorialFlow'
import type { FlightPhaseManager } from './phases'
import { pathAssets } from '@/globals/globalvariables'
import { ParticleEffects } from './ParticleEffects'
/**
 * Hlavna trieda pre disciplinu
 */
export class Main {

    /** Hlavna trieda z CORE */
    private mainCore!: MainCore;

    /** Pause prveho tutorialu */
    private pausedFirstTutorial = false

    /** Partikle Effect */
    private particleEffects!: ParticleEffects

    /**
     * Konstruktor
     */
    constructor () {

        const skierLoaderData = texturesConfig[TexturesNames.skier]

        if (!skierLoaderData) {

            throw new Error(errorManager.showBox('Skier loaderData was empty'))

        }
        if (!materialsConfig[MaterialsNames.skier].meshesArray) {

            throw new Error(errorManager.showBox('Skier material meshesArray was empty'))

        }

        window.addEventListener(CustomEvents.readyForDisciplineInit, this.init)
        window.addEventListener(CustomEvents.loadingProgress, this.loadingProgress)

        // pripravenie konfigov pre WSM 2021 - musime kontrolvat takto kvoli typescriptu
        if (modes.isAppWSM2021()) {

            appWSM2021Config.data = appWSM2021AllDifficultiesConfig[
                modes.mode as unknown as AppWSM2021DifficultyTypes // small TS hack :)
            ]

        }

        if (modes.isTrainingMode()) {

            console.log('IT IS TRAINING TIME')

        }

        if (modes.isTutorial()) {

            // nastavime loading pre tutorial TODO zmen text na nazov discipliny
            store.commit('LoadingState/SET_STATE', {
                tutorial: {
                    isEnabled: true,
                    text: 'disciplineName3'
                }
            })

        }

        let numberOfAttempts = gameConfig.numberOfAttempts
        if (
            modes.isTrainingMode() ||
            modes.isAppWSM2021() ||
            modes.isTutorial() ||
            modes.isDailyLeague()
        ) {

            numberOfAttempts = 1

        }

        // Nastavenie players konfigov, aby sa dobre zoradovali a mali dobre empty vysledky
        this.setPlayersConfig()

        // spustime CORE veci a pokial vsetko je v pohode, pusti sa INIT metoda
        this.mainCore = new MainCore(
            {
                meshesCastShadows: materialsConfig[MaterialsNames.skier].meshesArray || [],
                materials: materialsConfig,
                callbacks: {
                    inputs: {
                        callbackLeft: inputsManager.onKeyLeft,
                        callbackRight: inputsManager.onKeyRight,
                        callbackUp: inputsManager.onKeyUp,
                        callbackDown: inputsManager.onKeyDown,
                        callbackAction: inputsManager.onKeyAction,
                        callbackExit: inputsManager.onKeyExit,
                        callbackPrepareVideo: inputsManager.onKeyPrepareVideo
                    },
                    setSpecialDataFromInitRequest: this.setSpecialDataFromInitRequest,
                    createAssets: this.createAssets,
                    beforeGameStart: this.beforeGameStart,
                    updateBeforePhysics: this.updateBeforePhysics,
                    updateAfterPhysics: this.updateAfterPhysics,
                    updateAnimations: this.updateAnimations
                },
                batching: batchingConfig,
                debugConfig,
                numberOfAttempts
            },
            {
                textures: texturesConfig,
                models: modelsConfig,
                audio: audioConfig
            }
        )


        this.initialSetup()

    }
    
    /**
     * Pociatocny setup
     */
    private initialSetup() {

        const localEnv = Number(import.meta.env.VITE_APP_LOCAL) === 1
        this.mainCore.setIsLocalEnv(localEnv)
        game.setIsLocalEnv(localEnv)
        
        // nastavenie verzie zvukov - TODO: dat mozno niekam inam, resp cez konfig?
        AudioManager.PATH_ASSETS = pathAssets

        disciplinePhasesManager.create(this.prepareGameForNextAttempt)


    }

    /**
     * Inicializacia
     */
    init = (): void => {

        this.mainCore.init()

        endCalculationsManager.init()
        trainingTasks.initTraining()
        timeManager.setActive(TimesTypes.total, true)
        // disciplinePhasesManager.getPhaseManager(DisciplinePhases.start).preparePhase()
        
        if (corePhasesManager.firstInstructions) {

            store.commit('TrainingResultsState/SET_TRAIN_AGAIN_DISABLED', true)

        }

    }

    /**
     * Nastavenie konfigu pre hracov
     */
    private setPlayersConfig (): void {

        playersConfig.sortType = PlayersSortTypes.descending
        playersConfig.resultType = PlayersResultTypes.metersPoints
        playersConfig.secondResultType = PlayersSecondResultTypes.number

    }

    /**
     * Metoda na overenie a zobrazenie FPS
     */
    private checkFpsRequest (): void {

        if (store.getters['FpsLookerState/getFpsStarted']) {

            const settingsQuality = settings.getSetting(SettingsTypes.quality)
            const fpsData = {
                averageFps: fpsManager.getAverageFpsByQuality(settingsQuality),
                actualFps: fpsManager.getActualFpsByQuality(settingsQuality)
            }

            store.commit('FpsLookerState/SET_FPS_STATE', fpsData)

        }

    }

    /**
     * Zobrazenie progresu loadingu
     */
    loadingProgress = (): void => {

        gameStats.setNextLoadingPart()

        const loadingState = store.getters['LoadingState/getLoadingState']
        const newState = {
            ...loadingState,
            loadingProgress: gameStats.getLoadingProgress()
        }
        store.commit('LoadingState/SET_STATE', newState)

    }

    /**
     * Nastavenie specialnych dat z init requestu
     * @param data - Specialne data
     */
    setSpecialDataFromInitRequest = (data: unknown): void => {

        const specialData = data as SpecialDataFromInit
        startGateManager.setStartGateFromServer(specialData.startGate ?? 0)

    }

    /**
     * Nastavenie assetov
     */
    private createAssets = (): void => {

        try {

            // najskor si musime vypocitat startovaciu poziciu na osi X a takisto najazdove okno
            const playerStartPositionX = player.recalculateStartingPosition()
            // HILL
            hill.create(playerStartPositionX)

            // HRAC
            player.create()

            // musime doplnit vsade hracovu poziciu pre kamerove obejkty a potom nastavit tweeny
            player.updateCameraConfigOnStart()
            cameraManager.setTweenSettingsForStates(cameraConfig.tweenSettingsForCameraStates)
            cameraManager.changeBaseRenderSettings(undefined, 5000)

            player.updatePlayerMeshPosition()
            hill.setBenchPosition()

            disciplinePhasesManager.preparePhasesBeforeStart()

            this.setUpDebug()

            // Partikle
            this.particleEffects = new ParticleEffects()

        } catch (e: unknown) {

            console.log(e)

        }

    };

    /**
     * puts singletons into window object
     */
    setUpDebug (): void {

        if (!Number(import.meta.env.VITE_APP_LOCAL)) return

        const flightPhaseManager =
            disciplinePhasesManager.getPhaseManager(DisciplinePhases.flight) as FlightPhaseManager

        const debug = {
            descentBalanceManager,
            endCalculationsManager,
            flightBalanceManager,
            hill,
            hillCurveCalculator,
            inputsManager,
            player,
            windManager,
            disciplinePhasesManager,
            playersManager,
            setVisibityHUD: (visible: boolean) => {

                store.commit('DebugState/SET_HUD_VISIBILITY', visible)

            },
            pauseGame: () => {

                if (game.paused) game.resumeGame()
                else game.pauseGame()

            },
            flightPhase: flightPhaseManager
        };

        // eslint-disable-next-line
        (window as any).debug = debug

    }

    /**
     * Nastavenie alebo spustenie veci pred startom hry
     */
    private beforeGameStart = (): void => {

        // nastavime pocuvanie na zaciatok disciplinovej fazy z CORE
        window.addEventListener(CustomEvents.startDisciplinePhase, this.startAttemptAfterDelay)

        store.commit('GameSettingsState/SET_STATE', {
            graphicsSettings: settings.getSetting(SettingsTypes.quality),
            graphicsAuto: settings.getSetting(SettingsTypes.qualityAuto) === 1,
            volume: settings.getSetting(SettingsTypes.sounds) === 1,
            isLeft: settings.getSetting(SettingsTypes.isLeft) === 1
        })

    }

    /**
     * Pustenie dalsieho pokusu po nejakom case
     */
    private startAttemptAfterDelay = (): void => {

        disciplinePhasesManager.setStartPhase()

    }

    /**
     * Spustenie veci v update pred vykonanim fyziky
     */
    private updateBeforePhysics = (): void => {

        player.updateBeforePhysics()
        this.checkFpsRequest()

    };

    /**
     * Spustenie veci v update po vykonani fyziky
     * @param delta - Delta
     */
    private updateAfterPhysics = (delta: number): void => {

        this.particleEffects.update()
        if (requestManager.TUTORIAL_ID === 13 && !this.pausedFirstTutorial) {

            this.pausedFirstTutorial = true
            console.log(requestManager.TUTORIAL_ID)
            game.pauseGame()
            store.commit('TrainingState/SET_FIRST_TUTORIAL', true)
            return

        }
        // najskor musime vypocitat prisecnik, aby sme s nim mohli neskor pocitat
        player.calculateIntersectionWithGround()

        disciplinePhasesManager.update()
        player.updateAfterPhysics()

        cameraManager.move(
            player.getPosition(),
            player.getQuaternion().clone(),
            delta,
            [hill.hillMesh],
            cameraConfig.distanceFromGround,
            cameraManager.isThisCameraState(CameraStates.disciplineOutro)
        )

        store.commit('GravityState/SET_STATE', {
            x: game.physics.getPhysicsWorld.gravity.x,
            y: game.physics.getPhysicsWorld.gravity.y,
            z: game.physics.getPhysicsWorld.gravity.z
        })

        if (modes.isTutorial()) {

            tutorialFlow.update()

        }

    };

    /**
     * Spustenie vykonavania vsetkych animacii
     * @param delta - Delta
     */
    private updateAnimations = (delta: number): void => {

        player.updateAnimations(delta)

    };

    /**
     * Pripravenie hry pre dalsi pokus
     */
    private prepareGameForNextAttempt = (): void => {

        disciplinePhasesManager.reset()

        player.reset()
        descentBalanceManager.reset()
        windManager.reset()
        endCalculationsManager.reset()

    }

}
