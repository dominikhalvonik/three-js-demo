<template>
  <div class="positioner">
    <arrow-animation
      v-if="showSideArrows || showAllArrows"
      position="bottom"
      style="position: absolute; left: 2%; top: -20%; transform-origin: 0 100%;"
      uniq-name="keyboardKeys"
      :width="320"
      :height="260"
    />
    <tutorial-keyboard-keys
      v-if="showSideArrows"
      type="arrow-keys"
      :text="$t('webInfoBalance')"
      is-scaled
      class="keyboard-side-keys"
    >
      <section
        class="tutorial-keyboard-keys-wrapper"
      >
        <tutorial-keyboard-key
          type="arrow"
          rotation="left"
          letter="a"
          glow
        />
        <tutorial-keyboard-key
          type="arrow"
          rotation="right"
          letter="d"
          glow
        />
      </section>
    </tutorial-keyboard-keys>
    <tutorial-keyboard-keys
      v-if="showAllArrows"
      type="arrow-keys"
      :text="$t('webInfoBalance')"
      is-scaled
      class="keyboard-all-keys"
    >
      <section
        class="tutorial-keyboard-keys-wrapper"
      >
        <tutorial-keyboard-key
          type="arrow"
          rotation="top"
          letter="w"
          glow
        />
        <tutorial-keyboard-key
          type="arrow"
          rotation="down"
          letter="s"
          glow
        />
        <tutorial-keyboard-key
          type="arrow"
          rotation="left"
          letter="a"
          glow
        />
        <tutorial-keyboard-key
          type="arrow"
          rotation="right"
          letter="d"
          glow
        />
      </section>
    </tutorial-keyboard-keys>
    <arrow-animation
      v-if="showSpace"
      position="bottom"
      style="position: absolute; right: 2%; top: -20%; transform-origin: 100% 100%;"
      uniq-name="keyboardKeys1"
      :width="320"
      :height="260"
    />
    <tutorial-keyboard-keys
      v-if="showSpace"
      type="space"
      :text="$t(spaceText)"
      class="keyboard-space"
      is-scaled
    >
      <tutorial-keyboard-key
        type="space"
        glow
      />
    </tutorial-keyboard-keys>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import {
    ArrowAnimation,
    TutorialKeyboardKeys,
    TutorialKeyboardKey
} from '@powerplay/core-minigames-ui'
import { mapGetters } from 'vuex'

@Options({
    name: 'TutorialKeys',
    components: {
        ArrowAnimation,
        TutorialKeyboardKeys,
        TutorialKeyboardKey
    },
    computed: {
        ...mapGetters({
            getFlyState: 'FlightBalanceState/getFlightBalanceState',
            tutorialState: 'TutorialState/getTutorialState',
            tutorialObjectives: 'TutorialState/getTutorialObjectives',
            gameSettingsState: 'GameSettingsState/getGameSettingsState',
            isDisabled: 'InputsState/getDisabled',
            isStart: 'ActionButtonState/isStart'
        }),
        spaceText () {

            return this.isStart
                ? 'webInfoStart'
                : this.getFlyState.isActive
                    ? 'webInfoLanding'
                    : 'webInfoTakeoff'
        
        },
        showSpace () {

            return this.tutorialState.showButtonStart ||
                this.tutorialState.takeoff ||
                this.tutorialState.landing
        
        },
        showSideArrows () {

            return this.tutorialState.joystick && !this.tutorialState.flight
        
        },
        showAllArrows () {

            return this.tutorialState.flight
        
        }
    }
})
export default class TutorialInfoKeys extends Vue {}
</script>

<style lang="less" scoped>
    .positioner {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 25%;
        
        .keyboard-side-keys {
            transform-origin: 0 100%;
            position: absolute;
            left: 2%;
            bottom: 10%;
            
            .tutorial-keyboard-keys-wrapper {
                height: 100px;
            }
        }
        
        .keyboard-all-keys {
            transform-origin: 0 100%;
            position: absolute;
            left: 2%;
            bottom: 10%;
        }
        .keyboard-space {
            transform-origin: 100% 100%;
            position: absolute;
            right: 2%;
            bottom: 10%;
        }
    }
</style>
