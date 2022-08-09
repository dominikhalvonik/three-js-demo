import type { Module } from 'vuex'
import type { RootState } from '../index'
export interface GravityState {
    x: number,
    y: number,
    z: number
}

const initialState = () => ({
    x: 0,
    y: 0,
    z: 0
})

const gravityState: Module<GravityState, RootState> = {
    state: initialState(),
    
    namespaced: true,

    getters: {
        getGravityState: (moduleState: GravityState) => moduleState
    },

    mutations: {
        RESET: (moduleState: GravityState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: GravityState, newState: GravityState) => {
            
            moduleState.x = newState.x
            moduleState.y = newState.y
            moduleState.z = newState.z
        
        }
    }
}

export default gravityState
