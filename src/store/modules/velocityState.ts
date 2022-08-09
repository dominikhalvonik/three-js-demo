import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface VelocityState {
    velocityX: number,
    velocityY: number,
    velocityZ: number
}

const initialState = () => ({
    velocityX: 0,
    velocityY: 0,
    velocityZ: 0
})

const velocityState: Module<VelocityState, RootState> = {
    state: initialState(),
    
    namespaced: true,

    getters: {
        getVelocityState: (moduleState: VelocityState) => moduleState
    },

    mutations: {
        RESET: (moduleState: VelocityState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: VelocityState, newState: VelocityState) => {
            
            moduleState.velocityX = newState.velocityX
            moduleState.velocityY = newState.velocityY
            moduleState.velocityZ = newState.velocityZ
        
        }
    }
}

export default velocityState
