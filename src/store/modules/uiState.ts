import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface UiState {
    isTraining: boolean,
    isTutorial: boolean,
    showFinishTopBox: boolean,
    showTrainingLayout: boolean
}

const initialState = () => ({
    isTraining: false,
    isTutorial: false,
    showFinishTopBox: false,
    showTrainingLayout: false
})

const uiState: Module<UiState, RootState> = {
    state: initialState(),
    
    namespaced: true,

    getters: {
        getUiState: (moduleState: UiState) => moduleState
    },

    mutations: {
        RESET: (moduleState: UiState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: UiState, newState: UiState) => {
            
            if (moduleState.isTraining !== undefined) {

                moduleState.isTraining = newState.isTraining
            
            }
            if (moduleState.isTutorial !== undefined) {

                moduleState.isTutorial = newState.isTutorial
            
            }
            if (moduleState.showTrainingLayout !== undefined) {

                moduleState.showTrainingLayout = newState.showTrainingLayout
            
            }
            if (moduleState.showFinishTopBox !== undefined) {

                moduleState.showFinishTopBox = newState.showFinishTopBox
            
            }

        },
        SET_FINISH_TOP_BOX_VISIBILITY: (moduleState: UiState, visible: boolean) => {
        
            moduleState.showFinishTopBox = visible
        
        }
    }
}

export default uiState
