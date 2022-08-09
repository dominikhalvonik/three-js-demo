<template>
  <div
    v-if="isVisible"
    class="button-positions"
  >
    <div
      v-if="!gameSettingsState.isLeft"
      class="justify-between flex"
    >
      <joy-stick
        v-show="showJoystick"
        :disabled="isDisabled"
        :horizontal="!getFlyState.isActive"
        :is-scaled="false"
        :style="[
          {transform: scaleCoef, width: '100%'},
          joystickPosition
        ]"
      />
      <div v-show="!showJoystick" />
      <section
        :style="{position: 'absolute', right: '0', bottom: '0'}"
      >
        <action-button
          :disabled="actionButtonDisabled"
          :type="
            isStart
              ? 'start-ski-jumping'
              : getFlyState.isActive
                ? 'landing'
                : 'take-off'
          "
          :is-scaled="true"
          transform-origin-prop="bottom right"
        />
      </section>
    </div>
    <div
      v-else
      class="justify-between flex"
    >
      <section
        :style="{position: 'absolute', left: '0', bottom: '0'}"
      >
        <action-button
          :disabled="actionButtonDisabled"
          :type="
            isStart
              ? 'start-ski-jumping'
              : getFlyState.isActive
                ? 'landing'
                : 'take-off'
          "
          :is-scaled="true"
        />
      </section>

      <joy-stick
        v-if="showJoystick"
        :disabled="isDisabled"
        :horizontal="!getFlyState.isActive"
        :is-scaled="false"
        :style="[
          {transform: scaleCoef, width: '100%'},
          joystickPosition
        ]"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import JoyStick from './JoyStick.vue'
import ActionButton from './ActionButton.vue'
import { mapGetters } from 'vuex'
import { WindowAspect } from '@powerplay/core-minigames-ui'

@Options({
    components: {
        ActionButton,
        JoyStick
    },
    mixins: [WindowAspect],
    computed: {
        ...mapGetters({
            getFlyState: 'FlightBalanceState/getFlightBalanceState',
            isDisabled: 'InputsState/getDisabled',
            actionButtonDisabled: 'ActionButtonState/getDisabled',
            isVisible: 'InputsState/getIsVisible',
            isStart: 'ActionButtonState/isStart',
            showJoystick: 'ActionButtonState/getShowJoystick',
            gameSettingsState: 'GameSettingsState/getGameSettingsState'
        }),
        joystickPosition () {

            let left = `calc(50% - (572px * ${this.scaleCoef} / 2))`
            let right = ''
            if (!this.gameSettingsState.isLeft) {

                left = ''
                right = `calc(50% - (572px * ${this.scaleCoef} / 2))`
            
            }
            
            return {
                position: 'absolute',
                left,
                right,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                top: `calc(50% - (572px * ${this.scaleCoef} / 2))`,
                height: '100%'
            }
        
        }
    }
})
export default class MobileInputs extends Vue {}
</script>

<style lang="less" scoped>
.button-positions {
  width: 100%;
  user-select: none;
  position: absolute;
  height: 100%;
  bottom: 0;
}

.flex {
    display: flex;
}

.justify-between {
    justify-content: space-between;
}

.relative {
    position: relative
}

</style>
