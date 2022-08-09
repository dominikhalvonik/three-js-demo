import type { MarkInfo } from '@/app/types'
import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface InformationState {
    showState: boolean,
    
    opinionInfo: MarkInfo[],
    
    points: string,
    meters: string,
    // name: string,
    // countryName: string,
    secondLength: string
    
    wind: string
    
}

const initialState = () => ({
    showState: false,
    opinionInfo: [],
    points: '',
    meters: '',
    // name: '',
    // countryName: '',
    secondLength: '',
    wind: ''
})

const informationState: Module<InformationState, RootState> = {
    state: initialState(),
    
    namespaced: true,

    getters: {
        getInformationState: (moduleState: InformationState) => moduleState,
        getShowState: (moduleState: InformationState) => moduleState.showState
    },

    mutations: {
        RESET: (moduleState: InformationState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: InformationState, newState: InformationState) => {
            
            if (newState.showState !== undefined) {

                moduleState.showState = newState.showState
            
            }
            if (newState.opinionInfo !== undefined) {

                moduleState.opinionInfo = newState.opinionInfo
            
            }
            if (newState.points !== undefined) {

                moduleState.points = newState.points
            
            }
            if (newState.meters !== undefined) {

                moduleState.meters = newState.meters
            
            }
            // if (newState.name) {

            //     moduleState.name = newState.name
            
            // }
            // if (newState.countryName) {

            //     moduleState.countryName = newState.countryName
            
            // }
            if (newState.secondLength) {

                moduleState.secondLength = newState.secondLength
            
            }
            if (newState.wind !== undefined) {

                moduleState.wind = newState.wind
            
            }
        
        }
    }
}

export default informationState
