<template>
  <section
    class="positioner"
  >
    <fps-looker />
  </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { FpsLooker } from '@powerplay/core-minigames-ui'

@Options({
    name: 'FpsLookerComponent',
    components: {
        FpsLooker
    }
})

export default class FpsLookerComponent extends Vue {}
</script>

<style lang="less" scoped>
  .positioner {
    position: absolute;
    left: 50%;
    top: 0;
    width: 15%;
    height: 10%;
    pointer-events: auto;
    transform: translate(-50%);
  }
</style>
