import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface BlurState {
    isActive: boolean,
    isTable: boolean,
    isToggle: boolean
}

const initialState = () => ({
    isActive: false,
    isTable: false,
    isToggle: false
})

const blurState: Module<BlurState, RootState> = {
    state: initialState(),
    
    namespaced: true,

    getters: {
        getIsActive: (moduleState: BlurState) => moduleState.isActive,
        getBlurState: (moduleState: BlurState) => moduleState
    },

    mutations: {
        RESET: (moduleState: BlurState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_IS_ACTIVE: (moduleState: BlurState, newState: boolean) => {

            moduleState.isActive = newState

        },
        SET_STATE: (moduleState: BlurState, newState: BlurState) => {

            if (newState.isActive !== undefined) moduleState.isActive = newState.isActive
            if (newState.isTable !== undefined) moduleState.isTable = newState.isTable
            if (newState.isToggle !== undefined) moduleState.isToggle = newState.isToggle

        },
        SET_IS_TABLE: (moduleState: BlurState, newState: boolean) => {

            moduleState.isTable = newState

        },
        SET_IS_TOGGLE: (moduleState: BlurState, newState: boolean) => {

            moduleState.isToggle = newState

        }
        
    }
}

export default blurState
