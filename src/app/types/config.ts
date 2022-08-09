/** Mena vsetkych modelov, ktore sa pouzivaju v minihre */
export enum ModelsNames {
    skier = 'skier',
    hill = 'hill'
}

/** Mena vsetkych textur, ktore sa pouzivaju v minihre */
export enum TexturesNames {
    skier = 'skier',
    skierBaked = 'skier_baked',
    skierNormal = 'skier_normal',
    hill = 'Atlas',
    transparent = 'TransparentTexture',
    mountain = 'Mountains',
    skybox = 'Skybox',
    ads = 'logo',
    staticPeople = 'StaticPeople',
    track = 'Track',
    lightmapHill = 'LightmapHill',
    takeoffIdealOpacityGradient = 'TakeoffIdealOpacityGradient',
    lights = 'Lights',
    snowParticle = 'snowSSbase',
    skierClothes = 'skier_clothes',
    skierRaceNoRace = 'skier_race_',
    skierLightmap = 'skier_lightmap'
}

/** Mena vsetkych materialov, ktore sa pouzivaju v minihre */
export enum MaterialsNames {
    skier = 'skier',
    hill = 'Atlas1',
    transparent = 'TransparentTexture',
    mountain = 'Mountains',
    ads = 'Ads',
    staticPeople = 'StaticPeople',
    track = 'Track',
    idealTakeoffOpacityGradient = 'IdealTakeoffOpacityGradient',
    lights = 'Lights'
}

/** Mena vsetkych animacii hraca */
export enum PlayerAnimationsNames {
    twoFootedTouch = '2 footed touch',
    twoFooted = '2 footed',
    bad = 'bad',
    happy = 'happy',
    end = 'dojazd',
    fall = 'fall',
    flight = 'let',
    slide = 'najazd',
    takeOff = 'odraz',
    prepare = 'priprava',
    telemarkIdeal = 'telemark ideal',
    telemarkMedium = 'telemark medium',
    telemarkPoor = 'telemark poor',
    telemarkIdealLoop = 'telemark ideal loop',
    telemarkMediumLoop = 'telemark medium loop',
    telemarkPoorLoop = 'telemark poor loop',
    telemarkIdealEnd = 'telemark ideal end',
    telemarkMediumEnd = 'telemark medium end',
    telemarkPoorEnd = 'telemark poor end',
    beforeEmotion = 'before emotion'
}

/** Casti kopca */
export enum HillPartsTypes {
    springBoard = 0,
    hill = 1
}

/** Konfig pre zakladne fyzicke veci */
export interface GameConfig {
    linearDamping: number
    playerMass: number
    frictionHillPlayer: number
    restitutionHillPlayer: number
    frictionEquationRelaxationHillPlayer: number
    frictionEquationStiffnessHillPlayer: number
    contactEquationRelaxationHillPlayer: number
    contactEquationStiffnessHillPlayer: number
}

/**
 * Specialne data z init requestu
 */
export interface SpecialDataFromInit {

    startGate?: number

}

/** Informacie o znamke */
export type MarkInfo = {

    country: string,
    countryString: string,
    points: string

}

/** Typy pre vypocitane data pre jeden skok */
export enum CalculatedDataTypesForOneJump {

    meters = 'meters',
    points = 'points',
    marks = 'marks',
    pointsDistance = 'pointsDistance',
    pointsStyle = 'pointsStyle',
    compensationWind = 'compensationWind',
    descentQuality = 'descentQuality',
    takeoffQuality = 'takeoffQuality',
    flightQuality = 'flightQuality',
    landingQuality = 'landingQuality',
    windValue = 'windValue',
    windDirection = 'windDirection',
    fall = 'fall'

}

/** Informacie vypocitanych dat pre jeden skok */
export type CalculatedDataForOneJump = {

    [CalculatedDataTypesForOneJump.meters]: number,
    [CalculatedDataTypesForOneJump.points]: number,
    [CalculatedDataTypesForOneJump.marks]: number[],
    [CalculatedDataTypesForOneJump.pointsDistance]: number,
    [CalculatedDataTypesForOneJump.pointsStyle]: number,
    [CalculatedDataTypesForOneJump.compensationWind]: number,
    [CalculatedDataTypesForOneJump.descentQuality]: number,
    [CalculatedDataTypesForOneJump.takeoffQuality]: number,
    [CalculatedDataTypesForOneJump.flightQuality]: number,
    [CalculatedDataTypesForOneJump.landingQuality]: number,
    [CalculatedDataTypesForOneJump.windValue]: number,
    [CalculatedDataTypesForOneJump.windDirection]: string,
    [CalculatedDataTypesForOneJump.fall]: boolean

}
