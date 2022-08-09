import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface DebugState {
    isHudActive: boolean
}

const initialState = () => ({
    isHudActive: false
})

const debugState: Module<DebugState, RootState> = {
    namespaced: true,
    state: initialState(),
    getters: {
        getDebugState: (moduleState: DebugState) => moduleState
    },
    mutations: {
        RESET: (moduleState: DebugState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_HUD_VISIBILITY: (moduleState: DebugState, isActive: boolean) => {

            moduleState.isHudActive = isActive

        }
    }
}

export default debugState
