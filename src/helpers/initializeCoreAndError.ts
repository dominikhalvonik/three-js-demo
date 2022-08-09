import {
    requestManager, gameStats, LoadingStatsTypes
} from '@powerplay/core-minigames'
import { globalErrorHandler } from './globalErrorHandler'

export const setStartTime = (): void => {

    gameStats.setLoadingStats(LoadingStatsTypes.startTime)

}

const createRequestManager = (): void => {

    requestManager.setEnvData({
        gameToken: import.meta.env.VITE_APP_GAME_TOKEN,
        host: import.meta.env.VITE_APP_HOST,
        isLocal: Number(import.meta.env.VITE_APP_LOCAL) === 1,
        redirect: import.meta.env.VITE_APP_REDIRECT,
        redirectPage: import.meta.env.VITE_APP_REDIRECT_PAGE
    })
    requestManager.create()

}

export const initializeCoreAndError = (): void => {
   
    createRequestManager()
    globalErrorHandler()

}
