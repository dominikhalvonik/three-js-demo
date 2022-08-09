<template>
  <section
    class="positioner"
  >
    <section
      :class="{isLeft: settingsState.isLeft}"
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
            @mousedown.self="forwardStory"
            @mouseup.stop=""
            @touchstart.self="forwardStory"
            @touchend.stop=""
          />
          <mobile-button
            :glow="true"
            :type="landing ? 'landing':'take-off'"
            :is-scaled="false"
            @mousedown.self="forwardStory"
            @mouseup.stop=""
            @touchstart.self="forwardStory"
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
    MobileButton,
    ArrowAnimation,
    WindowAspect
} from '@powerplay/core-minigames-ui'
import { mapGetters } from 'vuex'
import { tutorialManager } from '@powerplay/core-minigames'

@Options({
    name: 'TutorialTakeOff',
    mixins: [WindowAspect],
    props: {
        landing: {
            type: Boolean,
            default: false
        }
    },
    components: {
        MobileButton,
        ArrowAnimation
    },
    methods: {
        forwardStory () {

            if (tutorialManager.getTypeWriting()) {

                this.$store.commit('TutorialCoreState/SET_TYPE_WRITER', false)
                tutorialManager.setTypeWriting(false)
                return
            
            }
            if ([6, 10].includes(tutorialManager.getActualSectionId())) {

                tutorialManager.nextSection()

            }
        
        }
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
                    transformOrigin: 'bottom left'
                }
            
            }
            
            return {
                transformOrigin: 'bottom right'
            }
            
        }
    }
})
export default class TutorialTakeOff extends Vue {}
</script>

<style lang="less" scoped>
.positioner {
  position: absolute;
  bottom: 3.5%;
  left: -2.5%;
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
