import { THREE } from '@powerplay/core-minigames'
import { END_OF_SPRING_BOARD_POSITION } from './gameConfig'

/** Konfig pre nastavenie takeoff fazy */
export const takeoffConfig = {
    
    /** zaciatok fazy  */
    startPhaseX: END_OF_SPRING_BOARD_POSITION.x + 8,
    
    /** ci treba zobrazit zaciatok fazy */
    debugShowPhaseStart: false,
    
    /** ideal place for action  */
    idealTakeoffPointX: END_OF_SPRING_BOARD_POSITION.x + 3,
    
    /** kolko pred a za idealnym bodom je idealna zona */
    idealTakeoffOffset: 0.2,
    
    /** where phase should end */
    triggerFinishPhaseX: END_OF_SPRING_BOARD_POSITION.x,
    
    /** impulz na idealnom bode na osi Y */
    maxImpulseY: 100,
    
    /** minimalny impulz na bode na osi Y */
    minImpulseY: {
        
        highestStartGate: 80,
        secondHighestStartGate: 50,
        otherGates: 0
        
    },
    
    /** Koeficienty pre rozdiel pri min velocity */
    minVelocityCoefSub: {
        
        highestStartGate: 0.05,
        secondHighestStartGate: 0.07,
        otherGates: 0.1
        
    },
    
    /** koeficient pre vypocet takeoff kvality */
    coefTakeoffQuality: 5,
    
    /** miesto animacie odrazu */
    takeoffAnimationPositionX: END_OF_SPRING_BOARD_POSITION.x + 3,
    
    /** rychlost animacie odrazu */
    takeoffAnimationSpeed: 1,
    
    /** nastavenie kamery aplikovane na zaciatku fazy. */
    cameraConfig: {
        
        // ci chceme zmeny aplikovat
        enabled: false,
        
        // ako daleko od hraca ma byt kamera
        // typ new THREE.Vector3(0, 0, 0) | undefined
        // hodnota undefined zresetuje hodnotu na deafult
        idealOffset: new THREE.Vector3(0, 2, -2),
        
        // ako daleko od hraca ma byt bod na ktory sa kamera pozera
        // typ new THREE.Vector3(0, 0, 0) | undefined
        // hodnota undefined zresetuje hodnotu na deafult
        idealLookAt: new THREE.Vector3(0, 1.5, 3),
        
        // ako rychlo ma kamera nasledovat hraca
        // typ number | undefined
        // hodnota undefined zresetuje hodnotu na deafult
        coefSize: undefined,
        
        // velkost lerpu pri zmene kamery
        changeLerp: 0.1
        
    },
    
    /**
     * nastavime body pre kategorie takeoff kvality
     */
    takeoffQuality: {
        
        perfect: 1,
        
        excellent: 0.8,
        
        good: 0.5
        
    }
    
}
