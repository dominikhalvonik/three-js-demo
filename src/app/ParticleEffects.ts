import {
    game, particleManager, ParticleMaterialType, type ParticleOptionsType, THREE,
    displayManager, cameraManager, fpsManager
} from '@powerplay/core-minigames'
import {
    gameMultiplicationScalar,
    snowParticleConfig
} from './config/particleConfig'
import { disciplinePhasesManager } from './phases'
import { player } from './Player'
import {
    DisciplinePhases,
    ParticleNames,
    TexturesNames,
    type ParticleEmitters, type SnowState} from './types'

export class ParticleEffects {

    /** Emittery v hre  */
    private emitters: ParticleEmitters = {}

    /** Ci je aktivny state */
    private isActive = true

    /** SnowStates */
    private snowingStates: SnowState[] = []
    
    /** Zakladny konfig pre emitter */
    private baseConfig!: ParticleOptionsType

    /**
     * Konstruktor
     */
    constructor () {

        this.createSnowParticle()

    }

    /**
     * Metoda na tvorbu partiklov pri kontruktore
     */
    private createSnowParticle (): void {

        this.snowingStates = snowParticleConfig

        const settingsState = this.randomState()
        if (!settingsState.active) {

            this.isActive = false
            return

        }
        const texture: THREE.Texture = game.getTexture(TexturesNames.snowParticle)
        this.baseConfig = {
            emitRate: 1,
            particleLife: 200,
            blending: THREE.NormalBlending,
            name: ParticleNames.whiteSnow,
            basePosition: new THREE.Vector3(0, 0, 0),
            particleSpan: new THREE.Vector3(50, 50, 50),
            scale: [0.1, 0.2],
            mass: 0.01,
            alpha: [0.5, 1.0],
            gravitation: true,
            randomPower: this.randomizedRandomDrift(),
            randomDrift: true,
            materialType: ParticleMaterialType.shader,
            velocity: new THREE.Vector3(0, -4, 0),
            vertexColors: false,
            // rotation: [-0.3, 0.3],
            offset: [2, 2],
            repeat: [2, 2],
            texture,
            particleAmountPerEmit: settingsState.particleAmountPerEmit,
            scene: game.scene,
            fpsLimit: fpsManager.fpsLimit,
            width: displayManager.width,
            height: displayManager.height
        }
        
        particleManager.createEmitter(this.baseConfig)
        this.createEmittersCache()

    }

    /**
     * Nahodny vyber stavu
     * @returns
     */
    private randomState (): SnowState {

        const r1 = Math.random()
        const isSnowing = r1 >= 0.4
        let idx = 0
        if (isSnowing) {
            
            const r2 = Math.random()
            idx = 1 + Math.floor(r2 * 3)
            
        }
        console.log('random snow state? ', idx)
        return this.snowingStates[idx]

    }

    /**
     * Taky ten random drift
     * @returns - random drift
     */
    private randomizedRandomDrift (): number[] {

        if (Math.random() >= 0.5) {

            return [-0.1, -0.2]
        
        } else {

            return [0.1, 0.2]
        
        }
    
    }

    /**
     * Metoda na cacheovanie partiklov
     */
    private createEmittersCache (): void {

        const snowEmitter = particleManager.getEmitter(ParticleNames.whiteSnow)
        this.emitters = {
            [ParticleNames.whiteSnow]: snowEmitter
        }

    }

    /**
     * Metoda na padanie snehu
     */
    private makeSnowFall (): void {

        const emitter = this.emitters[ParticleNames.whiteSnow]
        const position = cameraManager.getMainCamera().clone().position
        if ([
            DisciplinePhases.flight,
            DisciplinePhases.landing,
            DisciplinePhases.takeoff,
            DisciplinePhases.descent
        ]
            .includes(disciplinePhasesManager.actualPhase)) {

            const diff = player.playerObject.clone().position.sub(position)
            position.add(diff.multiplyScalar(gameMultiplicationScalar))
        
        }
        const defaultParticleSpan = particleManager.getDefaultParticleSettings().particleSpan ??
        new THREE.Vector3()
        position.y -= ((this.baseConfig.particleSpan?.y ?? defaultParticleSpan.y) / 2)
        position.z -= ((this.baseConfig.particleSpan?.z ?? defaultParticleSpan.z) / 2)
        position.x -= ((this.baseConfig.particleSpan?.x ?? defaultParticleSpan.x) / 2)
        emitter?.setPosition(position)

    }

    /**
     * Update metoda
     */
    public update (): void {

        if (!this.isActive) return
        this.makeSnowFall()

    }

}
