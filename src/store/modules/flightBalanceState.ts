import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface FlightBalanceState {
    isActive: boolean
    valueX: number
    valueY: number
    actualHeight: number
}

const initialState = () => ({
    isActive: false,
    valueX: 0,
    valueY: 0,
    actualHeight: 0
})

const flightBalanceState: Module<FlightBalanceState, RootState> = {
    namespaced: true,
    state: initialState(),
    getters: {
        getFlightBalanceState: (moduleState: FlightBalanceState) => moduleState
    },
    mutations: {
        RESET: (moduleState: FlightBalanceState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: FlightBalanceState, newState: FlightBalanceState) => {

            if (newState.isActive !== undefined) moduleState.isActive = newState.isActive
            if (newState.valueX) moduleState.valueX = newState.valueX
            if (newState.valueY) moduleState.valueY = newState.valueY
            if (newState.actualHeight) moduleState.actualHeight = newState.actualHeight
            
        },
        SET_ACTUAL_HEIGHT: (moduleState: FlightBalanceState, newHeight: number) => {
            
            moduleState.actualHeight = newHeight
            
        }
    }
}

export default flightBalanceState
