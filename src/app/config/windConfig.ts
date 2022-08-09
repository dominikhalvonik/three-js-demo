import { WindDirection } from '../types'

export const windConfig = {
    
    /** pocet smerov vetra */
    windDirectionCount: 8,
    
    /** po kolkych framoch sa zmeni smer a direction */
    intervalChangeValue: 15,
    
    /** o kolko sa rychlost vetra zmeni */
    changeAmount: 0.1,
    
    /** max rychlost vetra */
    maxWindSpeed: 1,
    
    /** sanca zmenit rychlost vetra pri extremoch 0, max */
    chanceChangeSpeedExtreme: 0.5,
    
    /** sanca zvysit rychlost vetra */
    chanceChangeSpeedIncrease: 0.33,
    
    /** sanca znizit rychlost vetra */
    chanceChangeSpeedDecrease: 0.66,
    
    /** sanca zmenit smer vetra */
    chanceChangeDirectionIncrease: 0.33,
    
    /** sanca zmenit smer vetra */
    chanceChangeDirectionDecrease: 0.66,
    
    /** ak je nastave isActive, tato hodnota sa napevno nastavi pre vietor namiesto nahodnej */
    hardcodedWindValue: {
        
        /** ci sa ma namiesto nahodnej zmeny pouzivat napevno nastaveny vietor */
        isActive: false,
        
        /** smer vetra */
        direction: WindDirection.NE,
        
        /** rychlost */
        speed: 1
        
    },
    /** koeficient podla smeru vetra */
    windDirCompensationCoef: {
        [WindDirection.N]: -1,
        [WindDirection.NE]: -0.5,
        [WindDirection.E]: 0,
        [WindDirection.SE]: 0.5,
        [WindDirection.S]: 1,
        [WindDirection.SW]: 0.5,
        [WindDirection.W]: 0,
        [WindDirection.NW]: -0.5
    },
    
    /** koeficient kompenzacie vetra */
    windCompensationCoef: 7.2
}
