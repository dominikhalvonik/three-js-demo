import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface TrainingResultsState {
    showResults: boolean,
    showTrainAgain: boolean,
    isDisabledPlayAgain: boolean,
    bestScore: number,
    dataSet: boolean,
    data: unknown,
}

const initialState = () => ({
    showResults: false,
    showTrainAgain: true,
    isDisabledPlayAgain: false,
    bestScore: 0,
    dataSet: false,
    data: {
        stars: 0,
        score: {
            base: 0,
            total: 0,
            bonuses: 0
        },
        bonus: {
            benefits: 0,
            alchemy: 0,
            subscription: 0
        },
        attribute: {
            value_from: 0,
            value_next: 0,
            tp_from: 0,
            tp_new: 0,
            tp_milestone: 0
        },
        energy: {
            value_new_game: 0,
            available: 1
        },
        rewards: [
        ]
    }
})

const trainingResultsState: Module<TrainingResultsState, RootState> = {
    state: initialState(),
    
    namespaced: true,

    getters: {
        getTrainingResultsState: (moduleState: TrainingResultsState) => moduleState,
        getTrainingResultsShow: (moduleState: TrainingResultsState) => moduleState.showResults
    },

    mutations: {
        RESET: (moduleState: TrainingResultsState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE_RESULT: (moduleState: TrainingResultsState, showResults: boolean) => {

            if (showResults !== undefined) {

                moduleState.showResults = showResults
            
            }
            
        },
        SET_TRAIN_AGAIN_DISABLED: (
            moduleState: TrainingResultsState,
            trainAgainDisabled: boolean
        ) => {
    
            moduleState.isDisabledPlayAgain = trainAgainDisabled
            
        },
        SET_STATE_DATA: (moduleState: TrainingResultsState, newState: TrainingResultsState) => {

            if (moduleState.data !== undefined) {

                moduleState.data = newState.data
                moduleState.dataSet = true
            
            }
            
            if (moduleState.bestScore !== undefined) {
                
                moduleState.bestScore = newState.bestScore
                
            }
            
        }
    }
}

export default trainingResultsState
