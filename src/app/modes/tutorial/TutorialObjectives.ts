import store from '@/store'
import {
    tutorialManager,
    type TutorialObjective
} from '@powerplay/core-minigames'

export class TutorialObjectives {

    private objectives: TutorialObjective[] = []

    /** ktory pokus mame */
    private attempts = 1

    /** aby sa nam nelogovali pokusy navyse */
    private attemptHelper = false
    
    /** v ktorom pokuse sme ulohu splnili pre tutorial */
    private objectivePassed: Record<string, number> = {};

    public getAttempts (): number {

        return this.attempts
    
    }
    
    public setObjectives (objectives: TutorialObjective[]): this {

        this.objectives = objectives
        store.commit('TutorialState/SET_OBJECTIVES', objectives)
        
        return this

    }

    public passObjective (objectiveId: string): void {

        // zalogujeme cislo pokusu v ktorom sme zvladli ulohu
        if (this.objectivePassed[objectiveId] === undefined) {

            this.objectivePassed[objectiveId] = this.attempts
        
        }
        
        this.getObjectiveById(objectiveId).failed = false
        this.getObjectiveById(objectiveId).passed = true
        store.commit('TutorialState/SET_OBJECTIVES', this.objectives)

    }
    
    public failObjective (objectiveId: string): void {

        this.getObjectiveById(objectiveId).passed = false
        this.getObjectiveById(objectiveId).failed = true
        store.commit('TutorialState/SET_OBJECTIVES', this.objectives)

    }

    public update (): void {

        if (this.objectives.length === 0) return
        this.checkIfRetry()
        this.checkIfAllObjectivesPassed()

    }

    private checkIfRetry (): void {

        if (!this.attemptHelper && tutorialManager.getActualSectionId() === 14) {

            this.attemptHelper = true
            this.attempts += 1
        
        } else if (this.attemptHelper && tutorialManager.getActualSectionId() === 13) {

            this.attemptHelper = false
        
        }
    
    }

    public checkIfAllObjectivesPassed (): boolean {

        // logika
        const passedArray = this.objectives.map(this.checkIfObjectivePassed)
        if (passedArray.length === 0 || passedArray.includes(false)) return false

        // TODO: Spravit si log ze all done co pouzije attempts - MISO
        console.log(this.attempts)
        return true
    
    }

    private checkIfObjectivePassed (objective: TutorialObjective): boolean {

        return objective.passed

    }
    
    private getObjectiveById (id: string): TutorialObjective {
        
        const objectiveIndex = this.objectives.findIndex((objective: TutorialObjective) => {

            return objective.id === id

        })

        if (objectiveIndex === -1) throw Error('Index not found')

        return this.objectives[objectiveIndex]
    
    }

    public reset (): void {

        this.attemptHelper = false
    
    }
    
    /**
     * ziskame prejdene ulohy
     * @returns objekt s id prejdenej ulohy a pokusom
     */
    public getPassedObjectives (): Record<string, number> {
        
        const obj = this.objectivePassed
        obj.attempts = this.attempts
        return obj
        
    }

}
export const tutorialObjectives = new TutorialObjectives()
