<template>
  <div
    v-if="flightBalanceState.isActive"
    class="positioning"
  >
    <circle-balance-bar
      :positions="positions"
      :is-height-enabled="isHeightEnabled"
      :height-percent="heightPercent"
      style="transform-origin: center bottom"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { mapGetters } from 'vuex'
import { flightConfig } from '../app/config/flightConfig'
import { CircleBalanceBar, WindowAspect } from '@powerplay/core-minigames-ui'
import { gameConfig } from '@/app/config'

@Options({
    components: {
        CircleBalanceBar
    },
    mixins: [WindowAspect],
    computed: {
        ...mapGetters({
            flightBalanceState: 'FlightBalanceState/getFlightBalanceState'
        }),
        positions () {

            return {
                x: this.positionX,
                y: this.positionY
            }
        
        },
        positionX () {
            
            const valX = (this.flightBalanceState.valueX - flightConfig.originValue) * 0.02
            const valY = (this.flightBalanceState.valueY - flightConfig.originValue) * 0.02
            
            const posX = valX * Math.sqrt(1 - Math.pow(valY, 2) / 2) / 2 * 100
            
            return posX + flightConfig.originValue
        
        },
        positionY () {
                        
            const valX = (this.flightBalanceState.valueX - flightConfig.originValue) * 0.02
            const valY = (this.flightBalanceState.valueY - flightConfig.originValue) * 0.02
            const posY = valY * Math.sqrt(1 - Math.pow(valX, 2) / 2) / 2 * 100
            
            return 100 - (posY + flightConfig.originValue)
        
        },
        isHeightEnabled () {
            
            return gameConfig.heightIndicator.enabled
            
        },
        heightPercent () {
            
            const actualHeight = this.flightBalanceState.actualHeight
            const percent = actualHeight / gameConfig.heightIndicator.fullHeight
            
            return percent > 1 ? 1 : percent
            
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
