<template>
  <div
    v-if="trainingState.firstTutorialMessage"
    class="training-override"
    :class="isMobile() ? 'mobile-training-override' : ''"
    @mousedown.prevent="unpause"
    @mouseleave.prevent=""
    @touchleave.prevent=""
    @touchstart.prevent="unpause"
  >
    <tutorial-anne />
    <tutorial-message-box
      :key="typeWrite"
      :type-write="typeWrite"
      :header-text="$t('anne')"
      :text="$t('training-text-1')"
      :button-yellow-text="$t('clickToContinue')"
      @showFullText="setTypewriteToInactive"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import {
    WindowAspect,
    TutorialAnne,
    TutorialMessageBox
} from '@powerplay/core-minigames-ui'
import { mapGetters } from 'vuex'
import { game } from '@powerplay/core-minigames'

@Options({
    components: {
        TutorialMessageBox,
        TutorialAnne
    },
    data () {

        return {
            typeWrite: true
        }
    
    },
    computed: {
        ...mapGetters({
            trainingState: 'TrainingState/getTrainingState'
        })
    },
    methods: {
        setTypewriteToInactive () {

            this.typeWrite = false
        
        },
        unpause () {

            if (this.typeWrite) {

                this.typeWrite = false
                return
            
            }
            game.resumeGame()
            this.$store.commit('TrainingState/SET_FIRST_TUTORIAL', false)
        
        }
    },
    mixins: [WindowAspect]
})

export default class TrainingLayout extends Vue {}

</script>

<style lang="less" scoped>
.training-override {
    position: absolute;
    z-index: 10000000;
    top:0 ;
    left:0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    
    &.mobile-training-override {
        position: fixed;
    }
}
</style>
