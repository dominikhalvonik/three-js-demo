import { createStore } from 'vuex'
import { CoreState } from '@powerplay/core-minigames-ui'
import DescentBalanceState from './modules/descentBalanceState'
import StartPhaseState from './modules/startPhaseState'
import VelocityState from './modules/velocityState'
import GravityState from './modules/gravityState'
import FlightBalanceState from './modules/flightBalanceState'
import FramesPassedState from './modules/framesPassedState'
import SpeedMeterState from './modules/speedMeterState'
import InstructionsState from './modules/instructionsState'
import InformationState from './modules/informationState'
import InputsState from './modules/inputsState'
import ActionButtonState from './modules/actionButtonState'
import TableState from './modules/tableState'
import LandingState from './modules/landingState'
import TakeoffState from './modules/takeoffState'
import MovementState from './modules/movementState'
import DebugState from './modules/debugState'
import TrainingResultsState from './modules/trainingResultsState'
import TrainingState from './modules/trainingState'
import UiState from './modules/uiState'
import TutorialState from './modules/tutorialState'
import FinishTopBoxState from './modules/finishTopBoxState'
import BlurState from './modules/blurState'
import StartGateState from './modules/startGateState'

// TODO: Check out why we need this?
// eslint-disable-next-line
export interface RootState {}

const modules = {
    ...CoreState,
    DescentBalanceState,
    StartPhaseState,
    VelocityState,
    GravityState,
    FlightBalanceState,
    FramesPassedState,
    SpeedMeterState,
    InformationState,
    InputsState,
    ActionButtonState,
    TableState,
    InstructionsState,
    LandingState,
    TakeoffState,
    MovementState,
    DebugState,
    TrainingResultsState,
    TrainingState,
    UiState,
    TutorialState,
    FinishTopBoxState,
    BlurState,
    StartGateState
}

export default createStore({
    state: {
    },
    mutations: {
    },
    actions: {
        clearStateAll ({ dispatch }) {
            
            dispatch('holyHandGrenade')
            
        },
        clearStateAllExceptTutorial ({ dispatch }) {

            const moduleNameArray = []
            for (const currentModule in modules) {

                if (!['TutorialState', 'GameSettingsState', 'InputsState']
                    .includes(currentModule)) {

                    moduleNameArray.push(currentModule)

                }
            
            }
            dispatch('holyHandGrenade', moduleNameArray)
        
        },
        holyHandGrenade ({ commit }, modulesToDelete: string[] = []) {
            
            if (modulesToDelete.length > 0) {

                modulesToDelete.forEach((currentModule) => {

                    commit(`${currentModule}/RESET`)
                
                })
            
            } else {

                for (const currentModule in modules) {

                    if (['GameSettingsState', 'FpsLookerState'].includes(currentModule)) continue
                    
                    commit(`${currentModule}/RESET`)
                    
                }
            
            }
        
        }
    },
    modules
})
