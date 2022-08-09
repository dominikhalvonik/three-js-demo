<template>
  <section class="positioner">
    <div
      :style="[transformCoef]"
      class="origin-top-left"
    >
      <arrow-animation
        :class="isMobile() ? 'arr' : 'arr-nomobile'"
        position="left"
        uniq-name="keyboardKeys"
        :width="isMobile() ? 500 : 350"
        :height="300"
        :is-scaled="false"
      />
      <skijump-left-top-info
        :show-wind="true"
        class="reposition"
        :first-line="$t('wind')"
        :second-line="0.5 + ' m/s'"
        :glow="true"
        :is-scaled="false"
      >
        <template #statsTopBoxSlot>
          <wind-arrow />
        </template>
      </skijump-left-top-info>
    </div>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import {
    WindowAspect,
    ArrowAnimation,
    SkijumpLeftTopInfo
} from '@powerplay/core-minigames-ui'
import StartStatsBox from '../StartStatsBox.vue'
import WindArrow from '../WindArrow.vue'

@Options({
    name: 'TutorialStartBox',
    components: {
        StartStatsBox,
        ArrowAnimation,
        SkijumpLeftTopInfo,
        WindArrow
    },
    mixins: [WindowAspect],
    computed: {
        
        transformCoef () {

            return {
                transform: `scale(${this.scaleCoef}) translate(0, 0)`
            }
        
        }
    }
})
export default class TutorialStartBox extends Vue {}
</script>

<style lang="less">
.positioner {
  position: relative;
  
  .origin-top-left {
      transform-origin: top left;
  }

  .arr {
    position: absolute;
    top: 120px;
    width: 500px;
    height: 120px;
  }
  
  .arr-nomobile {
    position: absolute;
    top: 135px;
    left: 80px;
    width: 500px;
    height: 120px;
  }

  .reposition {
    position: absolute;
    top: 3%;
    left: 1%;
  }
}
</style>
