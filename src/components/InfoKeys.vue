<template>
  <div class="positioner">
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
        />
        <tutorial-keyboard-key
          type="arrow"
          rotation="right"
          letter="d"
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
        />
        <tutorial-keyboard-key
          type="arrow"
          rotation="down"
          letter="s"
        />
        <tutorial-keyboard-key
          type="arrow"
          rotation="left"
          letter="a"
        />
        <tutorial-keyboard-key
          type="arrow"
          rotation="right"
          letter="d"
        />
      </section>
    </tutorial-keyboard-keys>
    <tutorial-keyboard-keys
      v-if="showSpace"
      type="space"
      :text="$t(spaceText)"
      class="keyboard-space"
      is-scaled
    >
      <tutorial-keyboard-key
        type="space"
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
            isLeft: 'InputsState/isLeft',
            isDisabled: 'InputsState/getDisabled',
            actionButtonDisabled: 'ActionButtonState/getDisabled',
            isVisible: 'InputsState/getIsVisible',
            isStart: 'ActionButtonState/isStart',
            showJoystick: 'ActionButtonState/getShowJoystick'
        }),
        spaceText () {

            return this.isStart
                ? 'webInfoStart'
                : this.getFlyState.isActive
                    ? 'webInfoLanding'
                    : 'webInfoTakeoff'
        
        },
        showSpace () {

            return this.isVisible && !this.actionButtonDisabled
        
        },
        showSideArrows () {

            return this.showJoystick &&
                !this.isDisabled &&
                this.isVisible &&
                !this.getFlyState.isActive
        
        },
        showAllArrows () {

            return this.showJoystick &&
                !this.isDisabled &&
                this.isVisible &&
                this.getFlyState.isActive
        
        }
    }
})
export default class InfoKeys extends Vue {}
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
