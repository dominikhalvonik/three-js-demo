import { type PlayerInfoForTable } from '@powerplay/core-minigames'
import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface TableState {
    showTable: boolean,
    activeState: boolean,
    dataTable: PlayerInfoForTable[],
    competitionText: string,
    resultText: string,
    isStartList: boolean
}

const initialState = () => ({
    showTable: false,
    activeState: false,
    dataTable: [],
    competitionText: '',
    resultText: '',
    isStartList: false
})

const tableState: Module<TableState, RootState> = {
    namespaced: true,
    state: initialState(),
    getters: {
        getState: (moduleState: TableState) => moduleState,
        getShowTable: (moduleState: TableState) => moduleState.showTable,
        getActiveState: (moduleState: TableState) => moduleState.activeState,
        getDataTable: (moduleState: TableState) => moduleState.dataTable,
        getCompetitionText: (moduleState: TableState) => moduleState.competitionText,
        getResultText: (moduleState: TableState) => moduleState.resultText,
        getIsStartList: (moduleState: TableState) => moduleState.isStartList
    },
    mutations: {
        RESET: (moduleState: TableState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: TableState, newState: TableState) => {

            moduleState.showTable = newState.showTable
            moduleState.activeState = newState.activeState

        },
        SET_VISIBILITY: (moduleState: TableState, visibility: boolean) => {

            moduleState.showTable = visibility

        },
        SET_ACTIVATION: (moduleState: TableState, activeState: boolean) => {

            moduleState.activeState = activeState

        },
        SET_DATA: (moduleState: TableState, data: PlayerInfoForTable[]) => {

            moduleState.dataTable = data

        },
        SET_COMPETITION_TEXT: (moduleState: TableState, data: string) => {

            moduleState.competitionText = data

        },
        SET_RESULT_TEXT: (moduleState: TableState, data: string) => {

            moduleState.resultText = data

        },
        SET_IS_START_LIST: (moduleState: TableState, isStartList: boolean) => {

            moduleState.isStartList = isStartList

        }
    }
}

export default tableState
