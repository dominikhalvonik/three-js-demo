import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface InstructionsState {
    showInstructions: boolean,
    showButton: boolean
}

const initialState = () => ({
    showInstructions: false,
    showButton: true
})

const instructionsState: Module<InstructionsState, RootState> = {
    namespaced: true,
    state: initialState(),

    getters: {
        getInstructionsState: (moduleState: InstructionsState) => moduleState,
        getShowButton: (moduleState: InstructionsState) => moduleState.showButton,
        getShowInstructions: (moduleState: InstructionsState) => moduleState.showInstructions
    },

    mutations: {
        RESET: (moduleState: InstructionsState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: InstructionsState, newState: InstructionsState) => {

            moduleState.showButton = newState.showButton
            moduleState.showInstructions = newState.showInstructions

        },
        SET_BUTTON_VISIBILITY: (moduleState: InstructionsState, visibility: boolean) => {

            moduleState.showButton = visibility

        },
        SET_INSTRUCTIONS_VISIBILITY: (moduleState: InstructionsState, visibility: boolean) => {

            moduleState.showInstructions = visibility

        }
    }
}

export default instructionsState
