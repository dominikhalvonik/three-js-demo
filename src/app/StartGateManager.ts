import { modes, playersManager } from '@powerplay/core-minigames'
import { gameConfig } from './config'
import { startGateConfig } from './config/startGateConfig'
import type { StartGateInfo } from './types'

/**
 * Trieda pre spravu najazdoveho okna
 */
export class StartGateManager {
    
    /** Data pre konkretne najazdove okno */
    info!: StartGateInfo;
    
    /** Pocet percent, z ktorej casti mostika zaciname */
    startPercent = 0;
    
    /** Najazdove okno z BE */
    startGateFromServer = 0;
    
    /**
     * Nastavenie najazdoveho okna zo servera
     * @param startGate - Hodnota najazdoveho okna z BE
     */
    setStartGateFromServer (startGate: number): void {
        
        this.startGateFromServer = startGate
        
    }
    
    /**
     * Nastavenie zakladnych veci
     */
    setUp (): void {
        
        this.setStartGateInfo()
        this.setStartPercent()
        
        console.log('StartGate', this.info)
        
    }
    
    /**
     * Zistenie, ci ide o najazdove okno, ktore je najvyssie a je pre zaciatocnikov
     * @returns true ak ide o okno s najvyssim indexom
     */
    isHighestGateForBegginers (): boolean {
        
        return this.info.gate === startGateConfig.highestGateForBegginers
        
    }
    
    /**
     * Zistenie, ci ide o najazdove okno, ktore je druhe najvyssie a je pre zaciatocnikov
     * @returns true ak ide o okno s najvyssim indexom
     */
    isSecondHighestGateForBegginers (): boolean {
        
        return this.info.gate === startGateConfig.secondHighestGateForBegginers
        
    }
    
    /**
     * gets start gate based on power of players in current competition
     * @param attribute - Hodnota atributu
     * @returns start gate info
     */
    getGateInfoByAttribute (attribute: number): StartGateInfo {

        return startGateConfig.attributesInfo
            .filter((val) => {

                return val.minAttribute <= attribute && val.maxAttribute >= attribute
            
            })
            .sort((a, b) => b.gate - a.gate)[0]
        
    }
    
    /**
     * Vratenie infa pre startGate podla cisla branky
     * @param gateNumber - Cislo branky
     * @returns start gate info
     */
    getGateInfoByIndex (gateNumber: number): StartGateInfo {

        return startGateConfig.attributesInfo.filter((val) => {

            return val.gate === gateNumber
            
        })[0]
        
    }
    
    /**
     * Nastavenie informacii pre najazdove okno
     * @returns Info
     */
    setStartGateInfo (): StartGateInfo {
        
        const attribute = playersManager.getBestAttribute()
        
        this.info = modes.isTutorial()
            ? startGateConfig.attributesInfo[0]
            : this.getGateInfoByAttribute(attribute)
        
        // Podla parametra z BE by malo byt prioritne, TODO neskor by sme mali odstranit alternativu
        if (
            this.startGateFromServer > 0 &&
            this.startGateFromServer <= startGateConfig.highestGateForBegginers
        ) {

            this.info = this.getGateInfoByIndex(this.startGateFromServer)
        
        }
        
        return this.info
        
    }
    
    /**
     * Nastavenie hodnoty percent, ktore urcuju, kde zaciname na mostiku
     * @returns %, kde zaciname na mostiku
     */
    setStartPercent (): number {
        
        this.startPercent = (this.info.gate - 1) * 5
        
        // ak chceme forcneut data z konfigu, tak ich prepiseme
        if (gameConfig.startPercent.active) this.startPercent = gameConfig.startPercent.value
        
        return this.startPercent
        
    }
    
    /**
     * Vratenie koeficientu podla atributu
     * @returns Koeficient podla atributu
     */
    getAttributeCoef (): number {
        
        const { minAttribute, maxAttribute } = this.info
        
        let playerStrength = modes.isTutorial()
            ? 100
            : playersManager.getPlayer().attribute.total
        let attributeCoef = 0
        if (playerStrength > maxAttribute) playerStrength = maxAttribute
        if (playerStrength > minAttribute) {

            attributeCoef = (playerStrength - minAttribute) /
                (maxAttribute - minAttribute)
        
        } else {
            
            attributeCoef = (playerStrength - minAttribute) / minAttribute
            
        }
        
        return attributeCoef
        
    }
    
}

export const startGateManager = new StartGateManager()
