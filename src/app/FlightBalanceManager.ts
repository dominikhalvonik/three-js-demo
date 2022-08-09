import { THREE } from '@powerplay/core-minigames'
import { WindDirection } from './types/wind'
import { inputsManager } from './InputsManager'
import { windManager } from './WindManager'
import { flightConfig } from './config/flightConfig'
import store from '@/store'

/**
 * manage balance in flight phase
 */
export class FlightBalanceManager {
    
    /** hodnota na horizontalnej osi */
    private valueX = flightConfig.originValue;
    
    /** hodnota na zvislej osi */
    private valueY = flightConfig.originValue;
    
    /** kolko krat bol spusteny update */
    private frames = 0;
    
    /** ulozena auto movement val kvoli optimalizacii */
    private autoMoveVal = new THREE.Vector2();
    
    /** Pocet hodnot pre vypocet priemernej hodnoty */
    private averageQualityCount = 0;
    
    /** Sucet hodnot pre vypocet priemernej hodnoty */
    private averageQualityTotal = 0;
    
    /**
     * update every frame
     */
    update (): void {
        
        this.frames++
        this.updateMovement()
        
    }
    
    /**
     * updates values based on inputs and auto movement
     */
    private updateMovement (): void {

        let right: number, left: number, up: number, down: number
        
        // right +, left -
        if (
            store.getters['MovementState/getPositionX'] !== 0 ||
            store.getters['MovementState/getPositionY'] !== 0
        ) {

            if (store.getters['MovementState/getPositionX'] < 0) {

                left = Math.abs(store.getters['MovementState/getPositionX'])
                right = 0
            
            } else {

                right = Math.abs(store.getters['MovementState/getPositionX'])
                left = 0
            
            }

            if (store.getters['MovementState/getPositionY'] < 0) {

                up = Math.abs(store.getters['MovementState/getPositionY'])
                down = 0
            
            } else {

                down = Math.abs(store.getters['MovementState/getPositionY'])
                up = 0
            
            }
            
        } else {

            right = inputsManager.moveDirectionRight
            left = inputsManager.moveDirectionLeft
            up = inputsManager.moveDirectionForward
            down = inputsManager.moveDirectionBack
        
        }
        
        const movementX = (right - left) * flightConfig.inputStepSize
        const movementY = (up - down) * flightConfig.inputStepSize
        
        let autoMovement = this.getAutoMovementValue()
        // cek ci sme povolili zmenu vetra pocas kliku hraca
        const movement = right + left + up + down
        if (!flightConfig.isAutoMovementDuringInput && movement > 0) {

            autoMovement = new THREE.Vector2(0, 0)
        
        }
        
        this.valueX += movementX + autoMovement.x
        this.valueY += movementY + autoMovement.y
        
        if (this.valueX < flightConfig.minValue) this.valueX = flightConfig.minValue
        if (this.valueX > flightConfig.maxValue) this.valueX = flightConfig.maxValue
        if (this.valueY < flightConfig.minValue) this.valueY = flightConfig.minValue
        if (this.valueY > flightConfig.maxValue) this.valueY = flightConfig.maxValue
        
    }
    
    /**
     * gets difference from ideal zone
     *
     * @returns diff from ideal zone
     */
    private getDiffFromIdeal (): number {
        
        const IdealPoint = new THREE.Vector2(flightConfig.originValue, flightConfig.originValue)
        const actualPoint = new THREE.Vector2(this.valueX, this.valueY)
        
        let diff = IdealPoint.distanceTo(actualPoint) - flightConfig.idealOffset
        if (diff < 0) diff = 0
        
        return diff
        
    }
    
    /**
     * gets quality of balance
     * @param deviationCoef - Koeficient pre vypocet deviation
     * @returns balance quality
     */
    getBalanceQuality (deviationCoef: number): number {

        const deviation = this.getDiffFromIdeal() * deviationCoef
        
        const coef = flightConfig.coefBalanceQuality
        const quality = (coef - deviation) / coef
        
        this.averageQualityCount++
        this.averageQualityTotal += quality
        
        return quality
        
    }
    
    /**
     * Vratenie priemernej kvality
     * @returns Priemerna kvalita
     */
    getAverageQuality (): number {
        
        let penalty = 1
        if (this.frames < flightConfig.penaltyShortFlight) penalty = (this.frames + 10) * 0.01
        
        console.log('framesFlight:', this.frames, 'flightPenalty: ', penalty)
        
        return (this.averageQualityTotal / this.averageQualityCount) * penalty
        
    }
    
    /**
     * gets value of auto movement
     *
     * @returns Auto movement value
     */
    private getAutoMovementValue (): THREE.Vector2 {
        
        if (this.frames % flightConfig.changeValueFrames) return new THREE.Vector2(0, 0)
        
        return this.autoMoveVal
    
    }
    
    /**
     * sets value of auto movement so we do not need to recalculate it every frame
     * (wind is not changing in this phase)
     */
    setAutoMovementValue (): void {
        
        const wind = windManager.actualValue
        const windSpeed = this.getAutomovementStep()
        
        // bezvetrie
        if (wind.speed === 0) wind.direction = WindDirection.N
        
        if (WindDirection[wind.direction].includes('N')) this.autoMoveVal.y -= windSpeed
        if (WindDirection[wind.direction].includes('S')) this.autoMoveVal.y += windSpeed
        if (WindDirection[wind.direction].includes('E')) this.autoMoveVal.x += windSpeed
        if (WindDirection[wind.direction].includes('W')) this.autoMoveVal.x -= windSpeed
        
    }
    
    /**
     * gets actual value
     *
     * @returns valueX, valueY
     */
    get actualValue (): THREE.Vector2 {

        return new THREE.Vector2(this.valueX, this.valueY)
    
    }
    
    /**
     * gets how much should we move in autoMovement
     *
     * @returns auto movement size
     */
    private getAutomovementStep (): number {
        
        const wind = windManager.actualValue
        
        // bezvetrie
        if (wind.speed === 0) wind.direction = WindDirection.N
        // ak vietor smeruje sikmo, sila je polovicna v oboch smeroch
        if (WindDirection[wind.direction].length === 2) wind.speed /= 2
        
        const [min, max] = [flightConfig.windStepMin, flightConfig.windStepMax]
        
        return (max - min) * wind.speed + min
    
    }
    
    /**
     * reset
     */
    reset (): void {

        this.valueX = flightConfig.originValue
        this.valueY = flightConfig.originValue
        this.frames = 0
        this.autoMoveVal = new THREE.Vector2()
        this.averageQualityCount = 0
        this.averageQualityTotal = 0
    
    }
    
}

export const flightBalanceManager = new FlightBalanceManager()
