import { pathAssets } from '@/globals/globalvariables'
import type { LoaderDataTypes } from '@powerplay/core-minigames'
import { ModelsNames } from '../types'

// Hlavny priecinok s modelmi
const modelsDir = `${pathAssets}/models/`

/**
 * Konfig pre modely
 */
export const modelsConfig: LoaderDataTypes = {
    [ModelsNames.skier]: {
        version: 4,
        femaleVersion: 3,
        ext: 'glb',
        genderActive: true,
        dir: modelsDir,
        mainMeshNames: [ModelsNames.skier]
    },
    [ModelsNames.hill]: {
        version: 5,
        ext: 'glb',
        dir: modelsDir,
        // pozor na poradie z HillPartsTypes !!!!
        mainMeshNames: ['Physics_JumpBridge_old', 'Physics_TrackMain']
    }
}
