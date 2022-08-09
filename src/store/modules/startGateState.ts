import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface StartGateState {
    showSmall: boolean,
    showBig: boolean,
    actual: number,
    total: number
}

const initialState = () => ({
    showSmall: false,
    showBig: false,
    actual: 0,
    total: 0
})

const startGateState: Module<StartGateState, RootState> = {
    state: initialState(),
    
    namespaced: true,

    getters: {
        getStartGateState: (moduleState: StartGateState) => moduleState
    },

    mutations: {
        RESET: (moduleState: StartGateState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: StartGateState, newState: StartGateState) => {
            
            if (newState.showSmall !== undefined) moduleState.showSmall = newState.showSmall
            if (newState.showBig !== undefined) moduleState.showBig = newState.showBig
            if (newState.actual) moduleState.actual = newState.actual
            if (newState.total) moduleState.total = newState.total
            
        },
        SHOW_SMALL: (moduleState: StartGateState, newState: boolean) => {
            
            moduleState.showSmall = newState
            
        },
        SHOW_BIG: (moduleState: StartGateState, newState: boolean) => {
            
            moduleState.showBig = newState
            
        }
    }
}

export default startGateState
