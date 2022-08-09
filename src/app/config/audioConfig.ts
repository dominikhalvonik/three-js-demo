import type { AudioObject } from '@powerplay/core-minigames'
import { AudioCategories, AudioGroups, AudioNames } from '../types'
/**
 * Aku verziu momentalne pouzivame
 */
export const audioConfigVersion = 3
/**
 * Trieda konfigu pre zvuky
 */
export const audioConfig: AudioObject[] = [

    {
        files: [
            AudioNames.audienceSad
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        version: 2,
        category: AudioCategories.audience
    },

    {
        files: [
            AudioNames.audienceYay
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.audience,
        version: 3
    },
    {
        files: [
            AudioNames.wind
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: true,
        version: 2,
        category: AudioCategories.misc
    },

    {
        files: [
            AudioNames.audienceNoise
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: true,
        category: AudioCategories.audience,
        loadRandomCount: 1
    },

    {
        files: [
            AudioNames.takeoff
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.skiing
    },

    /* {
        files: [
            AudioNames.fall
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.misc
    }, */

    {
        files: [
            AudioNames.skiingLanding
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.skiing
    },

    {
        files: [
            AudioNames.skiingStart
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.skiing
    },

    {
        files: [
            AudioNames.rampLoop
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: true,
        category: AudioCategories.skiing
    },

    {
        files: [
            AudioNames.skiing
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: true,
        category: AudioCategories.skiing
    },

    {
        files: [
            AudioNames.audienceHype
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: true,
        category: AudioCategories.audience,
        version: 3
    },

    {
        files: [
            AudioNames.heartbeat
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: true,
        version: 2,
        category: AudioCategories.character
    },

    {
        files: [
            AudioNames.commentAfterLandingDefault,
            AudioNames.commentAfterLandingDefault2
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        group: AudioGroups.commentators,
        ignoreModes: [3, 14, 9, 10]
    },

    {
        files: [
            AudioNames.commentAfterLandingFall
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        group: AudioGroups.commentators,
        ignoreModes: [3, 14, 9, 10]
    },

    {
        files: [
            AudioNames.commentAfterLandingHandTouch
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        group: AudioGroups.commentators,
        ignoreModes: [3, 14, 9, 10]
    },

    {
        files: [
            AudioNames.commentAfterLandingHsTelemark,
            AudioNames.commentAfterLandingHsTelemark2
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        loadRandomCount: 1,
        group: AudioGroups.commentators,
        ignoreModes: [3, 14, 9, 10]
    },

    {
        files: [
            AudioNames.commentAfterLandingHsTwoFooted,
            AudioNames.commentAfterLandingHsTwoFooted2
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        loadRandomCount: 1,
        group: AudioGroups.commentators,
        ignoreModes: [3, 14, 9, 10]
    },

    {
        files: [
            AudioNames.commentAfterLandingKpointTelemark,
            AudioNames.commentAfterLandingKpointTelemark2
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        loadRandomCount: 1,
        group: AudioGroups.commentators,
        ignoreModes: [3, 14, 9, 10]
    },

    {
        files: [
            AudioNames.commentAfterLandingKpointTwoFooted,
            AudioNames.commentAfterLandingKpointTwoFooted2
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        loadRandomCount: 1,
        group: AudioGroups.commentators,
        ignoreModes: [3, 14, 9, 10]
    },

    {
        files: [
            AudioNames.commentAfterTakeoffExcellentOrBetter,
            AudioNames.commentAfterTakeoffExcellentOrBetter2
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        loadRandomCount: 1,
        group: AudioGroups.commentators,
        ignoreModes: [3, 14, 9, 10]
    },

    {
        files: [
            AudioNames.commentAfterTakeoffGoodOrWorseEarly
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        group: AudioGroups.commentators,
        ignoreModes: [3, 14, 9, 10]
    },

    {
        files: [
            AudioNames.commentAfterTakeoffGoodOrWorseLate
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        group: AudioGroups.commentators,
        ignoreModes: [3, 14, 9, 10]
    },

    {
        files: [
            AudioNames.commentDuringCountdown,
            AudioNames.commentDuringCountdown2
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        group: AudioGroups.commentators,
        ignoreModes: [3, 14, 9, 10]
    },

    {
        files: [
            AudioNames.commentIntro,
            AudioNames.commentIntro2
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        loadRandomCount: 1,
        group: AudioGroups.commentators,
        ignoreModes: [9, 10]
    },

    {
        files: [
            AudioNames.commentFinalResults,
            AudioNames.commentFinalResults2
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        loadRandomCount: 1,
        group: AudioGroups.commentators,
        ignoreModes: [3, 14, 9, 10]
    },

    {
        files: [
            AudioNames.skiingBreak
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: true,
        version: 2,
        category: AudioCategories.skiing
    },

    {
        files: [
            AudioNames.commentAfterSecondJump1
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        group: AudioGroups.commentators,
        ignoreModes: [3, 14, 9, 10]
    },

    {
        files: [
            AudioNames.commentAfterSecondJump23
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        group: AudioGroups.commentators,
        ignoreModes: [3, 14, 9, 10]
    },

    {
        files: [
            AudioNames.commentAfterSecondJump45
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        group: AudioGroups.commentators,
        ignoreModes: [3, 14, 9, 10]
    },

    {
        files: [
            AudioNames.commentAfterSecondJump6
        ],
        startOnRandomPlace: false,
        randomDelayBeforeStartFrom: 0,
        randomDelayBeforeStartTo: 0,
        volume: 1,
        volumeRandom: 0,
        rate: 1,
        rateRandom: 0,
        enabled: true,
        loop: false,
        category: AudioCategories.commentators,
        group: AudioGroups.commentators,
        ignoreModes: [3, 14, 9, 10]
    }

]
