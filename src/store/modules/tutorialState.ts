import type { TutorialObjective } from '@powerplay/core-minigames'
import { TutorialMessageColors } from '@powerplay/core-minigames'
import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface TutorialState {
    anne: {
        showAnne: boolean,
        isRight: boolean
    },
    mobile: boolean,
    tutorialMessage: {
        message: string,
        showMessage: boolean,
        color: TutorialMessageColors,
        offset: boolean,
        yellowText: string
    },
    joystick: boolean,
    takeoff: boolean,
    flight: boolean,
    descend: boolean,
    balance: boolean,
    balanceHeight: boolean,
    landing: boolean,
    settings: boolean,
    showButtonStart: boolean,
    startbox: boolean,
    objectives: TutorialObjective[]
}

const initialState = () => ({
    anne: {
        showAnne: false,
        isRight: false
    },
    mobile: false,
    startbox: false,
    joystick: false,
    takeoff: false,
    flight: false,
    landing: false,
    descend: false,
    balance: false,
    balanceHeight: false,
    settings: false,
    showButtonStart: false,
    tutorialMessage: {
        message: '',
        showMessage: false,
        color: TutorialMessageColors.blank,
        offset: false,
        yellowText: ''
    },
    objectives: []
})

const tutorialState: Module<TutorialState, RootState> = {
    state: initialState(),
    
    namespaced: true,

    getters: {
        getTutorialState: (moduleState: TutorialState) => moduleState,
        getTutorialObjectives: (moduleState: TutorialState) => moduleState.objectives,
        getSettings: (moduleState: TutorialState) => moduleState.settings
    },

    mutations: {
        RESET: (moduleState: TutorialState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: TutorialState, newState: TutorialState) => {

            moduleState = newState

        },
        SET_MOBILE: (
            moduleState: TutorialState,
            newValue: boolean
        ) => {

            moduleState.mobile = newValue
        
        },
        SET_SETTINGS: (moduleState: TutorialState, bool: boolean) => {

            moduleState.settings = bool
        
        },
        SET_DESCEND_SHOW: (moduleState: TutorialState, bool: boolean) => {

            moduleState.descend = bool
        
        },
        SET_FLIGHT_BALANCE_SHOW: (moduleState: TutorialState, bool: boolean) => {

            moduleState.balance = bool
        
        },
        SET_FLIGHT_BALANCE_HEIGHT_SHOW: (moduleState: TutorialState, bool: boolean) => {

            moduleState.balanceHeight = bool
        
        },
        SET_JOYSTICK_SHOW: (moduleState: TutorialState, bool: boolean) => {

            moduleState.joystick = bool
        
        },
        SET_FLIGHT_SHOW: (moduleState: TutorialState, bool: boolean) => {

            moduleState.flight = bool
        
        },
        SET_LANDING_SHOW: (moduleState: TutorialState, bool: boolean) => {

            moduleState.landing = bool
        
        },
        SET_TAKE_OFF_BUTTON: (moduleState: TutorialState, bool: boolean) => {

            moduleState.takeoff = bool
        
        },
        SET_START_BUTTON: (moduleState: TutorialState, bool: boolean) => {

            moduleState.showButtonStart = bool
        
        },
        SET_START_BOX: (moduleState: TutorialState, bool: boolean) => {

            moduleState.startbox = bool
        
        },
        SET_ANNE: (
            moduleState: TutorialState,
            newValue: {
                showAnne: false,
                isRight: false
            }
        ) => {

            moduleState.anne = newValue
        
        },
        SET_ANNE_IS_RIGHT: (moduleState: TutorialState, newValue: boolean) => {

            moduleState.anne.isRight = newValue
        
        },
        SET_MESSAGE: (
            moduleState: TutorialState,
            newState: {
                message: string,
                showMessage: boolean,
                color: TutorialMessageColors.blank,
                offset: boolean,
                yellowText: string
            }
        ) => {
            
            moduleState.tutorialMessage = newState
        
        },
        SET_OBJECTIVES: (moduleState: TutorialState, objectives: TutorialObjective[]) => {

            moduleState.objectives = [...objectives]
        
        }
    }
}

export default tutorialState
