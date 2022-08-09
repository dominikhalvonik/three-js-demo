import { descentBalanceManager } from '@/app/DescentBalanceManager'
import { endCalculationsManager } from '@/app/EndCalculationsManager'
import { disciplinePhasesManager, LandingPhaseManager, TakeOffPhaseManager } from '@/app/phases'
import { player } from '@/app/Player'
import { windManager } from '@/app/WindManager'
import store from '@/store'
import {
    tutorialManager,
    TutorialSectionType,
    game,
    MobileDetector,
    gsap,
    requestManager,
    gameStats,
    modes
} from '@powerplay/core-minigames'
import {
    SectionNames, TutorialEventType,
    TutorialObjectiveIds, DisciplinePhases
} from '../../types'
import { tutorialObjectives } from './TutorialObjectives'
import { tutorialUIChange } from './TutorialUIChange'

/**
 *  Tutorial tasky ktore maju aj logiku v sebe na ovladanie tej ktorej udalosti
*/
export class TutorialFlow {

    private activeEventType = TutorialEventType.awaitingEvent
    private firstInitDone = false
    
    /** General helper  */
    private helper = false

    public setDefaultObjective (): void {

        const objectives = [
            {
                id: TutorialObjectiveIds.speed as string,
                passed: false,
                failed: false,
                name: 'tutorialTask3-1'
            },
            {
                id: TutorialObjectiveIds.jump as string,
                passed: false,
                failed: false,
                name: 'tutorialTask3-2'
            },
            {
                id: TutorialObjectiveIds.jumpLength as string,
                passed: false,
                failed: false,
                name: 'tutorialTask3-3'
            },
            {
                id: TutorialObjectiveIds.landing as string,
                passed: false,
                failed: false,
                name: 'tutorialTask3-4'
            }
        ]
        tutorialObjectives.setObjectives(objectives)
    
    }

    /**
     * Inicializacia
     */
    public init (): void {
        
        const tutorialSections = [
            {
                name: SectionNames.startSectionFirst,
                id: 0,
                type: TutorialSectionType.storyInput,
                sectionLogicFinish: () => {

                    store.commit('BlurState/SET_IS_ACTIVE', false)
                
                }
            },
            {
                name: SectionNames.startSectionSecond,
                id: 1,
                type: TutorialSectionType.storyInput,
                sectionLogicIntro: () => {

                    store.commit('InputsState/SET_VISIBLE', false)
                    store.commit('TutorialState/SET_START_BOX', true)
                
                }
            },
            {
                name: SectionNames.startSectionThird,
                id: 2,
                type: TutorialSectionType.storyInput,
                sectionLogicIntro: () => {

                    store.commit('TutorialState/SET_START_BUTTON', true)
                
                },
                sectionLogicFinish: () => {
                    
                    store.commit('TutorialState/SET_START_BOX', false)
                    store.commit('TutorialState/SET_START_BUTTON', false)
                    store.commit('InputsState/SET_VISIBLE', true)
                
                }
            },
            {
                name: SectionNames.startSectionFourth,
                id: 3,
                type: TutorialSectionType.gameButton
            },
            {
                name: SectionNames.startSectionFifth,
                id: 4,
                type: TutorialSectionType.storyInput,
                sectionLogicIntro: () => {

                    store.commit('TutorialState/SET_JOYSTICK_SHOW', true)
                    store.commit('TutorialState/SET_DESCEND_SHOW', true)
                
                },
                sectionLogicFinish: () => {

                    store.commit('TutorialState/SET_JOYSTICK_SHOW', false)
                    store.commit('TutorialState/SET_DESCEND_SHOW', false)
                    store.commit('InputsState/SET_VISIBLE', true)
                
                }
            },
            {
                name: SectionNames.startSectionSixth,
                id: 5,
                type: TutorialSectionType.storyTimed
            },
            {
                name: SectionNames.startSectionSeventh,
                id: 6,
                type: TutorialSectionType.storyButton,
                sectionLogicIntro: () => {

                    store.commit('InputsState/SET_VISIBLE', false)
                    store.commit('TutorialState/SET_TAKE_OFF_BUTTON', true)
                
                },
                sectionLogicFinish: () => {
     
                    game.resumeGame()
                    store.commit('ActionButtonState/SET_TAKE_OFF', true)
                    const takeOffPhaseManager = disciplinePhasesManager
                        .getPhaseManager(DisciplinePhases.takeoff) as TakeOffPhaseManager
                    takeOffPhaseManager.calculateImpulse(true)
                    store.commit('TutorialState/SET_TAKE_OFF_BUTTON', false)
                    store.commit('InputsState/SET_VISIBLE', true)
                
                }
            },
            {
                name: SectionNames.startSectionEight,
                id: 7,
                type: TutorialSectionType.storyTimed
            },
            {
                name: SectionNames.startSectionNine,
                id: 8,
                type: TutorialSectionType.storyInput,
                sectionLogicIntro: () => {

                    store.commit('InputsState/SET_VISIBLE', false)
                    store.commit('TutorialState/SET_FLIGHT_SHOW', true)
                    store.commit('FlightBalanceState/SET_STATE', {
                        isActive: false
                    })
                    store.commit('TutorialState/SET_FLIGHT_BALANCE_SHOW', true)
                
                },
                sectionLogicFinish: () => {
                    
                    store.commit('TutorialState/SET_FLIGHT_SHOW', false)
                    store.commit('FlightBalanceState/SET_STATE', {
                        isActive: true
                    })
                    store.commit('TutorialState/SET_FLIGHT_BALANCE_SHOW', false)
                    store.commit('InputsState/SET_VISIBLE', true)
                
                }
            },
            {
                name: SectionNames.startSectionTen,
                id: 9,
                type: TutorialSectionType.storyTimed
            },
            {
                name: SectionNames.startSectionEleven,
                id: 10,
                type: TutorialSectionType.storyButton,
                sectionLogicIntro: () => {

                    store.commit('InputsState/SET_VISIBLE', false)
                    store.commit('TutorialState/SET_LANDING_SHOW', true)
                    store.commit('TutorialState/SET_FLIGHT_BALANCE_HEIGHT_SHOW', true)
                
                },
                sectionLogicFinish: () => {

                    game.resumeGame()
                    // store.commit('ActionButtonState/SET_LANDING', true)
                    const landingPhase = disciplinePhasesManager
                        .getPhaseManager(DisciplinePhases.landing) as LandingPhaseManager
                    landingPhase.inputsAction(3)
                    store.commit('TutorialState/SET_LANDING_SHOW', false)
                    store.commit('TutorialState/SET_FLIGHT_BALANCE_HEIGHT_SHOW', false)
                
                }
            },
            {
                name: SectionNames.startSectionTwelve,
                id: 11,
                type: TutorialSectionType.storyTimed,
                sectionLogicIntro: () => {

                    gsap.to({}, {
                        duration: 1.5,
                        onComplete: () => {

                            tutorialManager.nextSection()
                        
                        }
                    })
                
                }
            },
            {
                name: SectionNames.startSectionThirteen,
                id: 12,
                type: TutorialSectionType.storyInput,
                sectionLogicFinish: () => {

                    this.setDefaultObjective()
                
                }
            
            },
            {
                name: SectionNames.startSectionFourteen,
                id: 13,
                type: TutorialSectionType.storyTimed,
                sectionLogicIntro: () => {

                    disciplinePhasesManager.reset()
                    store.dispatch('clearStateAllExceptTutorial')
                    tutorialObjectives.reset()
                    disciplinePhasesManager.startPhase(DisciplinePhases.start)
                    player.reset()
                    descentBalanceManager.reset()
                    windManager.reset()
                    endCalculationsManager.reset()
                    store.commit('InputsState/SET_VISIBLE', true)
                
                }
            },
            {
                name: SectionNames.startSectionFifteen,
                id: 14,
                type: TutorialSectionType.storyInput,
                sectionLogicIntro: () => {
                
                    if (tutorialObjectives.getAttempts() >= 3) {

                        store.commit('TutorialState/SET_SETTINGS', true)
                    
                    }
                
                }
            },
            {
                name: SectionNames.startSectionSixteen,
                id: 15,
                type: TutorialSectionType.storyInput,
                sectionLogicIntro: () => {

                    store.commit('TutorialState/SET_SETTINGS', false)
                    tutorialManager.setActualSectionId(13)
                
                }
            },
            {
                name: SectionNames.finish,
                id: 16,
                type: TutorialSectionType.storyInput,
                sectionLogicFinish: () => {

                    this.endGame()
                
                }
            }
        ]

        tutorialManager.setTutorialSections(tutorialSections)

        if (MobileDetector.isMobile()) return
        
        if (!this.firstInitDone) {
            
            this.firstInitDone = true
            tutorialManager.setActualSectionId(1)
        
        }
    
    }

    /**
     * Public metoda do game loopu
     */
    public update (): void {

        // this.checkInput()

        tutorialUIChange.update()
        tutorialObjectives.update()

    }

    /**
     * Kontrola inputov
     */
    public checkInput (): void {

        if (TutorialSectionType.gameEvent === tutorialManager.getActualSectionType()) {

            this.eventActionPressed()

        }

    }

    public eventActionTrigger (eventType: TutorialEventType): void {
   
        if (!modes.isTutorial()) return
        this.activeEventType = eventType
        console.warn('trigger')

    }

    public eventActionPressed (): void {

        if (game.paused) game.resumeGame()
        
        tutorialUIChange.setMessage(false, '')
        tutorialUIChange.setAnne(false)
        
        this.resetTypeWrite()
        this.activeEventType = TutorialEventType.awaitingEvent

    }
    
    /** Reset typewrite */
    private resetTypeWrite (): void {

        tutorialManager.setTypeWriting(true)
        store.commit('TutorialCoreState/SET_TYPE_WRITER', true)
    
    }

    public finishAction (): void {

        console.warn('finish action')
        if (tutorialObjectives.checkIfAllObjectivesPassed()) {
            
            tutorialManager.setActualSectionId(16)
        
        } else {

            tutorialManager.nextSection()
        
        }
        // disciplinePhasesManager.resetAttempt()

    }
    
    /** redirect a ukoncenie hry */
    private endGame (): void {
        
        if (gameStats.wasExitedGame()) {
        
            requestManager.redirect()
            return
            
        }
        
        console.warn('TU')
        game.prematureFinishGame(disciplinePhasesManager.disciplinePrematureEnd)
            
        store.commit('LoadingCircleState/SET_STATE', {
            isActive: true
        })
    
    }

}

export const tutorialFlow = new TutorialFlow()
