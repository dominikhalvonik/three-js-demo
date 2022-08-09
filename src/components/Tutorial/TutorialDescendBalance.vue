<template>
  <div
    class="balance-positioning"
  >
    <div
      :style="[transformCoef]"
    >
      <arrow-animation
        class="arr"
        position="left"
        uniq-name="keyboardKeys"
        :width="750"
        style="position: absolute; top: 30%"
        :is-scaled="false"
      />
      <horizontal-balance-bar
        glow
        :number-location="50"
        :style="{transformOrigin: 'bottom center'}"
        :is-scaled="false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import {
    HorizontalBalanceBar,
    ArrowAnimation,
    WindowAspect
} from '@powerplay/core-minigames-ui'

@Options({
    components: {
        HorizontalBalanceBar,
        ArrowAnimation
    },
    mixins: [WindowAspect],
    computed: {
        transformCoef () {

            return {
                transform: `scale(${this.scaleCoef}) translate(0, 0)`,
                transformOrigin: 'center bottom'
            }
        
        }
    }
})
export default class DescentBalanceBar extends Vue {}
</script>

<style lang="less" scoped>
.balance-positioning {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
