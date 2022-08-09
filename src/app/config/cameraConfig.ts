import { CameraStates, THREE } from '@powerplay/core-minigames'
import { END_OF_SPRING_BOARD_POSITION } from './gameConfig'

const playerPositionStartTemp = new THREE.Vector3(-2379.1850586, 577.9439697, -556.4869995)

/**
 * Konfig pre kameru pre vsetky stavy
 */
export const cameraConfig = {
    
    /** Nastavenie pozicii a pohybov kamery pre vsetky stavy */
    tweenSettingsForCameraStates: {
        [CameraStates.intro]: [
            {
                startPosition: new THREE.Vector3(-2792.645, 590.994, -852.869),
                endPosition: new THREE.Vector3(-2894.065, 546.344, -681.369),
                startRotation: new THREE.Vector3(1.890145, -0.002187, 2.52864),
                endRotation: new THREE.Vector3(1.6308836, -0.13769, 1.983218),
                duration: 5,
                fov: 55.8
            },
            {
                startPosition: new THREE.Vector3(-2603.945, 514.084, -569.46),
                endPosition: new THREE.Vector3(-2611.695, 481.214, -525.06),
                startRotation: new THREE.Vector3(1.517686, 0.2128, 1.817467),
                endRotation: new THREE.Vector3(1.6578, 0.43881, 1.3683),
                duration: 3,
                fov: 55.8
            }
        ],
        [CameraStates.table]: {
            startPosition: new THREE.Vector3(
                END_OF_SPRING_BOARD_POSITION.x - 134 + 50,
                END_OF_SPRING_BOARD_POSITION.y - 155 + 100,
                END_OF_SPRING_BOARD_POSITION.z - 0.65
            ),
            startLookAt: new THREE.Vector3(
                END_OF_SPRING_BOARD_POSITION.x - 184 + 50,
                END_OF_SPRING_BOARD_POSITION.y - 170 + 100,
                END_OF_SPRING_BOARD_POSITION.z + 2.65
            ),
            endPosition: new THREE.Vector3(
                END_OF_SPRING_BOARD_POSITION.x - 134 + 50,
                END_OF_SPRING_BOARD_POSITION.y - 155 + 100,
                END_OF_SPRING_BOARD_POSITION.z + 4.65
            ),
            duration: 5
        },
        [CameraStates.disciplineIntro]: [
            {
                startPosition: new THREE.Vector3(
                    -2399.235 - playerPositionStartTemp.x,
                    576.294 - playerPositionStartTemp.y,
                    -550.886 - playerPositionStartTemp.z
                ),
                endPosition: new THREE.Vector3(
                    -2388.615 - playerPositionStartTemp.x,
                    578.004 - playerPositionStartTemp.y,
                    -554.462 - playerPositionStartTemp.z
                ),
                startRotation: new THREE.Vector3(1.81227, 0.063249, 1.26567),
                endRotation: new THREE.Vector3(1.5808, 0.04629, 1.3584),
                duration: 3,
                fov: 67.4
            },
            {
                startPosition: new THREE.Vector3(
                    -2376.855 - playerPositionStartTemp.x,
                    580.104 - playerPositionStartTemp.y,
                    -555.6 - playerPositionStartTemp.z
                ),
                endPosition: new THREE.Vector3(
                    -2376.745 - playerPositionStartTemp.x,
                    580.104 - playerPositionStartTemp.y,
                    -557.322 - playerPositionStartTemp.z
                ),
                startRotation: new THREE.Vector3(1.403469, 0.43978, -1.193096),
                endRotation: new THREE.Vector3(1.728917, 0.43736, -1.9308),
                duration: 3,
                fov: 73.7
            }
        ],
        [CameraStates.discipline]: undefined,
        [CameraStates.disciplineOutro]: {
            startPosition: new THREE.Vector3(-3, 1.5, -2),
            endPosition: new THREE.Vector3(-3, 1.5, 2),
            duration: 7,
            offsetCamera: true
        },
        [CameraStates.static]: undefined
    },
    distanceFromGround: 1.5
    
}
