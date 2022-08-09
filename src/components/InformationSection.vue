<template>
  <full-info
    v-if="showElement"
    class="information"
    :element-data="infoData"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { FullInfo } from '@powerplay/core-minigames-ui'
import { playersManager } from '@powerplay/core-minigames'
import { mapGetters } from 'vuex'
// import InformationState from '@/store/modules/informationState'

@Options({
    components: {
        FullInfo
    },
    computed: {
        ...mapGetters({
            showElement: 'InformationState/getShowState',
            informationState: 'InformationState/getInformationState'
        }),
        infoData: function () {

            return {
                opinionInfo: this.informationState.opinionInfo,
                playerObject: {
                    points: this.informationState.points,
                    length: this.informationState.meters,
                    name: playersManager.players[0].name,
                    position: playersManager.getPlayerActualPosition(),
                    country: playersManager.players[0].country,
                    countryString: playersManager.players[0].countryString,
                    secondLength: this.informationState.secondLength
                },
                wind: this.informationState.wind
            }
        
        }
    }
})

export default class InformationSection extends Vue {}
</script>

<style lang="less" scoped>
.information {
    position: absolute;
    bottom: 20px;
    right: 30px;
    transform-origin: bottom right;
}
</style>
