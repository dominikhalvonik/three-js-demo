import { THREE } from '@powerplay/core-minigames'
import { END_OF_SPRING_BOARD_POSITION } from './gameConfig'

/**
 * konfig pre landing fazu
 */
export const landingConfig = {
    
    /** v akej vyske od zeme je idealne kliknut */
    idealActionHeight: 2.5,
    
    /** do akej vysky je treba kliknut */
    foulHeight: 0.3,
    
    /** minimalna hodnota pre vyhodnotenie telemarku Ideal */
    telemarkMinQualityIdeal: 1,
    
    /** minimalna hodnota pre vyhodnotenie telemarku Medium */
    telemarkMinQualityMedium: 0.75,
    
    /** minimalna hodnota pre vyhodnotenie telemarku Poor */
    telemarkMinQualityPoor: 0.5,
    
    /** minimalna hodnota pre vyhodnotenie telemarku twoFooted */
    minQualityTwoFooted: 0.25,
    
    /** ako dlho sa ma loopovat animacia po telemarku */
    secondsToPlayLoop: 0.5,
    
    /** na akej pozicii ukoncujeme fazu - "outrun line" */
    posEndPhaseX: END_OF_SPRING_BOARD_POSITION.x - 159,
    
    /** ako daleko ma lyziar zajst ak spadne */
    metersToPassOnFoul: 40,
    
    /** rychlost pohybu po krivke pri pade v m/s */
    curveMovementSpeedFoul: 5,
    
    /** rychlost pohybu po krivke pri dopade v m/s */
    curveMovementSpeed: 20,
    
    /** cim nasobime rychlost */
    speedDescreaseCoef: 0.999,
    
    /** ako casto nasobime rychlost */
    speedDecreaseFrames: 5,
    
    /** nastavenie kamery aplikovane na zaciatku fazy. */
    cameraConfig: {
        
        // ci chceme zmeny aplikovat
        enabled: true,
        
        // ako daleko od hraca ma byt kamera
        // typ new THREE.Vector3(0, 0, 0) | undefined
        // hodnota undefined zresetuje hodnotu na deafult
        idealOffset: new THREE.Vector3(0, 2, -3.5),
        
        // ako daleko od hraca ma byt bod na ktory sa kamera pozera
        // typ new THREE.Vector3(0, 0, 0) | undefined
        // hodnota undefined zresetuje hodnotu na deafult
        idealLookAt: new THREE.Vector3(0, 0, 1),
        
        // ako rychlo ma kamera nasledovat hraca
        // typ number | undefined
        // hodnota undefined zresetuje hodnotu na deafult
        coefSize: undefined,
        
        // velkost lerpu pri zmene kamery
        changeLerp: 0.05
        
    },
    
    /**
     * kolko framov po pristani sa prepne final camera
     */
    finishCameraStartFrames: 30,

    /** Gravitacne sily pri straceni action button */
    fallGravity: { x: 0, y: -30, z: 0 },
    
    /** shake kamery pri dopade */
    cameraShake: {
        
        /** ci mame zapnuty */
        enabled: true,
        
        /** o kolko posuvame dole */
        shiftDown: 1,
        
        /** ako dlho posun dole trva */
        shiftDownDuration: 0.25,
        
        /** ako rychlo sa kamera blizi k bodu dole */
        shiftDownCameraLerp: 0.1,
        
        /** o kolko posuvame hore */
        shiftUp: 1,
        
        /** ako dlho posun hore trva */
        shiftUpDuration: 0.25,
        
        /** ako rychlo sa kamera blizi k bodu dole */
        shiftUpCameraLerp: 0.1
        
    },
    
    /** po kolkych sekundach zacneme prehravat komentatora v poslednom skoku */
    lastAttemptCommentStart: 7
    
}
