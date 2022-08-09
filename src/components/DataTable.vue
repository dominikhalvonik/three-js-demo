<template>
  <div
    v-if="showTable"
    class="positioner"
  >
    <power-table
      :row-data="dataTable"
      :header-props="headerProps()"
      :active="activeState"
      :is-training="isTraining"
      :is-start-list="isStartList"
      :show-discipline-icon="showDisciplineIcon"
      class="transform-origin-top-center"
      @mousedown="oneClick"
      @touchstart="oneClick"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import {
    requestManager,
    modes,
    trainingManager,
    playersManager
} from '@powerplay/core-minigames'
import { PowerTable } from '@powerplay/core-minigames-ui'
import { mapGetters } from 'vuex'
import { pathAssets } from '@/globals/globalvariables'

@Options({
    name: 'DataTable',
    components: {
        PowerTable
    },
    data () {

        return {
            firstClick: false
            /* headerProps: {
                // time: '3:12:05',
                discipline: {
                    name: 'Downhill',
                    image: require(`${pathAssets}/ui/table/ICO-DISCIPLINE.png`
                },
                // competitonType: 'Test hill'
                resultType: this.$t('')
                // add: {
                //     image: `${pathAssets}/ui/table/Logo-Default.png`,
                //     alt: 'Add-logo'
                // }
            } */
        }
    
    },
    computed: {
        ...mapGetters({
            showTable: 'TableState/getShowTable',
            isStartList: 'TableState/getIsStartList',
            activeState: 'TableState/getActiveState',
            dataTable: 'TableState/getDataTable'
        }),
        isTraining () {

            return modes.isTrainingMode()
        
        },
        showDisciplineIcon () {
            
            return modes.isBossFight()
            
        }
    },
    methods: {
        oneClick (event: Event) {

            if (this.activeState) event.stopPropagation()
        
        },
        headerProps () {

            let time = ''
            if (this.isTraining) {

                time = trainingManager.bestScore.toString()
            
            } else {

                time = `${playersManager.getPlayer().personalBest.toString()}p`
            
            }

            return {
                discipline: {
                    name: this.$t(`disciplineName${requestManager.disciplineID}`),
                    image: `${pathAssets}/ui/table/ICO-DISCIPLINE.png`
                },
                time,
                competitonType: this.$t(this.$store.getters['TableState/getCompetitionText']),
                resultType: this.$t(this.$store.getters['TableState/getResultText']),
                headerTableText: {
                    // col2: 'asdf'
                }
            }
            
        }
    }
    
})

export default class DataTable extends Vue {}
</script>

<style scoped lang="less">
.positioner {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  
  .transform-origin-top-center {
      transform-origin: top center;
      pointer-events: auto;
  }
}
</style>
