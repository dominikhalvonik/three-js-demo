<template>
  <div
    v-if="showTable"
    class="info-component"
    :class="[isMobile() ? 'mobile-info-component' : '']"
  >
    <info-box />
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { InfoBox, WindowAspect } from '@powerplay/core-minigames-ui'
import { mapGetters } from 'vuex'

@Options({
    name: 'InfoComponent',
    components: {
        InfoBox
    },
    computed: {
        ...mapGetters({
            showTable: 'TableState/getShowTable'
        })
    },
    mixins: [WindowAspect]
})

export default class InfoComponent extends Vue {}
</script>

<style lang="less" scoped>
.info-component {
   position: absolute;
   bottom: .5rem;
   width: 100%;
   
   &.mobile-info-component {
       bottom: 2.5rem;
   }
}
</style>
