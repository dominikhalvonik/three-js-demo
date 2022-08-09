import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface SpeedMeterState {
    speed: number,
    takeoffSpeed: number
}

const initialState = () => ({
    speed: 0,
    takeoffSpeed: 0
})

const speedMeterState: Module<SpeedMeterState, RootState> = {
    state: initialState(),
    
    namespaced: true,

    getters: {
        getSpeedMeterState: (moduleState: SpeedMeterState) => moduleState
    },

    mutations: {
        RESET: (moduleState: SpeedMeterState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: SpeedMeterState, newState: SpeedMeterState) => {
            
            if (newState.speed) moduleState.speed = newState.speed
            if (newState.takeoffSpeed) moduleState.takeoffSpeed = newState.takeoffSpeed
        
        }
    }
}

export default speedMeterState
