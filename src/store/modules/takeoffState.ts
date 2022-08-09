import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface TakeoffState {
    isActive: boolean,
    color: number,
    text: string
}

const initialState = () => ({
    isActive: false,
    color: 0,
    text: ''
})

const takeoffState: Module<TakeoffState, RootState> = {
    namespaced: true,
    state: initialState(),

    getters: {
        getTakeoffState: (moduleState: TakeoffState) => moduleState
    },

    mutations: {
        RESET: (moduleState: TakeoffState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: TakeoffState, newState: TakeoffState) => {

            if (newState.isActive !== undefined) {

                moduleState.isActive = newState.isActive
            
            }
            
            if (newState.color !== undefined) {

                moduleState.color = newState.color
            
            }
            
            if (newState.text !== undefined) {

                moduleState.text = newState.text
            
            }
        
        }
    }
}

export default takeoffState
