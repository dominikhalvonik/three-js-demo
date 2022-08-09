<template>
  <div
    id="app"
    class="app"
  >
    <div style="z-index: 1000000">
      <div v-show="!modalActive && !trainingState.firstTutorialMessage">
        <error-modal
          class="pointer-events-auto"
          @close="closeApp"
        />
        <finish-top-box
          v-if="uiState.showFinishTopBox"
          :show-first-box="finishTopBox.showFirstBox"
          :personal-best="finishTopBox.personalBest"
          :first-place="finishTopBox.firstPlace"
          :show-second-box="finishTopBox.showSecondBox"
          :position="finishTopBox.position"
          :new-personal-best="finishTopBox.newPersonalBest"
        />
        <mobile-inputs
          v-if="isMobile"
          class="pointer-events-auto"
        />
        <data-table />
        <info-component />
        <hud-component v-show="debugState.isHudActive" />
        <!-- <GameLoading /> -->
        <phase-start />
        <fps-component />
        <descent-balance-bar class="pointer-events-none" />
        <flight-balance-bar class="pointer-events-none" />
        <start-stats-box v-if="!uiState.isTraining" />
        <startgate-counter-big
          v-if="showStartGate"
          :actual-gate="startGateState.actual"
          :all-gates="startGateState.total"
        />
        <landing-component />
        <traffic-component />
        <information-section
          v-if="!uiState.isTraining && !uiState.isTutorial"
        />
        <training-results v-if="trainingResultsState.showResults" />
        <training-layout v-if="uiState.showTrainingLayout" />
        <info-keys v-if="!isMobile" />
      </div>
      <tutorial-logic-component v-show="!modalActive" />
      <menu-section
        v-if="showMenu && !trainingState.firstTutorialMessage"
        :is-mobile="isMobile"
        style="pointer-events: auto"
        :is-app-wsm="isAppWSM2021"
        :show-overlay="modalActive"
        @toggle-ui="toggleUi"
      />
      <color-overlay-component
        v-if="isBlurActive && !blurState.isToggle"
        :opacity="0.6"
        img-source=""
      />
      <loading-circle-overlay />
      <training-override
        style="pointer-events: auto"
        @mousedown.stop=""
        @mouseleave.stop=""
        @touchleave.stop=""
        @touchstart.stop=""
      />
    </div>
    <black-overlay />
    <loading />
  </div>
</template>

<script lang="ts">
// External Package codes
import { Options, Vue } from 'vue-class-component'
import { mapGetters } from 'vuex'

// Internal Package codes
import {
    game,
    MobileDetector,
    requestManager,
    modes,
    inputsManager
} from '@powerplay/core-minigames'
import {
    ErrorModal,
    LoadingCircleOverlay,
    ColorOverlayComponent,
    BlackOverlay,
    StartgateCounterBig
} from '@powerplay/core-minigames-ui'

// Component codes

// Debug Components
import HudComponent from '@/components/DebugComponents/HUD.vue'

// Game Components
import MobileInputs from '@/components/Inputs/MobileInputs.vue'
import DescentBalanceBar from '@/components/DescentBalance.vue'
import FlightBalanceBar from '@/components/FlightBalance.vue'
import PhaseStart from '@/components/PhaseStart.vue'
import DataTable from '@/components/DataTable.vue'
import InformationSection from '@/components/InformationSection.vue'
import Loading from '@/components/Loading.vue'
import StartStatsBox from '@/components/StartStatsBox.vue'
import InfoComponent from '@/components/InfoComponent.vue'
import MenuSection from '@/components/MenuSection/index.vue'
import LandingComponent from '@/components/LandingComponent.vue'
import TrafficComponent from '@/components/TrafficComponent.vue'
import FpsComponent from '@/components/FpsComponent.vue'
import TrainingResults from '@/components/Training/TrainingResults.vue'
import TrainingLayout from '@/components/Training/TrainingLayout.vue'
import TutorialLogicComponent from '@/components/Tutorial/TutorialLogicComponent.vue'
import InfoKeys from '@/components/InfoKeys.vue'
import TrainingOverride from '@/components/Training/TrainingOverride.vue'
import FinishTopBox from '@/components/FinishTopBox.vue'

// Internal Codes
import { initiateListeners } from '@/helpers/initiateListeners'
import { tutorialUIChange } from '@/app/modes/tutorial/TutorialUIChange'
import { disciplinePhasesManager } from '@/app/phases'

@Options({
    components: {
        HudComponent,
        Loading,
        MobileInputs,
        DescentBalanceBar,
        FlightBalanceBar,
        PhaseStart,
        InformationSection,
        LandingComponent,
        DataTable,
        ErrorModal,
        StartStatsBox,
        InfoComponent,
        MenuSection,
        TrafficComponent,
        FpsComponent,
        TrainingResults,
        TrainingLayout,
        TutorialLogicComponent,
        InfoKeys,
        LoadingCircleOverlay,
        TrainingOverride,
        FinishTopBox,
        ColorOverlayComponent,
        BlackOverlay,
        StartgateCounterBig
    },
    data () {

        return {
            modalActive: false,
            isAppWSM2021: false
        }
    
    },
    computed: {
        ...mapGetters({
            debugState: 'DebugState/getDebugState',
            uiState: 'UiState/getUiState',
            showTrainingResults: 'TrainingResultsState/getTrainingResultsShow',
            finishTopBox: 'FinishTopBoxState/getfinishTopBoxState',
            trainingState: 'TrainingState/getTrainingState',
            isBlurActive: 'BlurState/getIsActive',
            blurState: 'BlurState/getBlurState',
            trainingResultsState: 'TrainingResultsState/getTrainingResultsState',
            startGateState: 'StartGateState/getStartGateState',
            startPhaseState: 'StartPhaseState/getStartPhaseState'
        }),
        isMobile (): boolean {

            return MobileDetector.isMobile()
        
        },
        showMenu (): boolean {

            return !this.showLoading() && !this.showTrainingResults
        
        },
        showStartGate (): boolean {
            
            return this.startGateState.showBig && !modes.isTutorial()
            
        }
    },
    methods: {
        showLoading (): void {

            return this.$store.getters['LoadingState/getLoadingState'].showLoading
        
        },
        closeApp (): void {

            disciplinePhasesManager.prematureEnded = true
            this.$store.commit('LoadingCircleState/SET_STATE', {
                isActive: true
            })
            requestManager.redirect(true)
        
        },
        toggleUi (toggle = true) {

            if (toggle) {

                inputsManager.actionInputsBlocked = true
                game.pauseGame()
                this.$store.commit('BlurState/SET_IS_ACTIVE', true)
                this.$store.commit('BlurState/SET_IS_TOGGLE', true)
                this.modalActive = true
            
            } else {

                inputsManager.actionInputsBlocked = false
                this.modalActive = false
                this.$store.commit('BlurState/SET_IS_ACTIVE', false)
                this.$store.commit('BlurState/SET_IS_TOGGLE', false)
                game.resumeGame()
            
            }
        
        }
    },
    created (): void {

        this.$store.commit('LoadingState/SET_STATE', {
            showLoading: true,
            loadingProgress: 0
        })

        this.isAppWSM2021 = modes.isAppWSM2021()
        initiateListeners(this)
        tutorialUIChange.registerVM(this)
    
    },
    watch: {
        isBlurActive (newState) {

            if (newState) {

                document.getElementsByTagName('canvas')[0].classList.add('blur-class')
            
            } else {

                document
                    .getElementsByTagName('canvas')[0]
                    .classList.remove('blur-class')
            
            }

            // osetrenie vypnutia menu pocas zobrazenej tabulky
            if (!newState && this.blurState.isTable) {

                this.$store.commit('BlurState/SET_IS_ACTIVE', true)
            
            }
        
        }
    }
})
export default class App extends Vue {}
</script>

<style >

.startgate-counter-big-container{
    transform-origin: top left;
    top: 20px;
    left: 20px;
}

.layout-menu {
  position: absolute;
  top: 1%;
  right: 1%;
  z-index: 1;
}

.wind-box {
  position: absolute;
  top: 95px;
  left: 30px;
}

.speed-to-beat-box {
  position: absolute;
  top: 95px;
  right: 30px;
}

.power-user-info-skijump .table-row {
  justify-content: flex-end;
}

.app {
  min-height: 100%;
  min-width: 100%;
  pointer-events: none;
}

.pointer-events-auto {
  pointer-events: auto;
}

.pointer-events-none {
  pointer-events: none;
}
</style>
