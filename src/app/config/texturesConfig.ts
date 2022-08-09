import { pathAssets } from '@/globals/globalvariables'
import type { LoaderDataTypes } from '@powerplay/core-minigames'
import { TexturesNames } from '../types'

// Hlavny priecinok s texturami
const texturesDir = `${pathAssets}/textures`

/**
 * Konfig pre textury
 */
export const texturesConfig: LoaderDataTypes = {
    [TexturesNames.skier]: {
        version: 2,
        ext: 'jpg',
        genderActive: true,
        dir: `${texturesDir}/skier/`,
        subTextures: {
            skinFile: TexturesNames.skierRaceNoRace,
            clothesFile: TexturesNames.skierClothes
        }
    },
    [TexturesNames.skierLightmap]: {
        ext: 'png',
        femaleVersion: 2,
        genderActive: true,
        dir: `${texturesDir}/skier/`,
        returnTextureLightmap: true
    },
    [TexturesNames.skierNormal]: {
        version: 2,
        ext: 'jpg',
        genderActive: true,
        dir: `${texturesDir}/skier/`,
        returnTextureNormal: true
    },
    [TexturesNames.hill]: {
        version: 2,
        ext: 'ktx2',
        dir: `${texturesDir}/hill/`
    },
    [TexturesNames.transparent]: {
        ext: 'ktx2',
        dir: `${texturesDir}/hill/`
    },
    [TexturesNames.staticPeople]: {
        ext: 'ktx2',
        dir: `${texturesDir}/hill/`
    },
    [TexturesNames.mountain]: {
        ext: 'ktx2',
        dir: `${texturesDir}/hill/`
    },
    [TexturesNames.skybox]: {
        ext: 'jpg',
        version: 2,
        cubemap: true,
        dir: `${texturesDir}/hill/`
    },
    [TexturesNames.ads]: {
        ext: 'ktx2',
        dir: `${texturesDir}/hill/`
    },
    [TexturesNames.track]: {
        ext: 'ktx2',
        dir: `${texturesDir}/hill/`
    },
    [TexturesNames.lightmapHill]: {
        version: 3,
        ext: 'ktx2',
        dir: `${texturesDir}/hill/`,
        returnTextureLightmap: true
    },
    [TexturesNames.takeoffIdealOpacityGradient]: {
        ext: 'ktx2',
        dir: `${texturesDir}/hill/`,
        returnTextureAlphamap: true
    },
    [TexturesNames.lights]: {
        ext: 'ktx2',
        dir: `${texturesDir}/hill/`
    },
    [TexturesNames.snowParticle]: {
        ext: 'ktx2',
        dir: `${texturesDir}/hill/`
    }
}
