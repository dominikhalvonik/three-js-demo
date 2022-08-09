<template>
  <div>
    <skijump-left-top-info
      :speed="Math.round(speedMeterState.speed)"
      :show-speed="startPhaseState.showSpeed"
      :show-wind="startPhaseState.showWind"
      :first-line="$t('wind')"
      :second-line="startPhaseState.value + ' m/s'"
      :show-third-row="startPhaseState.showCountDown"
      :timer="timer"
      :show-stargate-counter="showStartGate"
      :startgate-actual-gate="startGateState.actual"
      :startgate-all-gates="startGateState.total"
    >
      <template
        #statsTopBoxSlot
      >
        <wind-arrow />
      </template>
    </skijump-left-top-info>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import {
    SkijumpLeftTopInfo
} from '@powerplay/core-minigames-ui'
import WindArrow from './WindArrow.vue'
import { mapGetters } from 'vuex'
import type { StartPhaseState } from '@/store/modules/startPhaseState'
import { modes } from '@powerplay/core-minigames'

@Options({
    components: {
        WindArrow,
        SkijumpLeftTopInfo
    },
    data () {

        return {
            timer: 0
        }
    
    },
    computed: {
        ...mapGetters({
            speedMeterState: 'SpeedMeterState/getSpeedMeterState',
            startPhaseState: 'StartPhaseState/getStartPhaseState',
            startGateState: 'StartGateState/getStartGateState'
        }),
        
        showStartGate (): boolean {
            
            return this.startGateState.showSmall && !modes.isTutorial()
            
        }
    },
    watch: {
        startPhaseState: {
            immediate: true,
            deep: true,
            handler (value: StartPhaseState) {

                if (
                    Math.ceil(value?.counter) !== this.timer
                ) {

                    this.timer = Math.ceil(value?.counter)

                }
            
            }
        }
    }
})
export default class StartStatsBox extends Vue {

}
</script>

<style lang="less" scoped>

.skijump-left-top-info {
    left: 20px;
    top: 20px;
    position: absolute;
}

</style>
