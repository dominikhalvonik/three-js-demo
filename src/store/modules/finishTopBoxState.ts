import type { Module } from 'vuex'
import type { RootState } from '../index'
export interface FinishTopBoxState {
    showFirstBox: boolean
    showSecondBox: boolean
    firstPlace: boolean
    personalBest: boolean
    newPersonalBest: boolean
    position: number
}

const initialState = () => ({
    showFirstBox: false,
    showSecondBox: false,
    firstPlace: false,
    personalBest: false,
    newPersonalBest: false,
    position: 0
})

const finishTopBoxState: Module<FinishTopBoxState, RootState> = {
    state: initialState(),
    
    namespaced: true,

    getters: {
        getfinishTopBoxState: (moduleState: FinishTopBoxState) => moduleState
    },

    mutations: {
        RESET: (moduleState: FinishTopBoxState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: FinishTopBoxState, newState: FinishTopBoxState) => {
            
            if (newState.showFirstBox !== undefined) {

                moduleState.showFirstBox = newState.showFirstBox

            }
            if (newState.showSecondBox !== undefined) {

                moduleState.showSecondBox = newState.showSecondBox

            }
            if (newState.firstPlace !== undefined) moduleState.firstPlace = newState.firstPlace
            if (newState.personalBest !== undefined) {

                moduleState.personalBest = newState.personalBest

            }
            if (newState.newPersonalBest !== undefined) {

                moduleState.newPersonalBest = newState.newPersonalBest

            }
            
            if (newState.position) moduleState.position = newState.position
            
        }
    }
}

export default finishTopBoxState
