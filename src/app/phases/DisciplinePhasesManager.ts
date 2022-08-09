import {
    audioManager, CANNON, CorePhases, corePhasesManager, CustomEvents, game,
    playersManager, gsap, modes, fpsManager
} from '@powerplay/core-minigames'
import { player } from '../Player'
import { type DisciplinePhaseManager, AudioNames, DisciplinePhases } from '../types'
import {
    StartPhaseManager, TakeOffPhaseManager, DescentPhaseManager, FlightPhaseManager,
    LandingPhaseManager, PostLandingPhaseManager
} from '.'
import store from '@/store'
import { gameConfig } from '../config'
import { endManager } from '../EndManager'

/**
 * Trieda pre spravu faz
 */
export class DisciplinePhasesManager {

    /** aktualna faza */
    public actualPhase = 0;
    
    /** ci bola hra ukoncena predcasne */
    public prematureEnded = false

    /** aktualne fazy */
    private actualPhases: number[] = [];

    /** pole vytvorenych faze managerov */
    private phaseManagers: DisciplinePhaseManager[] = [];

    /** pocet spusteni update() pocas zjazdu dole */
    private framesInDescent = 0;

    /** tween na zacatie start fazy */
    setStartPhaseTween !: gsap.core.Tween

    /** Callback pre pripravenie hry tak, aby isiel dalsi pokus */
    private callbackPrepareGameForNextAttempt!: () => unknown;

    /**
     * Vytvorenie a nastavenie veci
     * @param callbackPrepareGameForNextAttempt - Callback pre pripravenie hry na dalsi pokus
     */
    create (callbackPrepareGameForNextAttempt: () => unknown): void {

        this.callbackPrepareGameForNextAttempt = callbackPrepareGameForNextAttempt
        this.createAllPhases()

    }

    /**
     * Vytvorenie menegerov faz
     */
    private createAllPhases (): void {

        const { STATIC } = CANNON.BODY_TYPES

        this.phaseManagers[DisciplinePhases.start] = new StartPhaseManager(
            () => {

                this.startPhase(DisciplinePhases.descent)
                this.endPhase(DisciplinePhases.start)

                // DOLEZITE: dynamicke body nedavame kvoli tomu, ze ho chceme posuvat manualne
                // player.physicsBody.type = DYNAMIC

            }
        )

        this.phaseManagers[DisciplinePhases.descent] = new DescentPhaseManager(
            () => {

                this.startPhase(DisciplinePhases.takeoff)

            },
            () => {

                // asi netreba nic

            }
        )

        this.phaseManagers[DisciplinePhases.takeoff] = new TakeOffPhaseManager(
            () => {

                const descentManager =
                    this.phaseManagers[DisciplinePhases.descent] as DescentPhaseManager
                descentManager.onClicked()

            },
            () => {

                const descentManager =
                    this.phaseManagers[DisciplinePhases.descent] as DescentPhaseManager
                const takeoffManager =
                    this.phaseManagers[DisciplinePhases.takeoff] as TakeOffPhaseManager

                takeoffManager.setTakeoffSpeed(descentManager.speed)

            },
            () => {

                this.startPhase(DisciplinePhases.flight)
                this.endPhase(DisciplinePhases.descent)
                this.endPhase(DisciplinePhases.takeoff)
                game.shadowsManager.detachPlaneToObject(player.playerObject, player.playerObject)

            }
        )

        this.phaseManagers[DisciplinePhases.flight] = new FlightPhaseManager(
            () => {

                this.startPhase(DisciplinePhases.landing)

            },
            () => {

                // treba nieco na konci tejto fazy?

            }
        )

        this.phaseManagers[DisciplinePhases.landing] = new LandingPhaseManager(
            () => {

                this.endPhase(DisciplinePhases.flight)

            },
            () => {

                this.endPhase(DisciplinePhases.landing)

                // ked sme skipli v landing, tak hned aj ukoncujeme post landing
                const landingManager =
                    this.phaseManagers[DisciplinePhases.landing] as LandingPhaseManager
                if (landingManager.skipped) {

                    this.endPhase(DisciplinePhases.postLanding)

                } else {

                    this.startPhase(DisciplinePhases.postLanding)

                }

                // tiene - po skonceni landing fazy attachneme na playera
                game.shadowsManager.attachPlaneToObject(player.playerObject)

            }
        )

        this.phaseManagers[DisciplinePhases.postLanding] = new PostLandingPhaseManager(
            () => {

                // zatial iba docasne
                player.physicsBody.type = STATIC
                this.hideInformations()

                console.log('dispatch end')
                window.dispatchEvent(new CustomEvent(CustomEvents.finishDisciplinePhase))

                store.commit('WaitingState/SET_STATE', {
                    isWaiting: true
                })
                
                if (corePhasesManager.disciplineActualAttempt === 1) {

                    store.commit('WaitingState/SET_STATE', {
                        isWaiting: false
                    })

                    this.callbackPrepareGameForNextAttempt()

                }

            }
        )

        // TODO: toto este budeme musiet nejako vymysliet, kam s tym
        /* player.setCollisionEndCallback(() => {

            if (this.phaseIsInActualPhases(DisciplinePhases.end)) {
                
                this.phaseManagers[DisciplinePhases.end].finishPhase()
                
            }
        
        }) */

    }

    /**
     * skryjeme informacie na konci
     */
    hideInformations (): void {

        store.commit('InformationState/SET_STATE', {
            showState: false
        })

    }

    /**
     * Pripravenie faz pred zaciatkom vsetkeho
     */
    preparePhasesBeforeStart (): void {

        const takeoffPhase = this.phaseManagers[DisciplinePhases.takeoff] as TakeOffPhaseManager
        takeoffPhase.preparePhase()

    }

    /**
     * Vratenie konkretneho fazoveho menezera
     * @param phase - Faza
     * @returns Fazovy menezer
     */
    getPhaseManager (phase: DisciplinePhases): DisciplinePhaseManager {

        return this.phaseManagers[phase]

    }

    /**
     * Spustenie fazy
     * @param phase - Cislo fazy
     */
    startPhase = (phase: DisciplinePhases): void => {

        this.actualPhase = phase
        if (this.phaseIsInActualPhases(phase)) return

        this.actualPhases.push(phase)
        this.phaseManagers[phase].startPhase()

    }

    /**
     * ukoncenie fazy
     * @param phase - Cislo fazy
     */
    endPhase (phase: DisciplinePhases): void {

        this.phaseManagers[phase].finishPhase()

        this.actualPhases = this.actualPhases.filter((val) => (val !== phase))

    }

    /**
     * Update aktualnej fazy kazdy frame
     */
    update (): void {

        // this.phaseManagers[this.actualPhase]?.update()
        this.actualPhases.forEach((val) => {

            this.phaseManagers[val]?.update()

        })

        this.updateAudienceSound()

        // zaznamenanie frameov v tejto faze
        this.logFramesInDescent()

    }

    /**
     * zmen hlasitost divakov podla vzdialenosti
     */
    updateAudienceSound (): void {

        const phases = [DisciplinePhases.start]
        
        if (disciplinePhasesManager.isOneOfPhasesinActualPhases(phases) ||
            !corePhasesManager.isActivePhaseByType(CorePhases.discipline)) {

            return
        
        }
        
        const maxValPos = gameConfig.maxAudienceValPosX
        const startPos = gameConfig.startXMax
        const actualPos = player.physicsBody.position.x

        let percentDistance = (actualPos - startPos) / (maxValPos - startPos)
        if (percentDistance > 1) percentDistance = 1
        if (percentDistance < 0) percentDistance = 0

        const volume = gameConfig.minAudienceSound +
            ((gameConfig.maxAudienceSound - gameConfig.minAudienceSound) * percentDistance)

        audioManager.changeAudioVolume(AudioNames.audienceNoise, volume)

    }

    /**
     * Predcasne ukoncenie discipliny
     */
    disciplinePrematureEnd = async (): Promise<void> => {
        
        audioManager.stopAllAudio()
        audioManager.play(AudioNames.audienceNoise, undefined, undefined, undefined, undefined, 1)
        
        corePhasesManager.disciplineActualAttempt = corePhasesManager.disciplineAttemptsCount
        playersManager.setStandings()

        // musime vymazat vsetky aktivne fazy
        this.actualPhases = []

        // reset states
        await store.dispatch('clearStateAll')
        
        store.commit('WaitingState/SET_STATE', {
            isWaiting: true
        })
        store.commit('TrainingResultsState/SET_TRAIN_AGAIN_DISABLED', true)
        // stopneme vsetky animacne callbacky
        player.animationsManager.removeCallbacksFromAllAnimations()

        player.physicsBody.type = CANNON.BODY_TYPES.STATIC
        console.log('STANDINGS', playersManager.getStandings())

        fpsManager.pauseCounting()
        
        // posleme udaje
        endManager.sendLogEnd()
        endManager.sendSaveResult()

    }

    /**
     * Zistenie, ci faza je jedna z aktualnych faz
     * @param phase - Faza
     * @returns True, ak je faza medzi aktualnymi fazami
     */
    public phaseIsInActualPhases (phase: DisciplinePhases): boolean {

        return this.actualPhases.includes(phase)

    }

    /**
     * Zistenie, ci je jedna z faz jedna z aktualnych faz
     * @param phases - Pole faz
     * @returns True ak je jedna z danych faz medzi aktualnymi fazami
     */
    public isOneOfPhasesinActualPhases (phases: DisciplinePhases[]): boolean {

        return (phases.some((phase: number) => this.phaseIsInActualPhases(phase)))

    }

    /**
     * vypise pocet framov pocas zjazdu
     */
    private logFramesInDescent (): void {

        // kontrola, ci je jedna z faz, aby sa logoval pocet frameov
        if (!this.isOneOfPhasesinActualPhases(
            [DisciplinePhases.descent, DisciplinePhases.takeoff]
        )) return

        this.framesInDescent++

        store.commit('FramesPassedState/SET_STATE', {
            frames: this.framesInDescent
        })

    }

    /**
     * sets tween to start phase
     */
    setStartPhase (): void {

        // musime tu dat mensi delay, lebo mozeme skipovat este nejake fazy predtym
        this.setStartPhaseTween = gsap.to({}, {
            duration: modes.isTutorial() ? 0 : 0.2,
            onComplete: () => {

                disciplinePhasesManager.nextAttempt()

            }
        })

    }

    /**
     * Zacatie noveho pokusu
     */
    nextAttempt (): void {

        store.commit('StartPhaseState/SET_STATE', {
            attempt: corePhasesManager.disciplineActualAttempt
        })
        this.startPhase(DisciplinePhases.start)

    }

    /**
     * Resetovanie managera
     */
    public reset (): void {

        this.actualPhases = []
        this.framesInDescent = 0
        this.resetButtons()
        this.phaseManagers.forEach((value) => {

            value.reset()

        })

    }

    /**
     * Resetovanie mobilnych buttonov
     */
    private resetButtons () {

        store.commit('ActionButtonState/RESET')
        store.commit('TakeoffState/RESET')
        store.commit('LandingState/RESET')

    }

    /**
 * resetovanie hry
 */
    public resetAttempt (): void {

        player.reset()
        this.startPhase(DisciplinePhases.start)
        this.prematureEnded = false

    }

}

export const disciplinePhasesManager = new DisciplinePhasesManager()
