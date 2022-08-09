import { descentConfig } from './config'
import { inputsManager } from './InputsManager'
import { balanceSideSign } from './types'
import store from '@/store'

/**
 * manage descent balance values
 */
export class DescentBalanceManager {

    /** aktualna hodnota */
    actualValue = descentConfig.originValue;
    
    /** Sucet hodnot pre vypocet priemernej kvality */
    private averageQualityTotal = 0;
    
    /** Pocet hodnot pre vypocet priemernej kvality */
    private averageQualityCount = 0;
    
    /** pocet spusteni update() */
    private frames = 0;
    
    /** Ci bolo kliknute alebo nie */
    clicked = false;
    
    /** Aktualna kvalita balancovania */
    private balanceQuality = 0;
    
    /**
     * handle events every frame
     */
    update (): void {
        
        if (this.clicked) return
        
        this.frames++

        let lDir: number, rDir: number, inputMovement: number
        
        // right hore, left dole
        if (store.getters['MovementState/getPositionX'] !== 0) {

            if (store.getters['MovementState/getPositionX'] < 0) {

                lDir = Math.abs(store.getters['MovementState/getPositionX'])
                rDir = 0

                inputMovement = -lDir * descentConfig.sensitivity.mobile
            
            } else {

                rDir = Math.abs(store.getters['MovementState/getPositionX'])
                lDir = 0

                inputMovement = rDir * descentConfig.sensitivity.mobile
            
            }
        
        } else {

            [lDir, rDir] = [inputsManager.moveDirectionLeft, inputsManager.moveDirectionRight]
            inputMovement = (rDir - lDir) * descentConfig.sensitivity.keyboard

        }
        
        const autoMovement = this.getAutoMovementValue()
        
        this.updateActualValue(inputMovement + autoMovement)
        // console.log(`input ${inputMovement}, auto ${autoMovement}, val ${this.actualValue}`)
    
    }
    
    /**
     * gets automatic movement
     * @returns value of movement
     */
    private getAutoMovementValue (): number {

        if (this.frames % descentConfig.changeValueFrames) return 0
        // cek ci mame povoleny auto movemement pocas hracovho inputu
        const [lDir, rDir] = [inputsManager.moveDirectionLeft, inputsManager.moveDirectionRight]
        if (!descentConfig.isAutoMovementDuringClick &&
             (lDir || rDir || store.getters['MovementState/getPositionX'])
        ) return 0
        
        let sign = this.actualValue < descentConfig.originValue
            ? balanceSideSign.left
            : balanceSideSign.right
        
        // nejaky random ak sme nahodou presne na idealy
        if (this.actualValue === descentConfig.originValue) {
            
            const chance = Math.random()
            sign = balanceSideSign.left
            if (chance > 0.5) {

                sign = balanceSideSign.right
            
            }
            
        }
        
        const [min, max] = [descentConfig.changeValueStepMin, descentConfig.changeValueStepMax]
        
        const step = Math.floor(Math.random() * (max - min + 1)) + min
        
        return sign * step
        
    }
    
    /**
     * gets diff from ideal in percent (0-1)
     *
     * @returns Kvalita (0-1)
     */
    getBalanceQuality (): number {
        
        if (this.clicked) return this.balanceQuality
        
        const coef = descentConfig.originValue
        this.balanceQuality = (coef - Math.abs(this.actualValue - coef)) / coef
        
        this.averageQualityCount++
        this.averageQualityTotal += this.balanceQuality
        
        return this.balanceQuality
        
    }
    
    /**
     * Vratenie priemernej kvality
     * @returns Priemerna kvalita
     */
    getAverageQuality (): number {
        
        if (this.averageQualityCount === 0) return 0
        return this.averageQualityTotal / this.averageQualityCount
        
    }
    
    /**
     * updates actual value
     * @param value- how much do we want to add
     */
    private updateActualValue (value: number): void {

        this.actualValue += value
        
        if (this.actualValue < descentConfig.minValue) this.actualValue = descentConfig.minValue
        if (this.actualValue > descentConfig.maxValue) this.actualValue = descentConfig.maxValue
        
    }
    
    /**
     * reset
     */
    reset (): void {

        this.actualValue = descentConfig.originValue
        this.averageQualityTotal = 0
        this.averageQualityCount = 0
        this.frames = 0
        this.clicked = false
        this.balanceQuality = 0
        
        store.commit('DescentBalanceState/SET_STATE', {
            isActive: false,
            value: 0
        })
    
    }

}

export const descentBalanceManager = new DescentBalanceManager()
