import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface ActionButtonState {
    isStart: boolean
    touchStart: boolean
    disabled: boolean
    takeOffPressed: boolean
    landingPressed: boolean
    showJoystick: boolean
}

const initialState = () => ({
    isStart: true,
    touchStart: false,
    disabled: true,
    takeOffPressed: false,
    landingPressed: false,
    showJoystick: false
})

const actionButtonState: Module<ActionButtonState, RootState> = {
    state: initialState(),
    
    namespaced: true,

    getters: {
        getActionButtonState: (moduleState: ActionButtonState) => moduleState,
        getDisabled: (moduleState: ActionButtonState) => moduleState.disabled,
        getTakeOffPressed: (moduleState: ActionButtonState) => moduleState.takeOffPressed,
        getLandingPressed: (moduleState: ActionButtonState) => moduleState.landingPressed,
        isStart: (moduleState: ActionButtonState) => moduleState.isStart,
        getStart: (moduleState: ActionButtonState) => moduleState.touchStart,
        getShowJoystick: (moduleState: ActionButtonState) => moduleState.showJoystick
    },

    mutations: {
        RESET: (moduleState: ActionButtonState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: ActionButtonState, newState: ActionButtonState) => {

            moduleState.disabled = newState.disabled
            moduleState.takeOffPressed = newState.takeOffPressed
            moduleState.landingPressed = newState.landingPressed

        },
        SET_START_BUTTON: (moduleState: ActionButtonState, newState: boolean) => {

            moduleState.isStart = newState

        },
        SET_TOUCH_START: (moduleState: ActionButtonState, newState: boolean) => {

            moduleState.touchStart = newState

        },
        SET_DISABLED: (moduleState: ActionButtonState, disabled: boolean) => {

            moduleState.disabled = disabled

        },
        SET_TAKE_OFF: (moduleState: ActionButtonState, takeOffPressed: boolean) => {

            moduleState.takeOffPressed = takeOffPressed

        },
        SET_LANDING: (moduleState: ActionButtonState, landingPressed: boolean) => {

            moduleState.landingPressed = landingPressed

        },
        SET_SHOW_JOYSTICK: (moduleState: ActionButtonState, newState: boolean) => {

            moduleState.showJoystick = newState

        }
    }
}

export default actionButtonState
