import { THREE } from '@powerplay/core-minigames'
import { END_OF_SPRING_BOARD_POSITION } from '.'

/**
 * Konfig pre descent fazu
 */
export const descentConfig = {

    /** min hodnota */
    minValue: 0,

    /** max hodnota */
    maxValue: 100,

    /** pociatocna, idealna hodnota */
    originValue: 50,

    /** ktory frame sa zmeni hodnota */
    changeValueFrames: 2,

    /** o kolko minimalne sa bude menit hodnota automaticky */
    changeValueStepMin: 0,

    /** o kolko maximalne sa bude menit hodnota automaticky */
    changeValueStepMax: 1,

    /** koniec fazy  */
    stopPhaseX: END_OF_SPRING_BOARD_POSITION.x + 20,

    /** coef o kolko sa posunie bar */
    sensitivity: {

        /** pri kliku na PC */
        keyboard: 1,

        /** pri mobiloch */
        mobile: 1

    },

    /** ci mozeme menit hodnotu automaticky pocas toho ako hrac klika */
    isAutoMovementDuringClick: true,

    /** Koeficient akceleracie */
    accelerationCoef: 0.165,

    /** Zaciatocna rychlost v m/s */
    startSpeed: 1,

    /** Koeficient na umiestnenie hraca na trat, aby dobre sedel s tratou mostika v ramci vysky */
    coefAdjustPositionY: 0.95,

    /** Koeficienty pre akceleraciu */
    accelerationCoefs: {

        highestStartGate: {
            add: 5,
            divide: 6
        },
        secondHighestStartGate: {
            add: 4,
            divide: 5
        },
        otherGates: {
            add: 3,
            divide: 4
        }

    },

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

    }

}
