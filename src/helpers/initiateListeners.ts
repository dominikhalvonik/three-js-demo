import { AudioGroups, AudioNames } from '@/app/types'
import { tutorialFlow } from '@/app/modes/tutorial/TutorialFlow'
import store from '@/store'
import {
    CustomEvents,
    translations,
    CameraStates,
    game,
    modes,
    playersManager,
    trainingManager,
    hints,
    audioManager,
    requestManager,
    cameraManager,
    corePhasesManager,
    CorePhases,
    PhaseFinalResultsManager
} from '@powerplay/core-minigames'
import { translations as t } from '@powerplay/core-minigames-ui'

// eslint-disable-next-line
export const initiateListeners = (vm: any) => {
    // Listener for language download
    window.addEventListener(CustomEvents.translations, () => {
            
        if (Number(import.meta.env.VITE_APP_LOCAL)) {
            
            translations.setTranslations(t)
        
        }
        vm.$i18n.setLocaleMessage('lang', translations.getTranslations())
        
        // musime zmenit hint v loadingu
        hints.setSpecificHintsCountForDiscipline(1)
        const hint = hints.getHintText(requestManager.disciplineID)
        
        vm.$store.commit('LoadingState/SET_STATE', {
            showLoading: true,
            hintText: vm.$t(hint)
        })
        
    })

    // Listener for game start event
    window.addEventListener(CustomEvents.gameStart, () => {
        
        const loadingState = vm.$store.getters['LoadingState/getLoadingState']
        const newState = { ...loadingState, showLoading: false }
        vm.$store.commit('LoadingState/SET_STATE', newState)
        
    })

    // Listener for game start instruction phase
    window.addEventListener(CustomEvents.startInstructionsPhase, () => {
        
        if (modes.isTutorial()) return
        
        vm.$store.commit('InstructionsState/SET_STATE', {
            showInstructions: true,
            showButton: false
        })
        cameraManager.setState(CameraStates.table)
        cameraManager.playTween(true)
        game.renderScene()
        
    })
    
    // Listener for game intro start event
    window.addEventListener(CustomEvents.startIntroPhase, () => {
        
        if (modes.isTutorial()) return
        
        vm.$store.commit(
            'TableState/SET_COMPETITION_TEXT',
            modes.isTrainingMode()
                ? vm.$t('level').replace('%s', trainingManager.level)
                : `tableText${modes.mode}`
        )
        vm.$store.commit('TableState/SET_VISIBILITY', true)
        
        audioManager.play(AudioNames.audienceNoise, undefined, undefined, undefined, undefined, 1)
        if (!modes.isTutorial() && !modes.isTrainingMode()) {

            audioManager.play(AudioNames.commentIntro)

        }
        
    })

    // Listener pre tutorial Typewrite
    window.addEventListener(CustomEvents.typeWrite, () => {
        
        if (!modes.isTutorial()) return
        
        vm.$store.commit('TutorialCoreState/SET_TYPE_WRITER', false)
  
    })
        
    // Listener pre tutorial game event
    window.addEventListener(CustomEvents.tutorialGameEvent, () => {

        if (!modes.isTutorial()) return
    
        tutorialFlow.checkInput()
    
    })

    // Listener for game start listing phase
    window.addEventListener(CustomEvents.startStartListPhase, () => {
        
        if (modes.isTutorial()) return
        
        store.commit('BlurState/SET_IS_ACTIVE', true)
        store.commit('BlurState/SET_IS_TABLE', true)
        
        const data = playersManager.getDataForTable()
        console.log(data)
        vm.$store.commit('TableState/SET_DATA', data)
        vm.$store.commit('TableState/SET_RESULT_TEXT', 'startList')
        vm.$store.commit('TableState/SET_IS_START_LIST', true)
        vm.$store.commit('TableState/SET_ACTIVATION', true)
        
    })

    // Listener for game start discipline phase
    window.addEventListener(CustomEvents.startDisciplinePhase, () => {
        
        if (modes.isTutorial()) return
        
        store.commit('BlurState/SET_IS_ACTIVE', false)
        store.commit('BlurState/SET_IS_TABLE', false)
        
        vm.$store.commit('TableState/SET_VISIBILITY', false)
        vm.$store.commit('TableState/SET_IS_START_LIST', false)
        
    })

    // Listener for game start provisional results phase
    window.addEventListener(CustomEvents.startProvisionalResultsPhase, () => {
        
        if (modes.isTutorial()) return
        
        store.commit('BlurState/SET_IS_ACTIVE', true)
        store.commit('BlurState/SET_IS_TABLE', true)
        
        vm.$store.commit('TableState/SET_DATA', playersManager.getStandings())
        vm.$store.commit('TableState/SET_RESULT_TEXT', 'provisionalResults')
        vm.$store.commit('TableState/SET_VISIBILITY', true)
        
        store.commit('UiState/SET_FINISH_TOP_BOX_VISIBILITY', false)
        
        audioManager.stopAllAudio()
        audioManager.play(AudioNames.audienceNoise, undefined, undefined, undefined, undefined, 1)
        
    })

    // Listener for game start final standings phase
    window.addEventListener(CustomEvents.startFinalStandingsPhase, () => {
        
        if (modes.isTutorial()) return
        
        store.commit('BlurState/SET_IS_ACTIVE', true)
        store.commit('BlurState/SET_IS_TABLE', true)
        
        vm.$store.commit(
            'TableState/SET_COMPETITION_TEXT',
            modes.isTrainingMode()
                ? vm.$t('level').replace('%s', trainingManager.level)
                : `tableText${modes.mode}`
        )
        vm.$store.commit('TableState/SET_DATA', playersManager.getStandings())
        // this.$store.commit('TableState/SET_COMPETITION_TEXT', '')
        vm.$store.commit('TableState/SET_RESULT_TEXT', 'finalStandings')
        vm.$store.commit('TableState/SET_VISIBILITY', true)
        vm.$store.commit('TableState/SET_ACTIVATION', true)
        
        if (!audioManager.isAudioGroupPlaying(AudioGroups.commentators)) {
            
            audioManager.play(AudioNames.commentFinalResults)
            
        }
        
        audioManager.play(AudioNames.audienceNoise, undefined, undefined, undefined, undefined, 1)
        
        store.commit('UiState/SET_FINISH_TOP_BOX_VISIBILITY', false)
        
        store.commit('StartPhaseState/RESET')
    
    })
        
    // Listener for game start final training phase
    window.addEventListener(CustomEvents.startFinalTrainingPhase, () => {
        
        vm.$store.commit(
            'TrainingResultsState/SET_STATE_RESULT',
            true
        )
        
        audioManager.stopAllAudio()
        audioManager.play(AudioNames.audienceNoise, undefined, undefined, undefined, undefined, 1)
        
    })
    
    // Listener pre to, aby sme vedeli, ze su vsetky konecne requesty zbehnute
    window.addEventListener(CustomEvents.allRequestDoneOnEnd, () => {
        
        vm.$store.commit('WaitingState/SET_STATE', {
            isWaiting: false,
            trainingButtonsDisabled: false
        })
        
        // v tutoriali hned presmerujeme
        if (modes.isTutorial()) requestManager.redirect()
        
        const finalPhase = corePhasesManager.getPhase(
            CorePhases.finalResults
        ) as PhaseFinalResultsManager
    
        if (finalPhase) finalPhase.enableSkip()
        
    })
    
    /** Listener pre zobrazenie loading circle po kliknuti na final redirect */
    window.addEventListener(CustomEvents.finalRedirectDone, () => {
        
        store.commit('LoadingCircleState/SET_STATE', {
            isActive: true
        })
        
    })

}
