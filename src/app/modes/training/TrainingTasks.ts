import store from '@/store'
import { trainingManager, modes } from '@powerplay/core-minigames'
import { Tasks } from '../../types'

export class TrainingTasks {

    /** Mnozstvo uloh */
    private NUMBER_OF_TASKS = 4

    /**
     * Inicializovanie treningu
     */
    initTraining (): void {

        trainingManager.setNumberOfTasks(this.NUMBER_OF_TASKS)
    
    }
    
    /**
     * Hlavna privatna metoda, ktora riesi UI zmeny a trainingManager classu
     * @param name - meno tasku
     * @param value - Vyhodnotena hodnota tasku
     */
    saveTaskValue (name: Tasks, value: number): void {

        if (!modes.isTrainingMode()) return
        
        this.changeUI(name, value)
        trainingManager.setTaskValue(name, value)
    
    }

    /**
     * Zmena UI
     * @param name - meno tasku
     * @param value - Vyhodnotena hodnota tasku
     */
    private changeUI (name: Tasks, value: number) {

        console.log(`UI zmeny ${name} ma hodnotu ${value}`)
        const tpTask = trainingManager.getTpPerTask() * value
        console.log(tpTask)
        
        if (tpTask !== undefined) {
            
            store.commit('TrainingState/EDIT_TASK', {
                text: `trainingTask3-${name}`,
                percent: String(Math.ceil(value * 100)),
                points: String(Math.ceil(tpTask)),
                showPoints: true
            })
        
        }
    
    }

    /**
     * Reset
     */
    public reset (): void {

        trainingManager.resetAll()
    
    }

}

export const trainingTasks = new TrainingTasks()
