import store from '@/store'
import {
    corePhasesManager, modes, playersManager, requestManager,
    type TrainingDataFromResultsRequest, trainingManager, gameStats
} from '@powerplay/core-minigames'
import { endCalculationsManager } from './EndCalculationsManager'
import { tutorialObjectives } from './modes/tutorial/TutorialObjectives'
import { disciplinePhasesManager } from './phases/DisciplinePhasesManager'
import { 
    CalculatedDataTypesForOneJump, type SaveResultsDataToSend, TutorialObjectiveIds
} from './types'

/**
 * Trieda pre koniec discipliny
 */
export class EndManager {
    
    /** ci uz bol result poslany alebo nie */
    private resultSent = false;
    
    /** zaznam poctu perfektnych odrazov */
    public perfectTakeoffsLog = 0;
    
    /** zaznam poctu telemarkov */
    public telemarksLog = 0;
    
    /**
     * Poslanie requestu pre konecne logovanie
     */
    sendLogEnd (): void {
        
        // ak uz mame nastavene, tak uz viac nenastavujeme
        if (Object.keys(gameStats.getDisciplineDataToLog()).length === 0) return
        
        // zaznamename nejake info pre logy - TODO: bude potrebne inak posielat data?
        gameStats.setDisciplineDataToLog({
            playerPosition: playersManager.getPlayerActualPosition(),
            jumps: endCalculationsManager.calculatedData.map((value) => {
            
                return {
                    meters: value[CalculatedDataTypesForOneJump.meters],
                    points: value[CalculatedDataTypesForOneJump.points],
                    pointsStyle: value[CalculatedDataTypesForOneJump.pointsStyle],
                    compensationWind: value[CalculatedDataTypesForOneJump.compensationWind],
                    wind: {
                        value: value[CalculatedDataTypesForOneJump.windValue],
                        direction: value[CalculatedDataTypesForOneJump.windDirection]
                    },
                    qualities: {
                        descent: value[CalculatedDataTypesForOneJump.descentQuality],
                        takeoff: value[CalculatedDataTypesForOneJump.takeoffQuality],
                        flight: value[CalculatedDataTypesForOneJump.flightQuality],
                        landing: value[CalculatedDataTypesForOneJump.landingQuality]
                    },
                    fall: value[CalculatedDataTypesForOneJump.fall]
                }
            
            }),
            trainingTasks: modes.isTrainingMode()
                ? trainingManager.getTrainingTasks().map(task => task.value)
                : [],
            tutorialData: modes.isTutorial() ? this.getTutorialLogs() : {}
        })
        
        console.log('LOG to send', gameStats.getDisciplineDataToLog())
        
    }
    
    /**
     * ziskame objekt tutorialovych logov
     *
     * @returns - objekt tutorialovych logov
     */
    private getTutorialLogs (): Record<string, number | boolean> {
        
        const data = tutorialObjectives.getPassedObjectives()
        const completed = tutorialObjectives.checkIfAllObjectivesPassed()
        
        return {
            firstTaskJump: data[TutorialObjectiveIds.speed] | 0,
            secondTaskJump: data[TutorialObjectiveIds.jump] | 0,
            thirdTaskJump: data[TutorialObjectiveIds.jumpLength] | 0,
            fourthTaskJump: data[TutorialObjectiveIds.landing] | 0,
            countSuccess: completed ? data.attempts : 0,
            completed: completed,
            exited: disciplinePhasesManager.prematureEnded
        }
        
    }
    
    /**
     * Vybratie dat a poslanie do funkcie z core-minigames
     */
    sendSaveResult (): void {

        // ak uz bol result poslany, neposielame ho znova
        if (this.resultSent) return
        
        // TODO TEMP - zatial takto, ked bude hotovy tutorial, tak sa to bude posielat tam
        requestManager.sendTutorialRequest()
        if (modes.isTutorial()) return
        
        const data: SaveResultsDataToSend = {
            positions: playersManager.getPlayersPositions(),
            jumps: endCalculationsManager.getDataForRequest(),
            perfectTakeoffs: this.perfectTakeoffsLog,
            telemarks: this.telemarksLog
        }
        
        if (modes.isTrainingMode()) {
            
            data.trainingResults = trainingManager.getTrainingTasks().map(task => task.value)
            
        } else if (
            corePhasesManager.disciplineActualAttempt < corePhasesManager.disciplineAttemptsCount
        ) {
            
            // ked este nie je posledny pokus, tak neposielame save results, ale v treningu ano
            store.commit('WaitingState/SET_STATE', {
                isWaiting: false
            })
            
            return
            
        }
        
        console.log('data to send', data)
        
        this.resultSent = true
        
        requestManager.sendSaveResultsRequest(
            (dataCallback: TrainingDataFromResultsRequest | unknown) => {
 
                if (modes.isTrainingMode()) {

                    store.commit('TrainingResultsState/SET_STATE_DATA', {
                        data: dataCallback,
                        bestScore: trainingManager.bestScore
                    })
                
                }

            },
            JSON.stringify(data)
        )
        
    }

    /**
     * Reset result
     */
    public reset (): void {

        this.resultSent = false
        this.perfectTakeoffsLog = 0
        this.telemarksLog = 0
    
    }
    
}

export const endManager = new EndManager()
