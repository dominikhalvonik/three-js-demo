import { THREE } from '@powerplay/core-minigames'

/** konfig pre nastavenie letovej fazy */
export const flightConfig = {
    
    /** ci sa ma v konzole vypisovat momentalna vyska a ak ano, ako casto */
    debugLogHeight: {
        enabled: false,
        frequencyFrames: 5
    },
    
    /** ako daleko od zeme sa zacne Landing faza */
    distanceStartNextPhase: 10,
    
    /** akym koeficientom nasobime hodnotu vetra pre vypocty */
    windDirectionCoef: 1,
    
    /** Koeficienty pre vypocet kvality balansovania */
    balanceQualityCoefs: {
        
        highestStartGate: 0.5,
        secondHighestStartGate: 0.8,
        otherGates: 1
        
    },
    
    /** nastavenie kamery aplikovane na zaciatku fazy. */
    cameraConfig: {
        
        // ci chceme zmeny aplikovat
        enabled: true,
        
        // ako daleko od hraca ma byt kamera
        // typ THREE.Vector3(0, 0, 0) | undefined
        // hodnota undefined zresetuje hodnotu na deafult
        idealOffset: new THREE.Vector3(0, 2, -3.5),
        
        // ako daleko od hraca ma byt bod na ktory sa kamera pozera
        // typ THREE.Vector3(0, 0, 0) | undefined
        // hodnota undefined zresetuje hodnotu na deafult
        idealLookAt: new THREE.Vector3(0, 0, 0),
        
        // ako rychlo ma kamera nasledovat hraca
        // typ number | undefined
        // hodnota undefined zresetuje hodnotu na deafult
        coefSize: undefined,
        
        // velkost lerpu pri zmene kamery
        changeLerp: 0.05
        
    },
    
    /** rotacia pocas letu */
    rotationDuringFlight: 15 * Math.PI / 180,
    
    /**
     * balance
     */
    
    /** ci sa ma hodnota menit automaticky pocas inputu od hraca */
    isAutoMovementDuringInput: true,
    
    /** o kolko sa ma hodnota posunut pri inpute od hraca */
    inputStepSize: 4,
    
    /** balance koeficient pre vypocty */
    balanceCoef: 1,
    
    /** min hodnota */
    minValue: 0,
    
    /** max hodnota */
    maxValue: 100,
    
    /** velkost idealnej zony dookola idealneho bodu */
    idealOffset: 5,
    
    /** pociatocna, idealna hodnota */
    originValue: 50,
    
    /** ktory frame sa zmeni hodnota */
    changeValueFrames: 2,
    
    /** minimalne o kolko vietor ovplyvnuje vychylovanie */
    windStepMin: 1,
    
    /** maximalne o kolko vietor ovplyvnuje vychylovanie */
    windStepMax: 3,
    
    /** Koeficient na pocitanie kvality balancu */
    coefBalanceQuality: 50,
    
    /** Koeficient na pocitanie gravitacie s vetrom */
    windGravityYCoef: 0.5,

    /** Ak chceme stary typ rotacie */
    oldFlightRotation: true,
    
    /** kolko framov musi let trvat aby hrac nedostal penalizaciu za kratky let */
    penaltyShortFlight: 90
}
