import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface InputsState {
    disabled: boolean
    isVisible: boolean
    exitPressed: boolean
}

const initialState = () => ({
    disabled: true,
    isVisible: false,
    exitPressed: false
})

const inputsState: Module<InputsState, RootState> = {
    state: initialState(),
    
    namespaced: true,

    getters: {
        getInputsState: (moduleState: InputsState) => moduleState,
        getDisabled: (moduleState: InputsState) => moduleState.disabled,
        getIsVisible: (moduleState: InputsState) => moduleState.isVisible,
        getExitPressed: (moduleState: InputsState) => moduleState.exitPressed
    },

    mutations: {
        RESET: (moduleState: InputsState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: InputsState, newState: InputsState) => {

            moduleState.disabled = newState.disabled
            moduleState.isVisible = newState.isVisible

        },
        SET_DISABLED: (moduleState: InputsState, disabled: boolean) => {

            moduleState.disabled = disabled

        },
        SET_VISIBLE: (moduleState: InputsState, visible: boolean) => {

            moduleState.isVisible = visible

        },
        SET_EXIT_PRESSED: (moduleState: InputsState, exitPressed: boolean) => {
            
            moduleState.exitPressed = exitPressed
            
        }
    }
}

export default inputsState
