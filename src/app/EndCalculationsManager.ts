import store from '@/store'
import {
    corePhasesManager, modes, playersConfig, playersManager,
    tutorialManager
} from '@powerplay/core-minigames'
import {
    hillCurveHalfmetersConfig,
    gameConfig,
    landingConfig,
    marksConfig,
    windConfig
} from './config'
import { tutorialObjectives } from './modes/tutorial/TutorialObjectives'
import {
    CalculatedDataTypesForOneJump,
    TutorialObjectiveIds,
    type CalculatedDataForOneJump,
    type JumpResultForRequest, type MarkInfo} from './types'
import { windManager } from './WindManager'

/**
 * Trieda na konecne vypocty
 */
export default class EndCalculationsManager {
    
    /** Vypocitane pre kola */
    calculatedData: CalculatedDataForOneJump[] = []
    
    /** Index najvyssej znamky od rozhodcov */
    highestMarkIndex = 0
    
    /** Index najnizsej znamky od rozhodcov */
    lowestMarkIndex = 0
    
    /** Krajiny rozhodcov */
    private COUNTRIES = ['fin', 'hun', 'svk', 'swe', 'aut']
    
    /**
     * Inicializovanie
     */
    init (): void {
        
        for (let i = 0; i < corePhasesManager.disciplineAttemptsCount; i++) {
            
            this.calculatedData[i] = {
                [CalculatedDataTypesForOneJump.meters]: 0,
                [CalculatedDataTypesForOneJump.points]: 0,
                [CalculatedDataTypesForOneJump.marks]: [0, 0, 0, 0, 0],
                [CalculatedDataTypesForOneJump.pointsDistance]: 0,
                [CalculatedDataTypesForOneJump.pointsStyle]: 0,
                [CalculatedDataTypesForOneJump.compensationWind]: 0,
                [CalculatedDataTypesForOneJump.descentQuality]: 0,
                [CalculatedDataTypesForOneJump.takeoffQuality]: 0,
                [CalculatedDataTypesForOneJump.flightQuality]: 0,
                [CalculatedDataTypesForOneJump.landingQuality]: 0,
                [CalculatedDataTypesForOneJump.windDirection]: '',
                [CalculatedDataTypesForOneJump.windValue]: 0,
                [CalculatedDataTypesForOneJump.fall]: false
            }
            
        }
        
    }
    
    /**
     * Vratenie vypocitanych dat pre aktualny pokus
     * @returns Data
     */
    getActualCalculatedData (): CalculatedDataForOneJump {
        
        return this.calculatedData[corePhasesManager.disciplineActualAttempt - 1]
        
    }
    
    /**
     * Nastavenie vypocitanych dat pre aktualny pokus
     * @param type - index data
     * @param value - hodnota pre konkretny index dat
     */
    setActualCalculatedData (
        type: CalculatedDataTypesForOneJump,
        value: number | number[] | boolean | string
    ): number | number[] | boolean | string {
        
        const attempt = corePhasesManager.disciplineActualAttempt - 1
        
        if (type === CalculatedDataTypesForOneJump.marks) {
            
            this.calculatedData[attempt][type] = value as number[]
            
        } else if (type === CalculatedDataTypesForOneJump.windDirection) {
            
            this.calculatedData[attempt][type] = value as string
            
        } else if (type === CalculatedDataTypesForOneJump.fall) {
            
            this.calculatedData[attempt][type] = value as boolean
            
        } else {
            
            this.calculatedData[attempt][type] = value as number
            
        }
        
        return this.calculatedData[attempt][type]
        
    }
    
    /**
     * kontrola ci prekonal hill size
     * @returns ci prekonal hill size
     */
    get isOverHillSize (): boolean {
        
        return this.getActualCalculatedData().meters >= gameConfig.hillSize
        
    }
    
    /**
     * kontrola ci prekonal k point
     * @returns ci prekonal k point
     */
    get isOverKpoint (): boolean {
        
        return this.getActualCalculatedData().meters >= gameConfig.kPoint
        
    }
    
    /**
     * kontrola ci prekonal osobny rekord
     * @returns ci prekonal osobny rekord
     */
    get isPersonalRecord (): boolean {

        return this.getActualCalculatedData().points >= playersManager.getPlayer().personalBest
    
    }
    
    /**
     * kontrola ci je v top3
     * @returns ci je v top3
     */
    get isTop3 (): boolean {

        return playersManager.getPlayerActualPosition() <= 3
    
    }
    
    /**
     * kontrola ci sa dotkol snehu
     * @returns ci sa dotkol snehu
     */
    get isTouchedSnow (): boolean {

        return this.getActualCalculatedData().landingQuality < landingConfig.minQualityTwoFooted
        
    }
    
    /**
     * kontrola ci je hrac v spodnych 30%
     * @returns ci sa umiestnil v spodnych 30%
     */
    get isBottom30 (): boolean {

        const playerPos = playersManager.getPlayerActualPosition()
        if (!playerPos) return false
        const third = Math.floor(playersManager.players.length * 0.3)
        return playerPos >= playersManager.players.length - third
    
    }
    
    /**
     * Vypocitanie vzdialenosti dopadu
     * @param x - Pozicia na osi X
     * @returns Vzdialenost
     */
    calculateLandingDistance (x: number): number {

        const closest = hillCurveHalfmetersConfig.reduce(
            (prev, curr) => Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev
        )
        
        // polmetre, takze /2 a 10m offset
        // offset davame kvoli tomu, aby vypocet sedel s grafikou na kopci
        const meters = this.setActualCalculatedData(
            CalculatedDataTypesForOneJump.meters,
            (hillCurveHalfmetersConfig.indexOf(closest) / 2) + 10
        ) as number

        if (tutorialManager.getActualSectionId() === 13 && meters >= 110) {

            console.error('METERS JUMPED')
            tutorialObjectives.passObjective(TutorialObjectiveIds.jumpLength as string)
        
        }
        
        console.log(`METERS: ${meters}`)
        
        return meters
        
    }
    
    /**
     * Vypocitanie bodov za vzdialenost
     * @returns Body
     */
    private getDistancePoints (): number {
        
        const pointsForKPoint = 60
        const coefForOneMeter = 1.8
        const metersMinusPointK = this.getActualCalculatedData().meters - gameConfig.kPoint
        const sum = ((metersMinusPointK) * coefForOneMeter) + pointsForKPoint
        
        // zaokruhlime
        const pointsDistance = this.setActualCalculatedData(
            CalculatedDataTypesForOneJump.pointsDistance,
            parseFloat(sum.toFixed(1))
        ) as number
        
        return pointsDistance
        
    }
    
    /**
     * vypocitanie kompenzacie vetra
     *
     * @returns Body
     */
    public getWindCompenstation (): number {

        const sum = windManager.actualValue.speed *
            windConfig.windDirCompensationCoef[windManager.actualValue.direction] *
            windConfig.windCompensationCoef
    
        // zaokruhlime
        const windDirCompensation = this.setActualCalculatedData(
            CalculatedDataTypesForOneJump.compensationWind,
            parseFloat(sum.toFixed(1))
        ) as number
        return windDirCompensation
    
    }
    
    /**
     * vypocitanie kompenzacie za najazdove okno
     * TODO: nieje naspeckovanie, niesom si isty co je tymto myslene vobec !!!
     *
     * @returns Body
     */
    private getSpringBoardCompensation (): number {
        
        return 0
        
    }
    
    /**
     * zaokruhlime cislo na polbod
     * @param num - cislo na zaokruhlenie
     */
    private roundToHalfPoint (num: number): number {
        
        const intNum = parseInt(num.toString())
        let decPart = num - intNum
        
        if (decPart < 0.25) {

            decPart = 0
        
        } else if (decPart < 0.75) {

            decPart = 0.5
        
        } else {

            decPart = 1
        
        }
        
        return intNum + decPart
    
    }
    
    /**
     * vypocitame znamky od rozhodcov
     */
    private calculateReffereeMarks () {
        
        const { landingQuality, meters } = this.getActualCalculatedData()
        const baseMark = marksConfig.baseMark
        const styleCoef = marksConfig.styleCoef
        const maxMark = baseMark + landingQuality * styleCoef
        const maxMarkRounded = this.roundToHalfPoint(maxMark)
        const styleMarkRange = meters >= marksConfig.styleMarkRangeTreshold
            ? marksConfig.styleMarkRangeAboveTreshold
            : marksConfig.styleMarkRangeBelowTreshold
        const minMark = maxMarkRounded - styleMarkRange
        
        // nastavime znamky od rozhodcov
        const marksTemp = this.getActualCalculatedData().marks.map(() => {

            const randNum = Math.random() * (maxMark - minMark) + minMark
            let mark = this.roundToHalfPoint(randNum)
            
            if (meters >= gameConfig.kPoint) mark += marksConfig.kPointBonus
            if (meters >= gameConfig.hillSize) mark += marksConfig.hillSizeBonus
            
            return mark
        
        })
        
        console.log('marksTemp', marksTemp)
        
        let marks = this.setActualCalculatedData(
            CalculatedDataTypesForOneJump.marks,
            marksTemp
        ) as number[]
        
        // penalizacia
        let penalty = 0
        const fall = this.getActualCalculatedData().fall
        
        if (landingQuality < landingConfig.minQualityTwoFooted && !fall) {
            
            penalty = marksConfig.penaltiesHandTouch.find(
                (val) => val.from <= meters && val.to >= meters
            )?.points || 0
            
        }
        
        if (fall) {
            
            penalty = marksConfig.penaltiesFall.find(
                (val) => val.from <= meters && val.to >= meters
            )?.points || 0
            
        }
        
        if (penalty) {
                
            marks = this.setActualCalculatedData(
                CalculatedDataTypesForOneJump.marks,
                marks.map((val) => val + penalty)
            ) as number[]
            
        }
        
        console.log('MARKS: ', marks)
        
    }
    
    /**
     * vypocitanie bodov za styl
     * @returns Body
     */
    private getStylePoints (): number {
        
        this.calculateReffereeMarks()
        
        let sum = 0
        const { marks } = this.getActualCalculatedData()
        
        marks.forEach((mark, index) => {
            
            const lowestMark = marks[this.lowestMarkIndex]
            const highestMark = marks[this.highestMarkIndex]
            
            if (mark <= lowestMark) this.lowestMarkIndex = index
            if (mark >= highestMark && this.lowestMarkIndex !== index) {
                
                this.highestMarkIndex = index
                
            }
            sum += mark
            
        })
        
        // eslint-disable-next-line max-len
        console.log('SKRTAJU sa znamky', marks[this.highestMarkIndex], marks[this.lowestMarkIndex])
        
        const pointsStyle = this.setActualCalculatedData(
            CalculatedDataTypesForOneJump.pointsStyle,
            sum - marks[this.highestMarkIndex] - marks[this.lowestMarkIndex]
        ) as number
        
        return pointsStyle
    
    }
    
    /**
     * Vypocitanie celkoveho bodoveho vysledku
     * @returns Body
     */
    getTotalPoints (): number {
        
        const distancePoints = this.getDistancePoints()
        const stylePoints = this.getStylePoints()
        const windPoints = endCalculationsManager.getWindCompenstation()
        const springBoardPoints = endCalculationsManager.getSpringBoardCompensation()
        
        let pointsBase = distancePoints + windPoints + springBoardPoints + stylePoints
        if (pointsBase < 0) pointsBase = 0
        
        const points = this.setActualCalculatedData(
            CalculatedDataTypesForOneJump.points,
            parseFloat(pointsBase.toFixed(1))
        ) as number
        
        console.log(
            '---BODY---\n',
            `distance: ${distancePoints}\n`,
            `style: ${stylePoints}\n`,
            `windCompensation: ${windPoints}\n`,
            `springBoardCompensation: ${springBoardPoints}\n`,
            `total: ${points}`
        )
        
        return points
        
    }
    
    public getTotalPointsAllAttempts (): number {
        
        let points = 0
        
        for (let i = 0; i < this.calculatedData.length; i++) {

            points += this.calculatedData[i][CalculatedDataTypesForOneJump.points]
        
        }
        
        return points
        
    }
    
    /**
     * gets country with marks
     */
    private getCountryMarks (): MarkInfo[] {
        
        const { marks } = this.getActualCalculatedData()
        
        const countryMarks = marks.map((_val, i) => {
            
            return {
                country: this.COUNTRIES[i],
                countryString: this.COUNTRIES[i],
                points: `${marks[i].toFixed(1)}`
            }
            
        })
        
        return countryMarks
        
    }
    
    /**
     * sets data for infromations display
     */
    setInformations (): void {
        
        const { meters, compensationWind } = this.getActualCalculatedData()
        const points = this.getTotalPointsAllAttempts()
        
        let secondLength = ''
        
        if (corePhasesManager.disciplineActualAttempt > 1) {

            const data = this.calculatedData[corePhasesManager.disciplineActualAttempt - 2]
            secondLength = `${data.meters.toFixed(1)}m`
            
        }
        
        if (modes.isTutorial()) return
        store.commit('InformationState/SET_STATE', {
            opinionInfo: this.getCountryMarks(),
            points: `${points.toFixed(1)}p`,
            meters: `${meters.toFixed(1)}m`,
            secondLength: secondLength,
            wind: `${compensationWind.toString()}`
        })
        
    }
    
    /**
     * Vratenie dat pre request
     * @returns Data
     */
    getDataForRequest (): JumpResultForRequest[] {
        
        return this.calculatedData.map((value) => {
            
            return {
                
                meters: value.meters,
                points: value.points,
                points_distance: value.pointsDistance,
                points_style: value.pointsStyle,
                compensation_wind: value.compensationWind
                
            }
            
        })
        
    }
    
    /**
     * Ziskanie target distance na vyhratie
     * @param withWind - Ci to bude s vetrom alebo nie
     * @returns Vzdialenost
     */
    public getTargetDistanceToWin (withWind = true): number {
        
        const attempt = corePhasesManager.disciplineActualAttempt - 1
        const bestScore = playersManager.getBestResult(playersConfig.sortType)
        const targetPoints = bestScore - playersManager.getPlayerMainResult(attempt - 1)
        const windCompensation = withWind ? endCalculationsManager.getWindCompenstation() : 0
        const { kPoint, targetLineCoef, highScoreJumpLineCoefs } = gameConfig
        const { coefDivide, coefMultiply, coefDivide2 } = highScoreJumpLineCoefs
        
        console.log('attempt:', attempt)
        console.log('bestScore:', bestScore)
        console.log('player:', playersManager.getPlayerMainResult(attempt - 1))
        console.log('windCompensation:', windCompensation)
        
        return Math.ceil(
            ((targetPoints - targetLineCoef - windCompensation) / coefDivide + kPoint) *
                coefMultiply
        ) / coefDivide2
        
    }
    
    /**
     * Reset managera
     * @param hardReset - ak true tak tvrdy reset
     */
    reset (hardReset = false): void {
        
        this.highestMarkIndex = 0
        this.lowestMarkIndex = 0
        
        if (hardReset) {
            
            this.init()
            
        }
        
    }
    
}

export const endCalculationsManager = new EndCalculationsManager()
