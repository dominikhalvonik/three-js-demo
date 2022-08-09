<template>
  <landing-box
    v-if="landingState.isActive"
    class="landing-box"
    :color="landingState.color"
    :text1="$t(landingState.text)"
    :text2="landingState.meters"
    :text3="$t(landingState.personalBestText)"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { LandingBox } from '@powerplay/core-minigames-ui'
import { mapGetters } from 'vuex'

@Options({
    components: {
        LandingBox
    },
    computed: {
        ...mapGetters({
            landingState: 'LandingState/getLandingState'
        })
    }
})

export default class LandingComponent extends Vue {}
</script>

<style lang="less" scoped>
.landing-box {
  position: absolute;
  left: 50%;
  bottom: 5%;
}
</style>
