import type { AnimationsSettingRepository } from '@powerplay/core-minigames'
import { PlayerAnimationsNames } from '../types'
/**
 * Konfig pre animacie
 */
export const animationsConfig: AnimationsSettingRepository = {
    [PlayerAnimationsNames.twoFootedTouch]: {
        loop: false,
        starting: false
    },
    [PlayerAnimationsNames.twoFooted]: {
        loop: false,
        starting: false
    },
    [PlayerAnimationsNames.bad]: {
        loop: false,
        starting: false
    },
    [PlayerAnimationsNames.happy]: {
        loop: false,
        starting: false
    },
    [PlayerAnimationsNames.end]: {
        loop: false,
        starting: false
    },
    [PlayerAnimationsNames.fall]: {
        loop: false,
        starting: false
    },
    [PlayerAnimationsNames.flight]: {
        loop: true,
        starting: false
    },
    [PlayerAnimationsNames.slide]: {
        loop: true,
        starting: false
    },
    [PlayerAnimationsNames.takeOff]: {
        loop: false,
        starting: false
    },
    [PlayerAnimationsNames.prepare]: {
        loop: true,
        starting: true
    },
    [PlayerAnimationsNames.telemarkIdeal]: {
        loop: false,
        starting: false
    },
    [PlayerAnimationsNames.telemarkMedium]: {
        loop: false,
        starting: false
    },
    [PlayerAnimationsNames.telemarkPoor]: {
        loop: false,
        starting: false
    },
    [PlayerAnimationsNames.telemarkIdealLoop]: {
        loop: true,
        starting: false
    },
    [PlayerAnimationsNames.telemarkMediumLoop]: {
        loop: true,
        starting: false
    },
    [PlayerAnimationsNames.telemarkPoorLoop]: {
        loop: true,
        starting: false
    },
    // [PlayerAnimationsNames.telemarkIdealEnd]: {
    //     loop: false,
    //     starting: false
    // },
    // [PlayerAnimationsNames.telemarkMediumEnd]: {
    //     loop: false,
    //     starting: false
    // },
    // [PlayerAnimationsNames.telemarkPoorEnd]: {
    //     loop: false,
    //     starting: false
    // },
    [PlayerAnimationsNames.beforeEmotion]: {
        loop: true,
        starting: false
    }
    
}
