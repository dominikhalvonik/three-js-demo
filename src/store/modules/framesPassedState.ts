import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface FramesPassedState {
    frames: number
}

const initialState = () => ({
    frames: 0
})

const framesPassedState: Module<FramesPassedState, RootState> = {
    state: initialState(),
    
    namespaced: true,

    getters: {
        getFramesPassedState: (moduleState: FramesPassedState) => moduleState
    },

    mutations: {
        RESET: (moduleState: FramesPassedState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: FramesPassedState, newState: FramesPassedState) => {
            
            if (newState.frames) moduleState.frames = newState.frames
        
        }
    }
}

export default framesPassedState
