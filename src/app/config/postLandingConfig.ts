import { THREE } from '@powerplay/core-minigames'

export const postLandingConfig = {
    
    /** rychlost animacie dojazdu */
    animationSpeed: 0.4,
    
    /**
     * offset legenda:
     * x pozicia: zaporne dopredu, kladne dozadu
     * y pozicia: ignoruje sa
     * z pozicia: zaporne doprava, kladne dolava
     */
    
    /** offset bodov cez ktore lyziar prejde na konci */
    curvePoints: [
        new THREE.Vector3(-8, 0, -2),
        new THREE.Vector3(-12, 0, 4),
        new THREE.Vector3(-15, 0, 2)
    ],
    
    /** V kokatich percentach krivky sa ukonci */
    finishInPercent: 0.95,
    
    /** V kolkatich percentach krivky sa prehra emocna animacia */
    playEmotionAnimationInPercent: 0.7,
    
    /** cim nasobime rychlost */
    speedDescreaseCoef: 0.94,
    
    /** ako casto nasobime rychlost */
    speedDecreaseFrames: 3,
    
    /** aka je minimalna vzdialenost ktoru prejde lyziar na krivke kazdy frame */
    minSpeed: 0.1,
    
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
        idealLookAt: new THREE.Vector3(0, 0, 0),
        
        // ako rychlo ma kamera nasledovat hraca
        // typ number | undefined
        // hodnota undefined zresetuje hodnotu na deafult
        coefSize: undefined,
        
        // velkost lerpu pri zmene kamery
        changeLerp: 0.1
        
    }
    
}
