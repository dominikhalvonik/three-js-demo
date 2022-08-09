import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface DescentBalanceState {
    isActive: boolean
    value: number
}

const initialState = () => ({
    isActive: false,
    value: 0
})

const descentBalanceState: Module<DescentBalanceState, RootState> = {
    state: initialState(),
    
    namespaced: true,

    getters: {
        getDescentBalanceState: (moduleState: DescentBalanceState) => moduleState,
        getBalanceValue: (moduleState: DescentBalanceState) => moduleState.value,
        getBalanceActiveState: (moduleState: DescentBalanceState) => moduleState.isActive
    },

    mutations: {
        RESET: (moduleState: DescentBalanceState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: DescentBalanceState, newState: DescentBalanceState) => {
            
            if (newState.isActive !== undefined) moduleState.isActive = newState.isActive
            if (newState.value) moduleState.value = newState.value
            
        }
    }
}

export default descentBalanceState
