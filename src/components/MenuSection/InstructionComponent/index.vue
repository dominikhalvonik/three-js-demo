<template>
  <instructions-component
    class="pointer-events-auto midder"
    :header="$t('instructions')"
    :button-text="$t('continue')"
    :cards="getInstructions"
    show-button
    @button-click="closeInstructions"
  />
</template>

<script lang="ts">
import {
    Options, Vue
} from 'vue-class-component'
import { Instructions } from '@powerplay/core-minigames-ui'
import { mapGetters } from 'vuex'
import { CorePhases, corePhasesManager, modes } from '@powerplay/core-minigames'
import { pathAssets } from '@/globals/globalvariables'

@Options({
    components: {
        InstructionsComponent: Instructions
    },
    props: {
        isMobile: {
            type: Boolean,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            showButton: 'InstructionsState/getShowButton'
        }),
        getInstructions () {
            
            this.$store.commit('BlurState/SET_IS_ACTIVE', true)
            
            if (modes.isTrainingMode()) {
                
                return [
                    {
                        imgSrc: `${pathAssets}/ui/instructions/training-1.png?3`,
                        header: this.$t('instructionsDisciplineTraining3Cell1Title'),
                        text: [this.$t('instructionsDisciplineTraining1Cell1Text1')]
                    },
                    {
                        imgSrc: `${pathAssets}/ui/instructions/training-2.png?3`,
                        header: this.$t('instructionsDisciplineTraining3Cell2Title'),
                        text: [this.$t('instructionsDisciplineTraining3Cell2Text1')]
                    },
                    {
                        imgSrc: `${pathAssets}/ui/instructions/training-3.png?3`,
                        header: this.$t('instructionsDisciplineTraining3Cell3Title'),
                        text: [this.$t('instructionsDisciplineTraining3Cell3Text1')]
                    },
                    {
                        imgSrc: `${pathAssets}/ui/instructions/training-4.png?3`,
                        header: this.$t('instructionsDisciplineTraining3Cell4Title'),
                        text: [this.$t('instructionsDisciplineTraining3Cell4Text1')]
                    }
                ]
                
            }
            
            return [
                {
                    imgSrc: `${pathAssets}/ui/instructions/instructions-1.png?3`,
                    header: this.$t('instructionsDiscipline3Cell1Title'),
                    text: [
                        this.$t('instructionsDiscipline3Cell1Text1'),
                        this.$t('instructionsDiscipline3Cell1Text2')
                    ]
                },
                {
                    imgSrc: `${pathAssets}/ui/instructions/instructions-2.png?3`,
                    header: this.$t('instructionsDiscipline3Cell2Title'),
                    text: [this.$t('instructionsDiscipline3Cell2Text1')]
                },
                {
                    imgSrc: `${pathAssets}/ui/instructions/instructions-3.png?3`,
                    header: this.$t('instructionsDiscipline3Cell3Title'),
                    text: [this.$t('instructionsDiscipline3Cell3Text1')]
                },
                {
                    imgSrc: `${pathAssets}/ui/instructions/instructions-4.png?3`,
                    header: this.$t('instructionsDiscipline3Cell4Title'),
                    text: [this.$t('instructionsDiscipline3Cell4Text1')]
                },
                {
                    imgSrc: `${pathAssets}/ui/instructions/instructions-5.png?3`,
                    header: this.$t('instructionsDiscipline3Cell5Title'),
                    text: [this.$t('instructionsDiscipline3Cell5Text1')]
                },
                {
                    imgSrc: `${pathAssets}/ui/instructions/instructions-6.png?3`,
                    header: this.$t('instructionsDiscipline3Cell6Title'),
                    text: [this.$t('instructionsDiscipline3Cell6Text1')]
                }
            ]
            
        }
    },
    methods: {
        closeInstructions (): void {
                  
            // pokial mame prvotne instrukcie, tak ich zavrieme
            if (corePhasesManager.isActivePhaseByType(CorePhases.instructions)) {
                
                corePhasesManager.getActualPhase()?.finishPhase()
                
            }
            this.$emit('close-instructions')
            
        }
    }

})

export default class InstructionComponent extends Vue {}

</script>

<style lang="less" scoped>
.time-keeper {
    position: absolute;
    top: 17%;
    right: 30px;
}

.instruciton-card-photo{
    width: 343px;
    height: 229px;
}
</style>
