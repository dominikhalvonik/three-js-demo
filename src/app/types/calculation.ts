import { THREE } from '@powerplay/core-minigames'

/** typ pre ziskani udajov z raycastu */
export type HeightIntersectData = {
    y: number
    intersectionNormal: THREE.Vector3
    intersectionPoint: THREE.Vector3
}
