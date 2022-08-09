import { game, THREE } from '@powerplay/core-minigames'
import { END_OF_SPRING_BOARD_POSITION, gameConfig, takeoffConfig } from './config'
import { hill } from './Hill'
import type { HeightIntersectData } from './types'

/**
 * Trieda na vypocet krivky kopca a polmetrovych suradnic x
 */
export default class HillCurveCalculator {
    
    /** Hracova pozicia na osi z */
    private PLAYER_POSITION_Z = END_OF_SPRING_BOARD_POSITION.z;
    
    /** Pomocne body pre vypocet polmetrov */
    private points: THREE.Vector3[] = []
    
    /** Raycaster */
    private raycaster: THREE.Raycaster = new THREE.Raycaster()
    
    /** Pomocny vektor na zaznamenavanie bodov - tieto body sluzia na vypocet polmetrovych hodnot */
    private position = new THREE.Vector3(
        END_OF_SPRING_BOARD_POSITION.x,
        END_OF_SPRING_BOARD_POSITION.y,
        END_OF_SPRING_BOARD_POSITION.z
    )
    
    /** 3D objekt krivky */
    private curveObject3D!: THREE.Line;
    
    /** Objekt krivky */
    curveObject!: THREE.SplineCurve;
    
    /** Objekt pristavacej krivky */
    landingCurveObject?: THREE.SplineCurve;
    
    /** Ci sa bude zobrazovat krivka alebo nie */
    private showDebugCurve = false;
    
    /**
     * Pridanie bodu na kopci do pola
     * @param hillMesh - mesh kopca, ktory chceme raycastovat
     * @param offset - offset v m pre dieliky, po ktorych prechadzame
     */
    addPoint (hillMesh = hill.hillMesh, offset = gameConfig.hillCurveDefaultOffset): void {
        
        this.raycaster.set(
            this.position,
            new THREE.Vector3(0, -1, 0)
        )
        this.position.x -= offset
        
        const intersects = this.raycaster.intersectObject(hillMesh)
        
        if (intersects?.[0]?.distance) {

            const intersectsDistance = intersects?.[0]?.distance
            
            const position = this.position.clone()
            
            position.y = position.y - intersectsDistance
            
            this.points.push(new THREE.Vector3(position.x, position.y, position.z))
        
        }
        
    }
    
    /**
     * Ziskanie 2D bodu z kopca
     * @param hillMesh - mesh kopca, ktory chceme raycastovat
     * @param offset - offset v m pre dieliky, po ktorych prechadzame
     */
    getPoint2D (
        hillMesh = hill.hillMesh,
        offset = gameConfig.hillCurveDefaultOffset
    ): THREE.Vector2 {
        
        const result = new THREE.Vector2()
        
        this.position.x -= offset
        
        this.raycaster.set(
            this.position,
            new THREE.Vector3(0, -1, 0)
        )
        
        const intersects = this.raycaster.intersectObject(hillMesh)
        
        if (intersects?.[0]?.distance) {

            result.set(this.position.x, this.position.y - intersects?.[0]?.distance)
        
        }
        
        return result
        
    }
    
    /**
     * Vypocitanie konecnej krivky pri pristavani
     *
     * @param startingPosition - miesto odkial zaciname
     * @param length - ako dlha ma byt krivka
     * @param offset - po kolkych metroch vytvarame dalsi bod
     */
    calculateLandingCurve (startingPosition: THREE.Vector3, length: number, offset: number): void {
        
        // kam natrepeme ziskane body
        const resultArray: THREE.Vector2[] = []
        
        // miesto kam dame raycaster - hodnota 2000 nam zabezpeci, ze to bude dobre
        this.position.set(startingPosition.x, 2000, startingPosition.z)
        
        for (let i = startingPosition.x; i > startingPosition.x - length; i -= offset) {
            
            // const point = this.getPoint2D(hill.allPhysicalMeshes, offset)
            const point = this.getPoint2D(undefined, offset)
            
            // Bod 0.0 znamena ze sme nahodou nehitli nic
            if (point.x !== 0 && point.y !== 0) resultArray.push(point)
            
        }
        
        this.landingCurveObject = new THREE.SplineCurve(resultArray)
        
    }
    
    /**
     * Vypocitanie krivky pre mostik
     */
    calculateSpringBoardCurve (startPositionX: number): void {
        
        // Nastavime nejake pociatocne data
        const offset = gameConfig.hillCurveSpringBoardOffset
        // zaciatok na osi x, odkial pojdeme zistovat hodnoty pre krivku - kusok nad najskorsim
        // zaciatkom hraca
        const startPointX = startPositionX
        // koniec na osi x, pokial pojdeme zistovat hodnoty pre krivku. mal by to byt koniec mostika
        const endPointX = takeoffConfig.triggerFinishPhaseX
        
        // hodnota 2000 nam zabezpeci, ze vzdy pretneme mostik, lebo raycaster umiestnime na tuto
        // poziciu
        this.position.set(startPointX, 2000, this.PLAYER_POSITION_Z)
        
        const resultArray: THREE.Vector2[] = []
        
        for (let index = 0; index < (startPointX - endPointX) / offset; index++) {
            
            const point = this.getPoint2D(hill.springBoardMesh, offset)
            
            // Bod 0.0 nechceme davat, lebo potom pokazime krivku
            if (point.x !== 0 && point.y !== 0) resultArray.push(point)
            
        }
        
        this.curveObject = new THREE.SplineCurve(resultArray)
        
        // este to zobrazime, nech sa presvedcime, ze to je spravne
        if (this.showDebugCurve) {
            
            const points = this.curveObject.getPoints(400)
            const geometry = new THREE.BufferGeometry().setFromPoints(points)
            const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
            
            // Create the final object to add to the scene
            this.curveObject3D = new THREE.Line(geometry, material)
            this.curveObject3D.position.z = this.PLAYER_POSITION_Z
            
            game.scene.add(this.curveObject3D)
        
        }
        
    }
    
    /**
     * Vypocitanie polmetrovych usekov na bodoch v arrayi
     * @returns Array bodov
     */
    calculateHalfMeters (): THREE.Vector3[] {
        
        let halfMeterDistance = 0
        const halfMeters: THREE.Vector3[] = []
        const pom: number[] = []
        
        if (this.points[0]) {
            
            halfMeters.push(this.points[0])
        
        }
        
        for (let index = 0; index < this.points.length; index++) {

            const point1 = this.points[index]
            const point2 = this.points[index + 1]
            
            if (point1 && point2) {

                halfMeterDistance += point1.distanceTo(point2)
            
                if (halfMeterDistance >= 0.5) {

                    halfMeters.push(point2)
                    pom.push(
                        halfMeters[halfMeters.indexOf(point2)].distanceTo(
                            halfMeters[halfMeters.indexOf(point2) - 1]
                            
                        )
                    )
                    
                    halfMeterDistance = 0
                
                }
                
            }
            
        }
        
        return halfMeters
    
    }
    
    /**
     * Vygenerovanie a zobrazenie ciar na polmetroch
     */
    showHalfmeterLines (): void {
        
        for (let index = 0; index < 16000; index++) {
            
            this.addPoint()
            
        }
        
        const array = this.calculateHalfMeters()
        
        const prvyBod = new THREE.Mesh(
            new THREE.BoxGeometry(0.10, 5, 2),
            new THREE.MeshBasicMaterial({ color: '#ff0000' })
        )
        if (array[0]) {
            
            prvyBod.position.set(array[0].x, array[0].y, array[0].z)
        
        }
        
        game.scene.add(prvyBod)
        
        array.forEach((bod, index) => {
            
            let color = '#000000'
            
            if (index % 10 === 0) color = '#eeeeee'
            if (index === 100 * 2) {
                
                console.log('bod pre-modry', bod)
                
            }
            if (index === 115 * 2) {

                color = '#000080'
                console.log('bod modry', bod)
            
            }
            if (index === 130 * 2) {

                color = '#800080'
                console.log('bod cerveny', bod)
            
            }

            const bodMesh = new THREE.Mesh(
                new THREE.BoxGeometry(0.10, 0.10, 10),
                new THREE.MeshBasicMaterial({ color })
            )
            bodMesh.position.set(bod.x, bod.y, bod.z)
            game.scene.add(bodMesh)
        
        })
        
        let result = ''
        array.forEach((value) => {
            
            result += `${value.x},\n`
            
        })
        console.log(result)
        
        /* console.warn(array[279])
        console.warn(array)
        console.warn(JSON.stringify(array)) */
    
    }
    
    /**
     * Ziskanie Y suradnice z pozicie
     * @param position - pozicia na akej hladame intersect
     * @param hillMesh - mesh kopca, ktory chceme raycastovat
     * @returns - suradnica Y
     */
    getHeightAtPosition (
        position: THREE.Vector3,
        hillMesh = hill.hillMesh
    ): HeightIntersectData {
        
        this.raycaster.set(
            position,
            new THREE.Vector3(0, -1, 0)
        )
        
        const intersects = this.raycaster.intersectObject(hillMesh)
        
        const y = intersects?.[0] ? position.y - intersects?.[0]?.distance : -100
        const intersectionNormal = intersects?.[0]?.face?.normal.clone() || new THREE.Vector3()
        const intersectionPoint = intersects?.[0]?.point.clone()
        
        return { y, intersectionNormal, intersectionPoint }
        
    }

}

export const hillCurveCalculator = new HillCurveCalculator()
