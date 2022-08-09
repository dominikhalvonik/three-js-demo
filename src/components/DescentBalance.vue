<template>
  <div
    v-if="isBalanceActive"
    class="balance-positioning"
  >
    <horizontal-balance-bar
      :number-location="balanceStateValue"
      :style="{transformOrigin: 'bottom center'}"
    />
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { mapGetters } from 'vuex'
import { HorizontalBalanceBar } from '@powerplay/core-minigames-ui'

@Options({
    components: {
        HorizontalBalanceBar
    },
    computed: {
        ...mapGetters({
            isBalanceActive: 'DescentBalanceState/getBalanceActiveState',
            balanceStateValue: 'DescentBalanceState/getBalanceValue'
        })
    }
})

export default class DescentBalanceBar extends Vue {}

</script>

<style lang="less" scoped>
.balance-positioning {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%)
}
</style>
