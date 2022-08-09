import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface StartPhaseState {
    value: number,
    direction: string,
    showPlayerInfo: boolean,
    showWind: boolean,
    showSpeed: boolean,
    showName: boolean,
    showCountDown: boolean,
    counter: number,
    flicker: boolean,
    attempt: number
}

const initialState = () => ({
    value: 0,
    direction: '',
    showPlayerInfo: false,
    showWind: false,
    showSpeed: false,
    showName: false,
    showCountDown: false,
    counter: 0,
    flicker: false,
    attempt: 0
})

const startPhaseState: Module<StartPhaseState, RootState> = {
    state: initialState(),
    
    namespaced: true,

    getters: {
        getStartPhaseState: (moduleState: StartPhaseState) => moduleState,
        getFlicker: (moduleState: StartPhaseState) => moduleState.flicker
    },

    mutations: {
        RESET: (moduleState: StartPhaseState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: StartPhaseState, newState: StartPhaseState) => {
            
            if (newState.attempt !== undefined) moduleState.attempt = newState.attempt
            if (newState.value) moduleState.value = newState.value
            if (newState.direction) moduleState.direction = newState.direction
            if (newState.showWind !== undefined) {

                moduleState.showWind = newState.showWind
            
            }
            if (newState.showSpeed !== undefined) {

                moduleState.showSpeed = newState.showSpeed
            
            }
            
            if (newState.showPlayerInfo !== undefined) {
                
                moduleState.showPlayerInfo = newState.showPlayerInfo
            
            }
            
            if (newState.showName !== undefined) {

                moduleState.showName = newState.showName
            
            }
            
            if (newState.showCountDown !== undefined) {

                moduleState.showCountDown = newState.showCountDown
            
            }
            
            if (newState.counter !== undefined) {

                moduleState.counter = newState.counter
            
            }
            
            if (newState.flicker !== undefined) {

                moduleState.flicker = newState.flicker
            
            }
        
        }
    }
}

export default startPhaseState
