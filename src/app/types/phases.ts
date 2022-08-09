/** Fazovy manager */
export interface DisciplinePhaseManager {
    
    preparePhase(): void;
    startPhase(): void;
    finishPhase(): void;
    update(): void;
    reset(): void
    
}

/** Disciplinove fazy */
export enum DisciplinePhases {
    
    start = 0,
    descent = 1,
    takeoff = 2,
    flight = 3,
    landing = 4,
    postLanding = 5,
    end = 6
    
}
