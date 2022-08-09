import store from '@/store'
import {
    THREE,
    AnimationsManager,
    CANNON,
    type CannonNamedBody,
    game,
    CallbackAnimationTypes,
    audioManager,
    errorManager,
    cameraManager,
    fpsManager,
    CameraStates,
    modes,
    trainingManager
} from '@powerplay/core-minigames'
import {
    modelsConfig, gameConfig, animationsConfig, landingConfig, END_OF_SPRING_BOARD_POSITION,
    flightConfig, cameraConfig, playerConfig
} from './config'
import { hill } from './Hill'
import {
    ModelsNames, PlayerAnimationsNames, DisciplinePhases
} from './types'
import { endCalculationsManager } from './EndCalculationsManager'
import { disciplinePhasesManager } from './phases/DisciplinePhasesManager'
import { AudioNames } from './types/audio'
import { startGateManager } from './StartGateManager'

/**
 * Trieda pre hraca
 */
export class Player {
    
    /** 3D objekt lyziara - cela scena */
    playerObject: THREE.Object3D = new THREE.Object3D();
    
    /** Manager pre animacie */
    animationsManager!: AnimationsManager;
    
    /** Fyzicke body pre objekt */
    physicsBody!: CannonNamedBody;
    
    /** Raycaster pre natocenie lyziara */
    private raycaster: THREE.Raycaster = new THREE.Raycaster();
    
    /** Pomocny vektor */
    private tempVector: THREE.Vector3 = new THREE.Vector3();
    
    /** 3D objekt, v ktorom sa nachadza kamera a ktoremu sa meni pozicia lerpom postupne */
    private goalObject: THREE.Object3D = new THREE.Object3D();
    
    /** Pomocny vektor na lerp na otacanie hraca voci svahu */
    private rotateLerp: THREE.Vector3 = new THREE.Vector3();
    
    /** Pomocny vektor na lerp na otacanie hraca voci svahu */
    private rotateLerpTo: THREE.Vector3 = new THREE.Vector3(-99, -99, -99);
    
    /** Pomocny vektor na lerp na normalu svahu */
    private normalLerp: THREE.Vector3 = new THREE.Vector3();
    
    /** Pomocny vektor na lerp na normalu svahu */
    private normalLerpTo: THREE.Vector3 = new THREE.Vector3();

    /** Pomocny objekt na vypocty */
    private empObject: THREE.Object3D = new THREE.Object3D();
    
    /** vektor pre natocenie lyziara pre konecny pohyb */
    staticRotateTo: THREE.Vector3 | undefined;
    
    /** Vzdialenost od priesecnika povrchu */
    intersectionDistance = 0;

    /** Normala priesecnika s povrchom */
    intersectionNormal = new THREE.Vector3()
    
    /** Bod priesecnika */
    intersectionPoint = new THREE.Vector3();
    
    /** Animacia pristatia */
    landingAnimation!: PlayerAnimationsNames;
    
    // touchDown = false;
    
    /** Material na spravanie sa players */
    private playerPhysicsMaterial: CANNON.Material = new CANNON.Material('Player');
    
    /** deafult animation speed */
    private readonly DEAFULT_ANIMATION_SPEED = 1 / 2
    
    /** callback pri kolizii */
    private collisionEndCallback!: () => unknown;
    
    /** Pozicia startu hraca podla min a max hodnoty */
    private startPositionX = 0;
    
    /** Ci uz bol zrotovany hrac v startovej faze */
    private rotatedInStartPhase = false;
    
    /** Pocet frameov vo faze - kvoli necakanemu rotovaniu hraca */
    private framesInPhase = 0;
    
    /** Limit poctu frameov pre freeznutie rotacie */
    private readonly FRAMES_IN_PHASE_LIMIT = 10;
    
    /** rychlost pohybu po krivke v landing a post landing faze */
    public speedStep = 0
    
    /** stara player position pred resetom */
    private oldPlayerPos?: THREE.Vector3
    
    /**
     * Nastavenie startovacej pozicie
     * @returns Startovacia pozicia
     */
    setUpStartPositionX (): number {
        
        const { startXMin, startXMax } = gameConfig
        const startPercent = startGateManager.startPercent
        
        // raycast z 0 dohora na x medzi min a max podla %
        this.startPositionX = startXMin + (((startXMax - startXMin) / 100) * startPercent)
        
        return this.startPositionX
        
    }
    
    /**
     * Vytvorenie lyziara
     * @param game - Instancia hlavnej triedy pre 3D
     */
    create (
        position = this.calculateStart()
    ): void {
        
        console.log('vytvaram hraca...')
        
        const meshSkierName = modelsConfig[
            ModelsNames.skier
        ]?.mainMeshNames?.[0]
        if (!meshSkierName) {
            
            throw new Error(errorManager.showBox('Mesh name for skier was not defined'))
            
        }
        
        this.playerObject = game.getObject3D(meshSkierName)
        
        game.scene.add(this.playerObject)
        
        // animacie
        this.animationsManager = new AnimationsManager(
            this.playerObject,
            animationsConfig,
            game.animations.get(ModelsNames.skier),
            gameConfig.defaultAnimationSpeed,
            fpsManager
        )
        this.animationsManager.setDefaultSpeed(gameConfig.defaultAnimationSpeed)
        this.animationsManager.resetSpeed()
        
        this.goalObject.position.set(position.x, position.y, position.z + 2)
        
        // threeJS Section
        this.playerObject.position.set(position.x, position.y, position.z)
        this.playerObject.rotation.set(0, 0, 0)
        
        this.playerObject.name = 'Player'

        // CannonJS Section
        this.createAndSetPhysicsBody(position)
        
        this.setupAttributesGD()
        
        // tiene
        game.shadowsManager.attachPlaneToObject(this.playerObject)
        
        console.log('hrac vytvoreny...')
        
    }
    
    /**
     * Vytvorenie a nastavenie fyzickych veci
     * @param position - Pozicia lyziara
     */
    private createAndSetPhysicsBody (position: THREE.Vector3): void {
        
        const shape = new CANNON.Sphere(0.9)
        this.physicsBody = new CANNON.Body({
            mass: gameConfig.playerMass,
            shape,
            material: this.playerPhysicsMaterial
        }) as CannonNamedBody
        this.physicsBody.name = this.playerObject.name
        this.physicsBody.type = CANNON.BODY_TYPES.STATIC
        this.physicsBody.position.set(
            position.x,
            position.y,
            position.z
        )
        this.physicsBody.quaternion.set(
            this.playerObject.quaternion.x,
            this.playerObject.quaternion.y,
            this.playerObject.quaternion.z,
            this.playerObject.quaternion.w
        )
        // // toto zabezpecuje, ze sa predmet nekotula
        this.physicsBody.angularFactor = new CANNON.Vec3(0, 0, 0)
        game.physics.addBody(this.physicsBody)
        console.log('TOTO JE FYZIKA', game.physics)
        
        this.setupCollision()
        
    }
    
    /**
     * Nastavenie spravania pri kolizii hraca s inymi objektami
     */
    private setupCollision = (): void => {
        
        // TODO ak toto bude odkomentovane, treba poriesit v resete
        /* this.physicsBody.addEventListener('collide', (e: CollisionEvent) => {

            const meshHillName = `${modelsConfig[ModelsNames.hill]?.mainMeshName}-container`
            if (!modelsConfig[ModelsNames.hill]?.mainMeshName) {
                
                throw new Error('Mesh name for hill was not defined')
                
            }
        
        }) */
    
    }
    
    /**
     * Vratenie rotacie lyziara
     * @returns Quaternion lyziara
     */
    getQuaternion (): THREE.Quaternion {
        
        return this.playerObject.quaternion
            
    }
    
    /**
     * Aktualizovanie veci podla konfigu od GD
     */
    private setupAttributesGD (): void {

        modelsConfig[ModelsNames.hill].mainMeshNames?.forEach(
            name => this.setupAttributesGDForMesh(name)
        )

        console.warn('configObj', gameConfig)

        this.physicsBody.linearDamping = gameConfig.linearDamping
        
    }
    
    /**
     * Aktualizovanie veci podla konfigu od GD - na konkretny mesh
     * @param meshName - index nazvov meshov
     */
    private setupAttributesGDForMesh (meshName: string): void {
        
        console.log(`GD for mesh name ${meshName}`)
        const hillPhysicsMaterial = game.physics.getPhysicsWorld.bodies
            .filter((body: CannonNamedBody) => body.name === meshName)[0].material
        
        if (!hillPhysicsMaterial) {

            throw new Error(errorManager.showBox(`No ${meshName} material`))
        
        }
        
        const contactMaterial = new CANNON.ContactMaterial(
            hillPhysicsMaterial,
            this.playerPhysicsMaterial,
            {
                restitution: gameConfig.restitutionPlayer[meshName],
                friction: gameConfig.frictionPlayer[meshName],
                frictionEquationRelaxation: gameConfig.frictionEquationRelaxationPlayer[meshName],
                frictionEquationStiffness: gameConfig.frictionEquationStiffnessPlayer[meshName],
                contactEquationRelaxation: gameConfig.contactEquationRelaxationPlayer[meshName],
                contactEquationStiffness: gameConfig.contactEquationStiffnessPlayer[meshName]
            }
        )
        game.physics.getPhysicsWorld.addContactMaterial(contactMaterial)
        
    }
    
    /**
     * Aktualizovanie pozicie a rotacie meshu lyziara
     */
    public updatePlayerMeshPosition (): void {
        
        const { position } = this.physicsBody
        
        this.playerObject.position.set(
            position.x,
            position.y + playerConfig.skierPositionYadjust,
            position.z
        )

    }
    
    /**
     * zmena pozicie a rotacie tiena
     */
    private changeShadow (): void {
        
        // ked mame shadow plane detachnuty od hraca, tak musime menit tien inak
        if (!game.shadowsManager.planeAttachedToMesh) {
            
            const tempObject = new THREE.Object3D()
            tempObject.lookAt(this.intersectionNormal)
            
            game.shadowsManager.plane.position.set(
                this.intersectionPoint.x,
                this.intersectionPoint.y + 0.1,
                this.intersectionPoint.z
            )
            game.shadowsManager.plane.rotation.set(
                tempObject.rotation.x,
                tempObject.rotation.y,
                tempObject.rotation.z
            )
            game.shadowsManager.plane.rotateX(Math.PI / 2)
            game.shadowsManager.plane.updateMatrix()
        
        } else {
            
            game.shadowsManager.adjustPositionY(
                -this.intersectionDistance +
                gameConfig.coefAdjustPlayerShadowPosition
            )
        
        }
        
    }
    
    /**
     * Vratenie pozicie lyziara
     * @returns Pozicia lyziara
     */
    getPosition (): THREE.Vector3 {
        
        return this.playerObject.position
        
    }
    
    /**
     * Vypocitanie priesecnika s povrchom
     */
    calculateIntersectionWithGround (): void {
        
        // reset hodnot
        this.intersectionDistance = 0
        this.intersectionNormal.set(0, 0, 0)
        this.intersectionPoint.set(0, 0, 0)
        
        // Vzdialenost davame 100m, aby sme urcite pretali zem
        const distance = 100
        
        this.tempVector.set(
            this.playerObject.position.x,
            this.playerObject.position.y + distance,
            this.playerObject.position.z
        )
        
        this.raycaster.set(this.tempVector, new THREE.Vector3(0, -1, 0))
        
        const intersects = this.raycaster.intersectObjects(hill.allPhysicalMeshes)

        // Ak existuje prvy priesecnik, tak mame vzdialenost
        if (intersects?.[0]?.distance) {
            
            const intersectsDistance = intersects?.[0]?.distance
            this.intersectionDistance = intersectsDistance - distance
            
        }
        
        // Ak existuje prvy priesecnik, tak mame normalu pre natacanie
        if (intersects?.[0]?.face?.normal) {
            
            this.intersectionNormal = intersects?.[0]?.face?.normal
            
        }
        
        // bod prieniku
        if (intersects?.[0]?.point) {
            
            this.intersectionPoint.copy(intersects?.[0]?.point)
            
        }
        
    }
    
    /**
     * Aktualizovanie hraca pred vykonanim fyziky
     */
    updateBeforePhysics (): void {
        
        // nic
        
    }
    
    /**
     * Aktualizovanie hraca po vykonani fyziky
     */
    updateAfterPhysics (): void {
        
        this.updatePlayerMeshPosition()
        this.rotatePlayer()
        this.changeShadow()
        
        store.commit('VelocityState/SET_STATE', {
            velocityX: player.physicsBody.velocity.x,
            velocityY: player.physicsBody.velocity.y,
            velocityZ: player.physicsBody.velocity.z
        })
        
    }
    
    /**
     * Rotovanie hraca podla faz
     */
    private rotatePlayer (): void {
        
        // pri leteckej faze zachovavame uhol
        if (disciplinePhasesManager.phaseIsInActualPhases(DisciplinePhases.flight)) {
            
            // v leteckej faze musime resetovat, aby sme v landing faze nemali artefakty v rotacii
            this.framesInPhase = 0
            this.rotatePlayerDuringFlight()
            return
            
        }
        
        // pri post landingu zase davame rotaciu podla statickeho bodu
        // if (disciplinePhasesManager.phaseIsInActualPhases(DisciplinePhases.postLanding)) {
            
        //     this.staticRotatePlayer()
        //     return
            
        // }
        
        if (disciplinePhasesManager.phaseIsInActualPhases(DisciplinePhases.start)) {
            
            if (this.rotatedInStartPhase) return
            
            // musime iba raz spravne zrotovat
            this.rotatePlayerToSurface(true)
            this.rotatedInStartPhase = true
            
            // v startovej faze musime resetovat, aby sme v descent faze nemali artefakty v rotacii
            this.framesInPhase = 0
            
            return
            
        }
        
        // small hack - prvych far frameov v descent a landing faze sa sprava divne :D
        this.framesInPhase++
        if (this.framesInPhase > this.FRAMES_IN_PHASE_LIMIT) {
            
            this.rotatePlayerToSurface(this.framesInPhase === this.FRAMES_IN_PHASE_LIMIT + 1)
            
        }
            
    }
    
    /**
     * Rotovanie hraca na povrch podla priesecnika
     * @param fastLerp - True, ak chceme dat rychly lerp
     */
    private rotatePlayerToSurface (fastLerp: boolean): void {
        
        // lerpujeme normaly kopca
        this.normalLerpTo.set(
            this.intersectionNormal.x,
            this.intersectionNormal.y,
            this.intersectionNormal.z
        )
        this.normalLerp.lerp(this.normalLerpTo, fastLerp ? 1 : gameConfig.hillNormalLerpCoef)
        
        // musime nastavit up vektor, aby sa spravne rotovalo
        this.playerObject.up.set(
            this.normalLerp.x,
            this.normalLerp.y,
            this.normalLerp.z
        )
        
        // ku kopii velocity pridame poziciu hraca, aby sme mali spravny bod na lookAt
        this.rotateLerpTo.set(0, 0, 0)
        this.rotateLerpTo.add(this.playerObject.position)
        
        // spravime lerp podla nastaveneho kroku
        this.rotateLerp.lerp(this.rotateLerpTo, fastLerp ? 1 : gameConfig.playerRotationLerpCoef)
        
        // na konci sa pozrieme na objekt pred nami, aby sme boli spravne narotovany podla velocity
        this.playerObject.lookAt(this.rotateLerp)
        
        // este musime zrotovat podla Y, aby hrac sedel (niekedy ale treba dat zvlastne narotovanie)
        this.playerObject.rotateY(fastLerp ? -Math.PI / 2 : Math.PI)
        
    }

    /**
     * Staticke narotovanie hraca
     */
    private staticRotatePlayer (): void {
        
        if (!this.staticRotateTo) return
        
        this.playerObject.lookAt(this.staticRotateTo)
        this.staticRotateTo = undefined
        
    }
    
    /**
     * rotujeme hraca pocas leteckej fazy
     */
    private rotatePlayerDuringFlight (): void{
        
        if (flightConfig.oldFlightRotation) {

            this.playerObject.rotation.set(0, -Math.PI / 2, 0)
            this.playerObject.rotateX(flightConfig.rotationDuringFlight)
        
        } else {

            this.rotatePlayerToSurface(false)
        
        }
    
    }
    
    /**
     * Aktualizovanie animacii hraca
     * @param delta - Delta
     */
    updateAnimations (delta: number): void {
        
        this.animationsManager.update(delta)
        
    }

    /**
     * Setter
     * @param phasesManager - phasesManager
     */
    setCollisionEndCallback (collisionEndCallback: () => unknown): Player {

        this.collisionEndCallback = collisionEndCallback
        return this
    
    }
    
    /**
     * Vypocita vektor na poziciu startu
     * @returns pozicia startu
     */
    calculateStart (): THREE.Vector3 {

        const raycaster = new THREE.Raycaster(
            new THREE.Vector3(this.startPositionX, 0, END_OF_SPRING_BOARD_POSITION.z),
            new THREE.Vector3(0, 1, 0)
        )
        
        // kde sa pretne raycast s mostikom
        const intersects = raycaster.intersectObject(hill.springBoardMesh)
        
        const intersectsDistance = intersects?.[0]?.distance ?? 170.89
        console.warn(intersects?.[0]?.distance)
        
        return new THREE.Vector3(
            this.startPositionX,
            intersectsDistance + 0.8,
            END_OF_SPRING_BOARD_POSITION.z
        )
        
    }
    
    /**
     * start spustenia po mostiku
     */
    startDescend (): void {

        this.animationsManager.crossfadeTo(PlayerAnimationsNames.slide, 0.3, true, false)
    
    }
    
    /**
     * puts skier on surface
     */
    putPlayerOnSurface (): void {
        
        if (this.intersectionPoint) {
            
            player.physicsBody.position.y = this.intersectionPoint.y + 1
            
        }
        
    }
    
    /**
     * odraz z mostika
     */
    takeoff (animationSpeed: number): void {
        
        this.animationsManager.addAnimationCallback(
            PlayerAnimationsNames.takeOff,
            CallbackAnimationTypes.end,
            () => {
                
                this.animationsManager.crossfadeTo(PlayerAnimationsNames.flight, 0.3, true, false)
                this.animationsManager.removeAnimationCallback(
                    PlayerAnimationsNames.takeOff,
                    CallbackAnimationTypes.end
                )
                
                // reseting speed
                player.animationsManager.resetSpeed()
            
            }
        )

        player.animationsManager.setSpeed(animationSpeed)
        this.animationsManager.changeTo(PlayerAnimationsNames.takeOff)
        audioManager.stopAudioByName(AudioNames.rampLoop)
        audioManager.play(AudioNames.takeoff)
        
    }
    
    /**
     * Vratenie animacie pristatia podla kvality
     * @param quality - kvalita
     * @returns Animacia pristatia
     */
    private getLandingAnimation (quality: number): PlayerAnimationsNames {
        
        let animation = PlayerAnimationsNames.twoFootedTouch
        
        if (quality >= landingConfig.telemarkMinQualityIdeal) {
            
            animation = PlayerAnimationsNames.telemarkIdeal
            
        } else if (quality >= landingConfig.telemarkMinQualityMedium) {
            
            animation = PlayerAnimationsNames.telemarkMedium
            
        } else if (quality >= landingConfig.telemarkMinQualityPoor) {
            
            animation = PlayerAnimationsNames.telemarkPoor
            
        } else if (quality >= landingConfig.minQualityTwoFooted) {
            
            animation = PlayerAnimationsNames.twoFooted
            
        }
        
        return animation
        
    }
    
    /**
     * animacia landing akcie
     * @param quality - landing quality
     * @param callback - callback pri skonceni animacie pristatia
     */
    landingAction (quality: number, callback: () => unknown): void {
        
        this.landingAnimation = this.getLandingAnimation(quality)
        
        this.animationsManager.addAnimationCallback(
            this.landingAnimation,
            CallbackAnimationTypes.end,
            () => {
                
                console.log('landing animation finished!')
                
                this.animationsManager.removeAnimationCallback(
                    this.landingAnimation,
                    CallbackAnimationTypes.end
                )
                
                this.loopAfterLandingAction(this.landingAnimation)
                callback()
            
            }
        )
        
        console.log('landing animation starting!')
        this.animationsManager.changeTo(this.landingAnimation)
        
    }
    
    /**
     * spustime loop po telemark animacii, skoncime ak nebol telemark
     */
    loopAfterLandingAction (landingAnimation: PlayerAnimationsNames): void {
        
        console.log('loopAfterLandingAction runs!')
        
        let animationLoop!: PlayerAnimationsNames
        
        if (landingAnimation === PlayerAnimationsNames.telemarkIdeal) {

            animationLoop = PlayerAnimationsNames.telemarkIdealLoop
        
        } else if (landingAnimation === PlayerAnimationsNames.telemarkMedium) {
            
            animationLoop = PlayerAnimationsNames.telemarkMediumLoop
            
        } else if (landingAnimation === PlayerAnimationsNames.telemarkPoor) {
            
            animationLoop = PlayerAnimationsNames.telemarkPoorLoop
            
        }
        
        if (!animationLoop) return
        
        console.log('cross fading to loop:', animationLoop)
        this.animationsManager.crossfadeTo(
            animationLoop,
            0.1,
            true,
            false
        )
        
    }
    
    /**
     * prechod z loopovanej animacie
     */
    afterLoopAction (quality: number, callback: () => unknown): void {
        
        const wasTelemark = quality >= landingConfig.telemarkMinQualityPoor
        
        if (!wasTelemark) {

            console.log('was not telemark, calling callback')
            callback()
            return
        
        }
        
        this.animationsManager.addAnimationCallback(
            PlayerAnimationsNames.beforeEmotion,
            CallbackAnimationTypes.crossfade,
            () => {
                
                console.log('beforeEmotion animation finished!')
                
                this.animationsManager.removeAnimationCallback(
                    PlayerAnimationsNames.beforeEmotion,
                    CallbackAnimationTypes.crossfade
                )
                
                callback()
            
            }
        )
        
        console.log('cross fading to before animation')
        this.animationsManager.crossfadeTo(
            PlayerAnimationsNames.beforeEmotion,
            0.5,
            true,
            false
        )
        
    }
    
    /**
     * foul animation
     */
    landingFoul (callback: () => unknown): void {
        
        this.animationsManager.addAnimationCallback(
            PlayerAnimationsNames.fall,
            CallbackAnimationTypes.end,
            () => {
                
                console.log('foul animation finished!')
                
                this.animationsManager.removeAnimationCallback(
                    PlayerAnimationsNames.fall,
                    CallbackAnimationTypes.end
                )
                
                callback()
            
            }
        )
        
        this.animationsManager.setSpeed(0.8)
        this.animationsManager.changeTo(PlayerAnimationsNames.fall)
        
    }
    
    /**
     * player end animation
     */
    playEndAnimation (resetSpeed: boolean): void {

        player.animationsManager.addAnimationCallback(
            PlayerAnimationsNames.end,
            CallbackAnimationTypes.end,
            () => {
                
                player.animationsManager.removeAnimationCallback(
                    PlayerAnimationsNames.end,
                    CallbackAnimationTypes.end
                )
                
                if (resetSpeed) player.animationsManager.resetSpeed()
            
            }
            
        )
        
        // docasne vypiname end animaciu
        player.animationsManager.changeTo(PlayerAnimationsNames.end)
        
    }
    
    /**
     * Player emotion animation
     */
    playEmotionAnimation (
        emotionAnimation: PlayerAnimationsNames,
        callback: () => unknown
    ): void {
        
        if (!endCalculationsManager.getActualCalculatedData().fall) {
            
            this.animationsManager.addAnimationCallback(
                emotionAnimation,
                CallbackAnimationTypes.end,
                () => {

                    console.log('emotion animation finished!')
                    
                    callback()
                    
                    this.animationsManager.removeAnimationCallback(
                        emotionAnimation,
                        CallbackAnimationTypes.end
                    )
                    
                }
            )
        
            console.log('playing emotion!')
            this.animationsManager.changeTo(emotionAnimation)
        
        } else {

            callback()

            // pri foule nemame ziadnu animaciu
            
        }
    
    }
    
    /**
     * changes config of camera
     *
     * @param idealOffset - ako daleko od hraca ma byt kamera
     * @param idealLookAt - ako daleko od hraca ma byt bod na ktory sa kamera pozera
     * @param coefSize - ako rychlo ma kamera nasledovat hraca
     * @param changeLerp - velkost lerpu pouziteho pri zmene kamery
     */
    changeCameraSettings (
        idealOffset?: THREE.Vector3,
        idealLookAt?: THREE.Vector3,
        coefSize?: number,
        changeLerp?: number
    ): void {
    
        cameraManager.changeIdeals(
            idealOffset,
            idealLookAt,
            coefSize,
            changeLerp
        )
        
    }
    
    /**
     * ziskame emociu ktora sa ma zahrat
     * @returns nazov emocie alebo undefined pre ziadnu/neutralnu emociu
     */
    public getEmotionAnimation (): PlayerAnimationsNames | undefined {
        
        if (modes.isTrainingMode()) return this.getTrainingEmotionAnimation()
        return this.getArenaEmotionAnimation()
        
    }

    /**
     * animacia pre trening
     * @returns animacia
     */
    private getTrainingEmotionAnimation (): PlayerAnimationsNames | undefined {

        const tasks = trainingManager.getTrainingTasks()
        const sum = tasks.reduce((prev, current) => prev + current.value, 0)
        const average = sum / tasks.length
        
        let emotion: PlayerAnimationsNames | undefined
        
        // ak menej ako 2 hviezdy
        if (average < 0.75) emotion = PlayerAnimationsNames.bad
        
        // ak 3 hviezdy
        if (average > 0.9) emotion = PlayerAnimationsNames.happy

        return emotion

    }

    /**
     * ziskame emociu
     */
    private getArenaEmotionAnimation (): PlayerAnimationsNames | undefined {
        
        let emotion: PlayerAnimationsNames | undefined

        if (
            endCalculationsManager.isOverHillSize ||
            endCalculationsManager.isPersonalRecord ||
            endCalculationsManager.isTop3
        ) {

            emotion = PlayerAnimationsNames.happy

        } else if (
            endCalculationsManager.isBottom30 ||
            endCalculationsManager.isTouchedSnow
        ) {

            emotion = PlayerAnimationsNames.bad

        }
        
        return emotion
    
    }
    
    /**
     * vypocitame startovaciu poziciu na osi X a takisto najazdove okno
     * @returns startovacia pozicia
     */
    public recalculateStartingPosition (): number {
        
        startGateManager.setUp()
        return player.setUpStartPositionX()
    
    }
    
    /**
     * Aktualizovanie kamera konfigu na zaciatku este
     */
    public updateCameraConfigOnStart (): void {

        const playerPosition = player.getPosition().clone()

        const cameraData = cameraConfig.tweenSettingsForCameraStates[CameraStates.disciplineIntro]

        // po resete chceme resetnut nastavenia na povodne
        if (this.oldPlayerPos) {
            
            cameraData.forEach((data) => {

                data.startPosition.sub(this.oldPlayerPos as THREE.Vector3)
                data.endPosition.sub(this.oldPlayerPos as THREE.Vector3)

            })
        
        }
        this.oldPlayerPos = playerPosition.clone()
        
        cameraData.forEach((data) => {

            data.startPosition.add(playerPosition)
            data.endPosition.add(playerPosition)

        })

    }
    
    /**
     * reset
     */
    reset (): void {
        
        const position = this.calculateStart()
        
        this.goalObject.position.set(position.x, position.y, position.z + 2)
        
        // threeJS Section
        game.physics.remove(this.physicsBody)
        this.createAndSetPhysicsBody(position)
        
        this.intersectionDistance = 0
        this.intersectionNormal.set(0, 0, 0)
        this.intersectionPoint.set(0, 0, 0)
        
        this.rotateLerp.set(0, 0, 0)
        this.rotateLerpTo.set(0, 0, 0)
        this.staticRotateTo = undefined
        
        this.updatePlayerMeshPosition()
        this.animationsManager.resetAll()
        
        this.rotatedInStartPhase = false
        this.framesInPhase = 0
        
    }

}

export const player = new Player()
