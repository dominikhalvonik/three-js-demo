import { THREE } from '@powerplay/core-minigames'
import { HillPartsTypes, ModelsNames } from '../types'
import { modelsConfig } from './modelsConfig'

/** Konstanta pre pocitanie veci na mostiku, aby to bolo relativne a nie absolutne */
export const END_OF_SPRING_BOARD_POSITION: THREE.Vector3 = new THREE.Vector3(-2462.1, 532, -556.45)

/** Konfig pre nastavenie fyziky a aj celej hry */
export const gameConfig = {
    
    /** Pocet pokusov */
    numberOfAttempts: 2,
    
    /**
     * How much to damp the body velocity each step. 0-1
     * DEFAULT: 0.01
     */
    linearDamping: 0.01,
    
    /**
     * Hmotnost lyziara
     * DEFAULT: 1
     */
    playerMass: 70,
    
    /**
     * Trenie lyziara s kopcom
     * DEFAULT: 0.3
     */
    frictionPlayer: {
        [modelsConfig[ModelsNames.hill].mainMeshNames?.[HillPartsTypes.springBoard] || '']: 0.006,
        [modelsConfig[ModelsNames.hill].mainMeshNames?.[HillPartsTypes.hill] || '']: 0.003
    },
    
    /**
     * Tzv bounciness alebo skakavost lyziara vzhladom na kopec
     * DEFAULT: 0.3
     */
    restitutionPlayer: {
        [modelsConfig[ModelsNames.hill].mainMeshNames?.[HillPartsTypes.springBoard] || '']: 0,
        [modelsConfig[ModelsNames.hill].mainMeshNames?.[HillPartsTypes.hill] || '']: 0
    },
    
    /**
     * Relaxation time of the produced friction equations
     * DEFAULT: 3
     */
    frictionEquationRelaxationPlayer: {
        [modelsConfig[ModelsNames.hill].mainMeshNames?.[HillPartsTypes.springBoard] || '']: 3,
        [modelsConfig[ModelsNames.hill].mainMeshNames?.[HillPartsTypes.hill] || '']: 3
    },
    
    /**
     * Stiffness of the produced friction equations
     * DEFAULT: 1e7
     */
    frictionEquationStiffnessPlayer: {
        [modelsConfig[ModelsNames.hill].mainMeshNames?.[HillPartsTypes.springBoard] || '']: 1000000,
        [modelsConfig[ModelsNames.hill].mainMeshNames?.[HillPartsTypes.hill] || '']: 1000000
    },
    
    /**
     * Relaxation time of the produced contact equations
     * DEFAULT: 3
     */
    contactEquationRelaxationPlayer: {
        [modelsConfig[ModelsNames.hill].mainMeshNames?.[HillPartsTypes.springBoard] || '']: 3,
        [modelsConfig[ModelsNames.hill].mainMeshNames?.[HillPartsTypes.hill] || '']: 3
    },
    
    /**
     * Stiffness of the produced contact equations
     * DEFAULT: 1e7
     */
    contactEquationStiffnessPlayer: {
        [modelsConfig[ModelsNames.hill].mainMeshNames?.[HillPartsTypes.springBoard] || '']: 1000000,
        [modelsConfig[ModelsNames.hill].mainMeshNames?.[HillPartsTypes.hill] || '']: 1000000
    },
    
    /**
     * Gravitacia sveta
     * DEFAULT: (0, -14.31, 0)
     */
    gravitation: {
        x: 0,
        y: -9.81,
        z: 0
    },
    
    /**
     * minimalna pozicia x zaciatku skoku
     */
    startXMin: END_OF_SPRING_BOARD_POSITION.x + 76,
    
    /**
     * maximalna pozicia x zaciatku skoku
     */
    startXMax: END_OF_SPRING_BOARD_POSITION.x + 86,
    
    /**
     * % medzi min a max pozicie x zaciatku skoku a ci je to vobec aktivne
     */
    startPercent: {
        value: 50,
        active: false
    },
    
    /**
     * velkost kopca (HS)
     */
    hillSize: 140,
    
    /**
     * K-point (K)
     */
    kPoint: 125,
    
    /**
     * Default hodnota offsetu pre krivku a vypocet hodnot. Napr pri hodnote 0.05 pojde kazdy bod po
     * 5cm a bude brat hodnoty cez raycast
     */
    hillCurveDefaultOffset: 0.05,
    
    /**
     * Hodnota pre vypocet krivky mostika. Po x metroch, co su nastavene, pojde raycast a zaznamena
     * danu hodnotu y
     */
    hillCurveSpringBoardOffset: 0.25,
    
    /**
     * Koeficient pre umiestnenie tiena hraca
     */
    coefAdjustPlayerShadowPosition: 0.1,
    
    /**
     * na akej pozicii je max ozvucenie divakov
     */
    maxAudienceValPosX: END_OF_SPRING_BOARD_POSITION.x - 158,
    
    /**
     * aku minimalnu hlasitost maju divaci
     */
    minAudienceSound: 0.05,
    
    /**
     * aku maximalnu hlasitost maju divaci
     */
    maxAudienceSound: 1,
    
    /** nastavenie kamery aplikovane na zaciatku hry. */
    cameraConfig: {
        
        // ci chceme zmeny aplikovat
        enabled: true,
        
        // ako daleko od hraca ma byt kamera
        // typ new THREE.Vector3(0, 0, 0) | undefined
        // hodnota undefined zresetuje hodnotu na deafult
        idealOffset: new THREE.Vector3(0, 1.5, -2.5),
        
        // ako daleko od hraca ma byt bod na ktory sa kamera pozera
        // typ new THREE.Vector3(0, 0, 0) | undefined
        // hodnota undefined zresetuje hodnotu na deafult
        idealLookAt: new THREE.Vector3(0, 0, 1),
        
        // ako rychlo ma kamera nasledovat hraca
        // typ number | undefined
        // hodnota undefined zresetuje hodnotu na deafult
        coefSize: undefined,
        
        // velkost lerpu pri zmene kamery
        changeLerp: 1
        
    },
    
    /**
     * defaultna rychlost animacii
     */
    defaultAnimationSpeed: 1 / 2,
    
    /**
     * Koeficient pre lerp normal na kopci, aby nebol prechod medzi normalami "hranaty"
     */
    hillNormalLerpCoef: 0.1,
    
    /**
     * Koeficient pre lerp hracovej rotacie, aby tiez nebol prechod medzi rotaciami "hranaty"
     */
    playerRotationLerpCoef: 0.2,
    
    /**
     * nastavenie indikatoru vysky
     */
    heightIndicator: {
        
        /** ci je zapnuty */
        enabled: true,
        
        /** vyska v ktorej je indikator vysky roztiahnuty na 100% */
        fullHeight: 8
        
    },
    
    /**
     * Koeficient target coef zo specky
     */
    targetLineCoef: 114,
    
    /**
     * Koeficienty pre target ciaru
     */
    highScoreJumpLineCoefs: {
        
        coefDivide: 1.8,
        coefMultiply: 2,
        coefDivide2: 2,
        
        /** Min pocet metrov na zobrazenie ciary */
        minValue: 50,
        
        /** Max pocet metrov na zobrazenie ciary */
        maxValue: 150
        
    }
    
}
