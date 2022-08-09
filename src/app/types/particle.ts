import { ParticleEmitter } from '@powerplay/core-minigames'

export enum ParticleNames {
    whiteSnow = 'bielySneh'
}

export interface SnowState {
    active: boolean,
    particleAmountPerEmit: number
}

export type ParticleEmitters = Partial<Record<ParticleNames, ParticleEmitter>>
