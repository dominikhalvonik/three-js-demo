<template>
  <div class="training-layout">
    <training-left-top-box
      :text="$t('highScore')"
      :points="highScore"
      :tasks="trainingState.tasks"
      :max-t-p-length="maxTPLength"
    />
    <training-blue-box
      v-if="trainingState.showNewHighScore"
      :points="String(trainingState.newHighScore)"
      :text="$t('newHighScore')"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { mapGetters } from 'vuex'
import {
    TrainingLeftTopBox,
    TrainingBlueBox
    
} from '@powerplay/core-minigames-ui'
import { trainingManager } from '@powerplay/core-minigames'

@Options({
    props: {
    },
    components: {
        TrainingLeftTopBox,
        TrainingBlueBox
    },
    computed: {
        ...mapGetters({
            trainingState: 'TrainingState/getTrainingState'
        }),
        highScore (): string {

            return String(trainingManager.bestScore)
        
        },
        maxTPLength () {
            
            return trainingManager.getTpPerTask().toString().length
        
        }

    }
})

export default class TrainingLayout extends Vue {}

</script>

<style lang="less" scoped>
.training-layout {
    position: absolute;
    left: 30px;
    top: 30px;
    width: 100%;
    height: 100%;
    
    .training-blue-box {
        position: absolute;
        top: calc(50% - 30px);
        left: calc(50% - 30px);
    }
}
</style>
