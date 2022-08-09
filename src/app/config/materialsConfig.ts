import type { MaterialDataObject } from '@powerplay/core-minigames'
import { MaterialsNames, TexturesNames } from '../types'

/**
 * Konfig pre materialy
 */
export const materialsConfig: MaterialDataObject = {
    [MaterialsNames.skier]: {
        meshesArray: ['body', 'ski_L', 'ski_R', 'body_w', 'ski_L_w', 'ski_R_w'],
        lights: true,
        textureName: TexturesNames.skier,
        normalmap: TexturesNames.skierNormal,
        lightmap: TexturesNames.skierLightmap,
        useLightmapWithLowSettings: true
    },
    [MaterialsNames.hill]: {
        textureName: TexturesNames.hill,
        lightmap: TexturesNames.lightmapHill,
        vertexColors: true,
        isDefault: true
    },
    [MaterialsNames.transparent]: {
        alpha: 0.95,
        textureName: TexturesNames.transparent,
        meshesArray: ['Trees', 'Audience', 'TrackMarks'],
        lightmap: TexturesNames.lightmapHill
    },
    [MaterialsNames.staticPeople]: {
        textureName: TexturesNames.staticPeople,
        meshesArray: ['StaticStaff'],
        lightmap: TexturesNames.lightmapHill
    },
    [MaterialsNames.mountain]: {
        textureName: TexturesNames.mountain,
        meshesArray: ['MountainsBackground'],
        lightmap: TexturesNames.lightmapHill
    },
    [MaterialsNames.ads]: {
        textureName: TexturesNames.ads,
        meshesArray: ['Ads', 'SpringBoardAds'],
        lightmap: TexturesNames.lightmapHill
    },
    [MaterialsNames.track]: {
        textureName: TexturesNames.track,
        meshesArray: ['Terrain', 'TrackMain'],
        lightmap: TexturesNames.lightmapHill,
        vertexColors: true
    },
    [MaterialsNames.idealTakeoffOpacityGradient]: {
        meshesArray: ['JumpIndicator'],
        vertexColors: true,
        alphamap: TexturesNames.takeoffIdealOpacityGradient,
        transparent: true
    },
    [MaterialsNames.lights]: {
        meshesArray: ['Emissive_Mesh'],
        textureName: TexturesNames.lights
    }
}
