<template>
  <div :style="[{ opacity: flickerOpacity }]">
    <mobile-button
      :style="[{transformOrigin: transformOriginProp}]"
      :type="
        isStart
          ? 'start-ski-jumping'
          : getFlyState.isActive
            ? 'landing'
            : 'take-off'
      "
      :disabled="disabled"
      :is-scaled="isScaled"
      @mousedown="performAction"
      @mouseup="endAction"
      @touchstart="performAction"
      @touchend="endAction"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { MobileButton } from '@powerplay/core-minigames-ui'
import { mapGetters } from 'vuex'
import { inputsManager, gsap, modes, tutorialManager } from '@powerplay/core-minigames'
import { disciplinePhasesManager, StartPhaseManager } from '@/app/phases'
import { DisciplinePhases } from '@/app/types'

@Options({
    components: {
        MobileButton
    },
    props: {
        type: {
            type: String,
            default: 'start-ski-jumping'
        },
        disabled: {
            type: Boolean,
            required: false,
            default: 'false'
        },
        isScaled: {
            type: Boolean,
            default: true
        },
        transformOriginProp: {
            type: String,
            default: 'bottom left'
        }
    },
    data () {

        return {
            flickerOpacity: 1,
            tween: undefined
        }
    
    },
    computed: {
        ...mapGetters({
            getFlyState: 'FlightBalanceState/getFlightBalanceState',
            isStart: 'ActionButtonState/isStart',
            flicker: 'StartPhaseState/getFlicker'
        })
    },
    methods: {
        performAction () {
            
            if (this.disabled) return

            if (
                modes.isTutorial() &&
        [4, 5, 6, 7, 8].includes(tutorialManager.getActualSectionId())
            ) {

                return
            
            }
            if (
                this.type === 'take-off' &&
            disciplinePhasesManager.actualPhase === DisciplinePhases.takeoff
            ) {

                this.$store.commit('ActionButtonState/SET_TAKE_OFF', true)
            
            } else if (this.type === 'landing' &&
             disciplinePhasesManager.actualPhase === DisciplinePhases.landing) {

                this.$store.commit('ActionButtonState/SET_LANDING', true)
            
            } else {

                const startPhase = disciplinePhasesManager
                    .getPhaseManager(DisciplinePhases.start) as StartPhaseManager
                if (startPhase.isAfterIntro) {

                    this.$store.commit('ActionButtonState/SET_TOUCH_START', true)
                
                }
            
            }
        
        },
        endAction () {

            // musime dat manulane ukoncenie buttonu, aby sa ukoncil takisto actionPressed v inputs
            inputsManager.handleMouseUp()
        
        },
        startFlicker (): void {

            this.tween = gsap.to(this, {
                flickerOpacity: 0,
                repeat: -1,
                yoyo: true,
                duration: 0.5
            })
        
        }
    },
    watch: {
        flicker: {
            immediate: true,
            handler (value: boolean) {

                if (this.tween === undefined && value) {

                    this.startFlicker()
                
                } else {

          this.tween?.kill()
          this.flickerOpacity = 1
                
                }
            
            }
        }
    }
})
export default class Actionbutton extends Vue {}
</script>

<style>
</style>
