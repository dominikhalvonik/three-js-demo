<template>
  <section
    class="tutorial"
    @click.prevent=""
    @mousedown.prevent=""
    @mouseup.prevent=""
    @touchstart.prevent=""
    @touchend.prevent=""
  >
    <tutorial-tasks :tasks="tasks" />
    <tutorial-overlay
      v-if="tutorialState.anne.showAnne
        || tutorialState.tutorialMessage.showMessage
        || tutorialState.mobile.show"
    />
    <tutorial-hand-settings
      v-if="tutorialState.mobile.show"
      style="pointer-events: auto;"
      img-url="https://appspowerplaymanager.vshcdn.net/images/winter-sports/minigame/ski-jumping/ui/tutorial/MOBIL_SJ.png"
      @mousedown.stop=""
      @mouseup.stop=""
      @touchstart.stop=""
      @touchend.stop=""
      @clickContinue="continueTask"
    >
      <div class="mobiler">
        <div class="buttons">
          <div
            class="button-group"
            :class="{ reverse: gameSettingsState.isLeft }"
          >
            <img
              width="150"
              height="150"
              :src="`${pathAssets}/ui/tutorial/joystick_sj.png`"
              alt="button1"
            >
            <img
              width="150"
              height="150"
              :src="`${pathAssets}/ui/tutorial/button_sj.png`"
              alt="button2"
            >
          </div>
        </div>
      </div>
    </tutorial-hand-settings>
    <tutorial-anne
      v-if="tutorialState.anne.showAnne"
      :is-right="tutorialState.anne.isRight"
    />
    <tutorial-message-box
      v-if="tutorialState.tutorialMessage.showMessage"
      :key="typeWrite"
      :type-write="typeWrite"
      :class="{offsetBot: tutorialState.tutorialMessage.offset}"
      :header-text="$t('anne')"
      :text="$t(tutorialState.tutorialMessage.message)"
      :color="tutorialState.tutorialMessage.color"
      :button-yellow-text="tutorialState.tutorialMessage.yellowText"
      @showFullText="setTypewriteToInactive"
    />
    <tutorial-start-box v-if="tutorialState.startbox" />
    <tutorial-start-button v-if="tutorialState.showButtonStart && isMobile()" />
    <tutorial-joystick-button
      v-if="(tutorialState.joystick || tutorialState.flight) && isMobile()"
      :horizontal="!tutorialState.flight"
    />
    <tutorial-take-off
      v-if="(tutorialState.takeoff || tutorialState.landing) && isMobile()"
      class="clickable"
      :landing="tutorialState.landing"
    />
    <tutorial-descend-bar v-if="tutorialState.descend" />
    <tutorial-flight-bar v-if="tutorialState.balance" />
    <tutorial-height-balance v-if="tutorialState.balanceHeight" />
    <tutorial-info-keys v-if="!isMobile()" />
  </section>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import {
    WindowAspect,
    TutorialAnne,
    TutorialMessageBox,
    TutorialTasks,
    TutorialOverlay,
    TutorialHandSettings
} from '@powerplay/core-minigames-ui'
import { mapGetters } from 'vuex'
import { settings, tutorialManager, type TutorialObjective } from '@powerplay/core-minigames'
import TutorialStartBox from './TutorialStartBox.vue'
import TutorialStartButton from './TutorialStartButton.vue'
import TutorialJoystickButton from './TutorialJoystickButton.vue'
import TutorialTakeOff from './TutorialTakeOff.vue'
import TutorialDescendBar from './TutorialDescendBalance.vue'
import TutorialFlightBar from './TutorialFlightBalance.vue'
import TutorialHeightBalance from './TutorialHeightBalance.vue'
import TutorialInfoKeys from './TutorialInfoKeys.vue'
import { pathAssets } from '@/globals/globalvariables'

@Options({
    name: 'TutorialLogicComponent',
    components: {
        TutorialAnne,
        TutorialMessageBox,
        TutorialTasks,
        TutorialOverlay,
        TutorialHandSettings,
        TutorialStartBox,
        TutorialStartButton,
        TutorialJoystickButton,
        TutorialTakeOff,
        TutorialDescendBar,
        TutorialFlightBar,
        TutorialHeightBalance,
        TutorialInfoKeys
    },
    data () {

        return {
            tasks: [],
            pathAssets
        }
    
    },
    computed: {
        ...mapGetters({
            tutorialState: 'TutorialState/getTutorialState',
            tutorialObjectives: 'TutorialState/getTutorialObjectives',
            gameSettingsState: 'GameSettingsState/getGameSettingsState',
            typeWrite: 'TutorialCoreState/getTypeWriter'
        })
    },
    methods: {
        setTypewriteToInactive () {

            this.$store.commit('TutorialCoreState/SET_TYPE_WRITER', false)
            tutorialManager.setTypeWriting(false)
        
        },
        updateTasks () {
            
            this.tasks = this.tutorialObjectives.map((objective: TutorialObjective) => {

                let color = 'blue'
                if (objective.passed) color = 'green'
                if (objective.failed) color = 'red'
                return {
                    color,
                    text: `${this.$t(objective.name)}`
                }
                
            })
        
        },
        continueTask () {

            this.setThings()
            settings.saveValues()
            window.dispatchEvent(new Event('mousedown'))
        
        },
        setThings (): void {
            
            settings.update(
                'quality', this.gameSettingsState.graphicsSettings
            )
            settings.update(
                'sounds', this.gameSettingsState.volume ? 1 : 0
            )
            settings.update(
                'qualityAuto', this.gameSettingsState.graphicsAuto ? 1 : 0
            )
            settings.update(
                'isLeft', this.gameSettingsState.isLeft ? 1 : 0
            )
            
        }
    },
    
    watch: {
        tutorialState: {
            immediate: true,
            deep: true,
            handler () {

                this.updateTasks()
            
            }
        }
    },
    mixins: [WindowAspect]
})
export default class TutorialLogicComponent extends Vue {}
</script>

<style lang="less">
.tutorial {
    .tutorial-tasks{
        position: absolute;
        left: 20px;
        top: 30%;
    }
    .tutorial-anne {
        bottom: 0;
    }

    .offsetBot {
        bottom: 50%;
    }
    
    .clickable {
        pointer-events: auto;
    }
}

.mobiler {
    height: 100%;

    .buttons {
        position: relative;
        width: 100%;
        height: 100%;

        .button-group {
            position: absolute;
            bottom: 130px;
            left: 130px;
            right: 130px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &.reverse {
                flex-direction: row-reverse;
            }
        }
    }
}
</style>
