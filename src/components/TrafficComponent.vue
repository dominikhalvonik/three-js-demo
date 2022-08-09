<template>
  <traffic-light-box
    v-if="takeoffState.isActive"
    class="traffic-light-box"
    :color="takeoffState.color"
    :text="$t(takeoffState.text)"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { mapGetters } from 'vuex'
import { TrafficLightBox } from '@powerplay/core-minigames-ui'

@Options({
    components: {
        TrafficLightBox
    },
    computed: {
        ...mapGetters({
            takeoffState: 'TakeoffState/getTakeoffState'
        })
    }
})

export default class TrafficComponent extends Vue {}
</script>

<style lang="less" scoped>
.traffic-light-box{
    position: absolute;
    left: 50%;
    top: 5%;
}
</style>
