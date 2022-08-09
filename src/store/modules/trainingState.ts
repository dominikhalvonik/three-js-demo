import { type TrainingTaskType } from '@powerplay/core-minigames-ui'
import type { Module } from 'vuex'
import type { RootState } from '../index'
export interface TrainingState {
    newHighScore: number,
    showNewHighScore: boolean,
    tasks: TrainingTaskType[],
    firstTutorialMessage: boolean
}

const initialState = () => ({
    newHighScore: 0,
    showNewHighScore: false,
    tasks: [],
    firstTutorialMessage: false
})

const trainingState: Module<TrainingState, RootState> = {
    state: initialState(),
    
    namespaced: true,

    getters: {
        getTrainingState: (moduleState: TrainingState) => moduleState
    },

    mutations: {
        RESET: (moduleState: TrainingState) => {

            Object.assign(moduleState, initialState())
        
        },
        SET_STATE: (moduleState: TrainingState, newState: TrainingState) => {

            if (moduleState.newHighScore !== undefined) {

                moduleState.newHighScore = newState.newHighScore
            
            }
            if (moduleState.showNewHighScore !== undefined) {

                moduleState.showNewHighScore = newState.showNewHighScore
            
            }
            if (moduleState.tasks !== undefined) {

                moduleState.tasks = newState.tasks
            
            }

            if (moduleState.firstTutorialMessage !== undefined) {
                
                moduleState.firstTutorialMessage = newState.firstTutorialMessage
                         
            }
        
        },
        
        SET_HIGH_SCORE: (moduleState: TrainingState, newState: TrainingState) => {

            if (moduleState.newHighScore !== undefined) {

                moduleState.newHighScore = newState.newHighScore
            
            }
            if (moduleState.showNewHighScore !== undefined) {

                moduleState.showNewHighScore = newState.showNewHighScore
            
            }
            
        },
        ADD_TASK: (moduleState: TrainingState, task: TrainingTaskType) => {

            moduleState.tasks.push(task)
        
        },

        SET_FIRST_TUTORIAL: (moduleState: TrainingState, bool: boolean) => {
            
            moduleState.firstTutorialMessage = bool
        
        },
        
        EDIT_TASK: (moduleState: TrainingState, editedTask: TrainingTaskType) => {

            const index = moduleState.tasks.findIndex((task) => {

                return task.text === editedTask.text
            
            })
            if (index === -1) {

                moduleState.tasks.push(editedTask)
            
            } else {
                
                moduleState.tasks[index] = editedTask
            
            }
        
        }
    }
}

export default trainingState
