import {
    THREE, type CannonNamedBody, game, errorManager
} from '@powerplay/core-minigames'
import { gameConfig, modelsConfig, playerConfig } from './config'
import { hillCurveCalculator } from './HillCurveCalculator'
import { player } from './Player'
import { HillPartsTypes, ModelsNames } from './types'

/**
 * Trieda pre kopec
 */
export class Hill {
    
    /** Mesh kopca */
    hillMesh!: THREE.Mesh;
    
    /** Fyzicke body kopca */
    private hillBody!: CannonNamedBody;
    
    /** Mesh mostika */
    springBoardMesh!: THREE.Mesh;
    
    /** Fyzicke body mostika */
    private springBoardBody!: CannonNamedBody;
    
    /** Mesh lavicky */
    private benchMesh!: THREE.Mesh;
    
    /**
     * Vytvorenie kopca
     */
    create (startPositionX: number): void {
        
        console.log('VYTVARAM HILL....')
        this.createHillPhysics()
        this.createSpringBoardPhysics(startPositionX)
        console.log('HILL vytvoreny....')
        
        game.physics.setWorldConfig({
            gravitation: gameConfig.gravitation
        })
        
    }
    
    /**
     * get all physical meshes
     *
     * @returns THREE.Mesh[]
     */
    get allPhysicalMeshes (): THREE.Mesh[] {

        return [this.hillMesh, this.springBoardMesh/* , this.benchMesh */]
    
    }
    
    /**
     * get all physical meshes names
     * @returns - string[]
     */
    get allPhysicalMeshNames (): string[] {
        
        return [hill.hillMesh.name, this.springBoardMesh.name]
        
    }

    /**
     * Vytvorenie fyziky kopca
     */
    private createHillPhysics (): void {
        
        const meshHillName = modelsConfig[ModelsNames.hill]?.mainMeshNames?.[HillPartsTypes.hill]
        if (!meshHillName) {

            throw new Error(errorManager.showBox('Mesh name for hill was not defined'))
        
        }
        
        this.hillMesh = game.getMesh(meshHillName)
        this.hillBody = game.physics.addBodyFromMesh(meshHillName, this.hillMesh, 0)
        
        this.hillMesh.visible = false
        
        // hillCurveCalculator.showHalfmeterLines()
        
    }
    
    /**
     * Vytvorenie fyziky mostika
     */
    public createSpringBoardPhysics (startPositionX: number): void {

        const springBoardMeshName = modelsConfig[
            ModelsNames.hill
        ]?.mainMeshNames?.[HillPartsTypes.springBoard]
        if (!springBoardMeshName) {
            
            throw new Error((errorManager.showBox('Mesh name for spring board was not defined')))
            
        }
        
        this.springBoardMesh = game.getMesh(springBoardMeshName)
        this.springBoardBody = game.physics.addBodyFromMesh(
            springBoardMeshName,
            this.springBoardMesh,
            0
        )
        
        this.springBoardMesh.visible = false
        
        hillCurveCalculator.calculateSpringBoardCurve(startPositionX)
        
        // zatial docasne musime schovat jeden mesh
        const mesh = game.getMesh('Physics_JumpBridge_impulse')
        mesh.visible = false
        
    }
    
    /**
     * Nastavenie pozicie lavicke
     */
    setBenchPosition (): void {
        
        this.benchMesh = game.getMesh('SpringBoardBench')
        
        if (this.benchMesh) {
            
            this.benchMesh.position.set(
                player.playerObject.position.x + 0.16,
                player.playerObject.position.y - 0.51 - playerConfig.skierPositionYadjust,
                player.playerObject.position.z
            )
            this.benchMesh.updateMatrix()
            
        }
        
    }

}

export const hill = new Hill()
