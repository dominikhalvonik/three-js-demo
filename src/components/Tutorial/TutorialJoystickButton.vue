<template>
  <section
    class="positioner"
    @mousedown.stop=""
    @mouseup.stop=""
    @touchstart.stop=""
    @touchend.stop=""
  >
    <section
      :class="{isLeft: !settingsState.isLeft}"
      class="flex justify-between"
    >
      <section
        class="position"
        style="width: 350px;"
      />
      <section class="relative">
        <div :style="[transformCoef, positionTransform]">
          <arrow-animation
            style="position: absolute; left: 22%; top: 22%;"
            position="bottom"
            uniq-name="keyboardKeys"
            :width="320"
            :height="260"
            :is-scaled="false"
          />
          <power-stick
            :only-horizontal="horizontal"
            :glow="true"
            :is-scaled="false"
            @mousedown.stop=""
            @mouseup.stop=""
            @touchstart.stop=""
            @touchend.stop=""
          />
        </div>
      </section>
    </section>
  </section>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import {
    PowerStick,
    ArrowAnimation,
    WindowAspect
} from '@powerplay/core-minigames-ui'
import { mapGetters } from 'vuex'

@Options({
    name: 'TutorialJoystickButton',
    mixins: [WindowAspect],
    props: {
        horizontal: {
            type: Boolean,
            default: true
        }
    },
    components: {
        PowerStick,
        ArrowAnimation
    },
    computed: {
        ...mapGetters({
            settingsState: 'GameSettingsState/getGameSettingsState'
        }),
        transformCoef () {

            return {
                transform: `scale(${this.scaleCoef}) translate(0, 0)`
            }
        
        },
        positionTransform () {
            
            if (this.settingsState.isLeft) {

                return {
                    transformOrigin: 'bottom right'
                }
            
            }
            
            return {
                transformOrigin: 'bottom left'
            }
            
        }
    }
})
export default class TutorialJoystickButton extends Vue {}
</script>

<style lang="less" scoped>
.positioner {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.flex {
  display: flex;

  &.isLeft {
      flex-direction: row-reverse;
  }
}

.justify-between {
  justify-content: space-between;
}

.relative {
  position: relative;
}

</style>
