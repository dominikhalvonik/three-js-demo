import { AudioNames, type WindDirection, type WindValue } from './types'
import { windConfig } from './config'
import { audioManager } from '@powerplay/core-minigames'

/**
 * Trieda pre spravu vetra
 */
export class WindManager {
    
    /** rychlost vetra */
    private value = 0;
    
    /** smer vetra */
    private direction: WindDirection = 0;
    
    /** pocet framov na vypocet zmeny smeru/rychlosti */
    private frameCount = 0;
    
    /** o kolko sa rychlost vetra zmeni */
    private CHANGE_AMOUNT: number
    
    /** maximalna rychlost vetra */
    private MAX_WIND_SPEED: number
    
    constructor () {
        
        // interne ratame v celych cislach
        this.CHANGE_AMOUNT = windConfig.changeAmount * 10
        this.MAX_WIND_SPEED = windConfig.maxWindSpeed * 10
        
        this.setRandomValue()
        
    }
    
    /**
     * gets actual value and direction
     */
    get actualValue (): WindValue {

        return {
            speed: parseFloat((this.value / 10).toFixed(1)),
            direction: this.direction
        }
    
    }
    
    /**
     * sets random value and direction
     */
    private setRandomValue (): void {
        
        this.value = Math.random() * 10
        this.direction = Math.floor(Math.random() * windConfig.windDirectionCount)
        
        if (windConfig.hardcodedWindValue.isActive) {
            
            this.value = windConfig.hardcodedWindValue.speed * 10
            this.direction = windConfig.hardcodedWindValue.direction
            
        }
        
    }
    
    /**
     * randomizes value and direction
     */
    update (): void {
        
        // ak sme vypli randomizaciu rovno skoncime
        if (windConfig.hardcodedWindValue.isActive) return
        
        this.frameCount++
        
        if (this.frameCount % windConfig.intervalChangeValue !== 0) return
        
        this.randomizeSpeed()
        this.randomizeDirection()
        
        this.updateAudioVolume()
        
    }
    
    /**
     * Aktualizovanie hlasitosti vetra
     */
    updateAudioVolume (): void {
        
        audioManager.changeAudioVolume(AudioNames.wind, this.value / 10)
        
    }
    
    /**
     * randomizes direction of the wind
     */
    private randomizeDirection (): void {
        
        // get chance
        const chance = Math.random()
        
        // windDirection
        if (chance <= windConfig.chanceChangeDirectionIncrease) {
            
            this.direction++
            
            if (this.direction >= windConfig.windDirectionCount) this.direction = 0
        
        } else if (chance <= windConfig.chanceChangeDirectionDecrease) {

            this.direction--
            
            if (this.direction < 0) this.direction = windConfig.windDirectionCount - 1
        
        }
    
    }
    
    /**
     * randomizes speed of the wind
     */
    private randomizeSpeed (): void {
        
        // get chance
        const chance = Math.random()
        
        if (this.value === 0 || this.value === this.MAX_WIND_SPEED) {

            if (chance <= windConfig.chanceChangeSpeedExtreme) {

                const sign = this.value === 0 ? 1 : -1
                this.value += sign * this.CHANGE_AMOUNT
            
            }
            
            // nepotrebujeme pokracovat
            return
        
        }
        
        if (chance <= windConfig.chanceChangeSpeedIncrease) {

            this.value += this.CHANGE_AMOUNT

        } else if (chance <= windConfig.chanceChangeSpeedDecrease) {

            this.value -= this.CHANGE_AMOUNT

        }
        
        if (this.value > this.MAX_WIND_SPEED) this.value = this.MAX_WIND_SPEED
        
        if (this.value < 0) this.value = 0
    
    }
    
    /**
     * Resetovanie manazera
     */
    reset (): void {
        
        this.setRandomValue()
        
    }
    
}

export const windManager = new WindManager()
