<template>
  <div>
    <div
      class="positioning"
    >
      <div
        :style="[transformCoef]"
      >
        <arrow-animation
          class="arr"
          position="left"
          uniq-name="keyboardKeys"
          :width="250"
          style="position: absolute; top: 35%;"
          :is-scaled="false"
        />
        <circle-balance-bar
          :positions="positions"
          glow
          :glow-style="glowStyle"
          :is-scaled="false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { CircleBalanceBar, ArrowAnimation, WindowAspect } from '@powerplay/core-minigames-ui'
import { mapGetters } from 'vuex'
import { gameConfig } from '@/app/config'

@Options({
    components: {
        CircleBalanceBar,
        ArrowAnimation
    },
    mixins: [WindowAspect],
    computed: {
        ...mapGetters({
            flightBalanceState: 'FlightBalanceState/getFlightBalanceState'
        }),
        positions () {

            return {
                x: 50,
                y: 50
            }
        
        },
        glowStyle () {

            return {
                width: '256px',
                height: '256px',
                left: '2px',
                top: '2px'
            }
        
        },
        heightPercent () {
            
            const actualHeight = this.flightBalanceState.actualHeight
            const percent = actualHeight / gameConfig.heightIndicator.fullHeight
            
            return percent > 1 ? 1 : percent
            
        },
        transformCoef () {

            return {
                transform: `scale(${this.scaleCoef})`,
                transformOrigin: 'center bottom'
            }
        
        }
    }
})

export default class FlightBalanceBar extends Vue {}

</script>

<style lang="less" scoped>
.positioning {
    position: absolute;
    left: 50%;
    bottom: 1%;
    transform: translate(-50%);
}
</style>
