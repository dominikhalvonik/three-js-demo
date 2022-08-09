<template>
  <div
    v-if="startPhaseState.showPlayerInfo"
    class="positioner"
  >
    <player-info-avatar
      v-if="startPhaseState.showName"
      :texts="getTexts"
      :is-training="isTraining"
      :background-id="getAvatarBackgroundId"
      :avatar-id="getAvatarId"
      :sex="getSex"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { mapGetters } from 'vuex'
import { playersManager, trainingManager, modes } from '@powerplay/core-minigames'
import { PlayerInfoAvatar } from '@powerplay/core-minigames-ui'
import { endCalculationsManager } from '@/app/EndCalculationsManager'

@Options({
    components: {
        PlayerInfoAvatar
    },
    computed: {
        ...mapGetters({
            startPhaseState: 'StartPhaseState/getStartPhaseState'
        }),
        getTexts () {

            let additionlInfo
            if (this.isTraining) {
                
                additionlInfo = trainingManager.bestScore.toString()
            
            } else {
                
                const distance = endCalculationsManager.getTargetDistanceToWin(false)
                additionlInfo = `${distance.toFixed(1)}m`
                
            }
            
            return {
                name: playersManager.players[0].name,
                country: playersManager.players[0].country.toLowerCase(),
                countryString: playersManager.players[0].countryString,
                additionlInfo,
                attempt: this.startPhaseState.attempt
            }
            
        },
        isTraining () {

            return modes.isTrainingMode()
        
        },
        getAvatarBackgroundId () {

            const avatarBg = playersManager.getPlayer().avatarBg
            return avatarBg === undefined ? 1 : Number(avatarBg)
        
        },
        getAvatarId () {

            const avatar = playersManager.getPlayer().avatar
            return avatar === undefined ? 1 : Number(avatar)
        
        },
        getSex () {

            return playersManager.getPlayer().sex
        
        }

    }
})
export default class PhaseStart extends Vue {

}
</script>

<style lang="less" scoped>
.positioner {
  position: absolute;
  bottom: 2.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}
</style>
