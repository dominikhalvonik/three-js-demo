import store from '@/store'
import { displayManager, game, TypeEvents } from '@powerplay/core-minigames'

/**
 * Trieda pre inputy
 */
export class InputsManager {
    
    /** Aktualny pohyb dolava */
    moveDirectionLeft = 0;
    
    /** Aktualny pohyb doprava */
    moveDirectionRight = 0;
    
    /** Aktualny pohyb dopredu */
    moveDirectionForward = 0;
    
    /** Aktualny pohyb dozadu */
    moveDirectionBack = 0;
    
    /** Aktualne stlacenie akcie */
    actionPressed = 0;
    
    /** Aktualne stlacenie exit */
    exitPressed = 0;
    
    /** Ci je mod pre video alebo nie */
    private videoMode = false;
    
    /**
     * Nastavenie veci po inpute pohybu vlavo
     * @param type - typ eventu
     */
    onKeyLeft = (type: TypeEvents): void => {

        this.moveDirectionLeft = type === TypeEvents.down ? 1 : 0

    }
    
    /**
     * Nastavenie veci po inpute pohybu vpravo
     * @param type - typ eventu
     */
    onKeyRight = (type: TypeEvents): void => {
        
        this.moveDirectionRight = type === TypeEvents.down ? 1 : 0
        
    }
    
    /**
     * Nastavenie veci po inpute pohybu hore
     * @param type - typ eventu
     */
    onKeyUp = (type: TypeEvents): void => {
        
        this.moveDirectionForward = type === TypeEvents.down ? 1 : 0
        
    }
    
    /**
     * Nastavenie veci po inpute pohybu dole
     * @param type - typ eventu
     */
    onKeyDown = (type: TypeEvents): void => {
        
        this.moveDirectionBack = type === TypeEvents.down ? 1 : 0
        
    }
    
    /**
     * Nastavenie veci po inpute akcie
     * @param type - typ eventu
     */
    onKeyAction = (type: TypeEvents): void => {
        
        this.actionPressed = type === TypeEvents.down ? 1 : 0
        
    }
    
    /**
     * Nastavenie veci po inpute exit
     * @param type - typ eventu
     */
    onKeyExit = (type: number): void => {

        this.exitPressed = type === TypeEvents.down ? 1 : 0
        store.commit('InputsState/SET_EXIT_PRESSED', this.exitPressed)
        
    }
    
    /**
     * Nastavenie veci po inpute prepare video
     */
    onKeyPrepareVideo = (): void => {
        
        // priprava videa sa riesi iba raz a iba na prostredi, kde to je povolene
        const appVideoAvailable = Number(import.meta.env.VITE_APP_VIDEO_AVAILABLE) === 1
        const local = Number(import.meta.env.VITE_APP_LOCAL)
        if (!local && !appVideoAvailable) return
        
        // prevratime si hodnotu
        this.videoMode = !this.videoMode
        
        const liveLayout = document.getElementById('live-layout')
        const gameWrapper = document.getElementById('game-wrapper')
        if (!liveLayout || !gameWrapper) return

        if (this.videoMode) {
            
            // najskor musime dat mobilne prostredie
            liveLayout.classList.add('mobile')
            liveLayout.classList.remove('web')
        
            // musime zmenit rozmery displayManagera
            displayManager.width = window.innerWidth
            displayManager.height = window.innerHeight
            
            // musime este dat prec UI
            gameWrapper.style.display = 'none'
            
        } else {
            
            // najskor musime dat webove prostredie
            liveLayout.classList.add('web')
            liveLayout.classList.remove('mobile')
        
            // musime zmenit rozmery displayManagera
            displayManager.width = 1280
            displayManager.height = 720
            
            // musime vratit naspat UI
            gameWrapper.style.display = 'block'
            
        }
        
        // musime nastavit iny render size
        game.renderManager.setSize(100)
        
    }
    
}

export const inputsManager = new InputsManager()
