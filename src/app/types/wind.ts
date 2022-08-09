/** smery vetra */
export enum WindDirection {
    
    'N' = 0,
    'NE' = 1,
    'E' = 2,
    'SE' = 3,
    'S' = 4,
    'SW' = 5,
    'W' = 6,
    'NW' = 7,
    
}

/** rychlost a smer vetra */
export type WindValue = {
    speed: number,
    direction: WindDirection
}
