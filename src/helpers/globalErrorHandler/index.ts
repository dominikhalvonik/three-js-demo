import { app } from '@/main'
import { RequestLogTypes, requestManager, errorManager } from '@powerplay/core-minigames'
import store from '@/store'

// array na errorove message, aby sa neposielali viackrat
const errorMessages: string[] = []

// eslint-disable-next-line
const createVueErrorMessage = (error: Error, info: any): string => {

    return `VUE ERROR. Message: ${error.message}, Stack: ${error.stack}, Info: ${info}`

}

const createGlobalErrorMessage = (
    message: string | Event,
    source: string | undefined,
    lineno: number | undefined,
    colno: number | undefined,
    error: Error | undefined
): string => {

    return `JS ERROR. Mesage: ${message}, source: ${source},` +
        `lineno: ${lineno}, colno: ${colno}, error: ${error}`

}

const createGlobalAsyncError = (
    message: string,
    event: string | Event
): string => {

    return `ASYNC ERROR. Mesage: ${message}, event: ${event}`

}

const includeErrorInArray = (message: string): boolean => {

    if (errorMessages.includes(message)) return true
    errorMessages.push(message)
    return false

}

const sendErrorToServer = (message: string): void => {

    const requestData = {
        error_data: message
    }
    requestManager.sendLogRequest(RequestLogTypes.error, requestData)

}

const createErrorBox = (): void => {

    if (errorManager.getErrorBox()) {

        errorManager.setErrorBox(false)
        store.commit('ErrorState/SET_STATE', {
            errorText: 'Error has occured'
        })

    }

}

export const globalErrorHandler = (): void => {

    // Production global property config
    if (import.meta.env.NODE_ENV === 'production') {

        // odchytavanie vue chyb v templateoch
        // eslint-disable-next-line
        app.config.errorHandler = (err, _, info) => {

            const error: Error = err as Error
            // vm nedavame, lebo je tam strasne vela dat
            const errorMessage = createVueErrorMessage(error, info)
            console.warn('vue-error', errorMessage)
            const wasExistingError = includeErrorInArray(errorMessage)
            if (wasExistingError) return false
            sendErrorToServer(errorMessage)
            createErrorBox()
            return false

        }

        // odchytavanie mimo vue chyb, napr. phaser
        window.onerror = (message, source, lineno, colno, error) => {

            const errorMessage = createGlobalErrorMessage(message, source, lineno, colno, error)
            console.warn('non-vue-error', errorMessage)
            const wasExistingError = includeErrorInArray(errorMessage)
            if (wasExistingError) return false
            sendErrorToServer(errorMessage)
            createErrorBox()
            return false

        }

        window.addEventListener('unhandledrejection', (event) => {

            const errorMessage = createGlobalAsyncError('Async error', event.reason)
            console.warn('async-errors', errorMessage)
            const wasExistingError = includeErrorInArray(errorMessage)
            if (wasExistingError) return false
            sendErrorToServer(errorMessage)
            createErrorBox()
            return false

        })

    }

}
