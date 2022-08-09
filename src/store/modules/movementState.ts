import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface MovementState {
    positionX: number
    positionY: number
}

const initialState = () => ({
    positionX: 0,
    positionY: 0
})

const movementState: Module<MovementState, RootState> = {
    state: initialState(),
    getters: {
        getDirectionsState: (moduleState: MovementState) => moduleState,
        getPositionX: (moduleState: MovementState) => moduleState.positionX,
        getPositionY: (moduleState: MovementState) => moduleState.positionY
    },
    mutations: {
        RESET: (moduleState: MovementState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: MovementState, newState: MovementState) => {
            
            moduleState.positionX = newState.positionX
            moduleState.positionY = newState.positionY
            
        },
        SET_POSITION_X: (moduleState: MovementState, positionX: number) => {
            
            moduleState.positionX = positionX
          
        },
        SET_POSITION_Y: (moduleState: MovementState, positionY: number) => {
            
            moduleState.positionY = positionY
          
        }
    },
    namespaced: true
}

export default movementState
