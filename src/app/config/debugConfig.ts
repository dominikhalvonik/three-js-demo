import type { DebugConfig } from '@powerplay/core-minigames'

/**
 * Konfig pre debug nastavenia
 */
export const debugConfig: DebugConfig = {

    /** Shows debug box around physics objects */
    physicsDebug: false,

    /** Enables manual frame progression */
    stepByStep: false,

    /** Enables debug orbital camera */
    debugCamera: false,

    /** Determines if physics should be disabled */
    physicsDisabled: false,

    /** Shows Wireframe around meshes  */
    showWireframeMesh: false,

    /** Zobrazenie statistik o fps */
    showStatsInfo: false,

    /** Zobrazenie renderovacich veci */
    showRendererInfo: false

}
