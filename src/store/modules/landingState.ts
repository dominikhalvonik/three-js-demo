import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface LandingState {
    isActive: boolean,
    color: number,
    text: string,
    meters: string,
    personalBestText: string
}

const initialState = () => ({
    isActive: false,
    color: 0,
    text: '',
    meters: '',
    personalBestText: ''
})

const landingState: Module<LandingState, RootState> = {
    namespaced: true,
    state: initialState(),

    getters: {
        getLandingState: (moduleState: LandingState) => moduleState
    },

    mutations: {
        RESET: (moduleState: LandingState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: LandingState, newState: LandingState) => {

            if (newState.isActive !== undefined) {

                moduleState.isActive = newState.isActive
            
            }
            
            if (newState.color !== undefined) {

                moduleState.color = newState.color
            
            }
            
            if (newState.text !== undefined) {

                moduleState.text = newState.text
            
            }
            
            if (newState.meters !== undefined) {

                moduleState.meters = newState.meters
            
            }
            
            if (newState.personalBestText !== undefined) {

                moduleState.personalBestText = newState.personalBestText
            
            }
        
        }
    }
}

export default landingState
