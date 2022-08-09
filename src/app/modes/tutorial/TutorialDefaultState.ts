import { game, tutorialManager, TutorialSectionType } from '@powerplay/core-minigames'

/** Classa pre defaultne stavy */
export class TutorialDefaultStates {

    /**
     * Defaultne logiky, ktore chceme pri nejakom type tasku
     * @param type - typ tasku ktory prave bezi
     */
    private defaultGameLogic (type: TutorialSectionType) {

        if (type === TutorialSectionType.storyInput) {

            // TODO: spustenie overlaya a pod :)
            game.pauseGame()
        
        } else if (type === TutorialSectionType.storyButton) {

            // nejaka logika
            game.pauseGame()
        
        }
    
    }

    /**
     * Defaultna logika ktora pusti game veci
     */
    private defaultLogic (): void {

        const type = tutorialManager.getActualSectionType()
        if (type) this.defaultGameLogic(type)
    
    }

    /**
     * Update loop
     */
    public update (): void {

        this.defaultLogic()
    
    }

}

export const tutorialDefaultStates = new TutorialDefaultStates()
