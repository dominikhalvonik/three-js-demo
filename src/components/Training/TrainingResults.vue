<template>
  <div
    class="training-results layout"
  >
    <training-result
      :reward-data="rewardData"
      :training-name="name"
      :training-icon="icon"
      :show-train-again="trainingResultsState.showTrainAgain && otherSituations"
      :disabled-play-again-button="trainingResultsState.isDisabledPlayAgain"
      :high-score="trainingResultsState.bestScore"
      :window-width="windowWidth"
      :window-height="windowHeight"
      :ratio="ratio"
      :is-new-high-score="isNewHighScore()"
      @button-click-play-again="onButtonClickPlayAgain()"
      @button-click-continue="onButtonClickContinue()"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { mapGetters } from 'vuex'
import {
    TrainingResult
} from '@powerplay/core-minigames-ui'
import {
    corePhasesManager,
    requestManager,
    gsap,
    trainingManager,
    game,
    playersManager,
    timeManager,
    modes,
    displayManager
} from '@powerplay/core-minigames'
import type {
    ResponseInit,
} from '@powerplay/core-minigames'
import type { TrainingResultsState } from '@/store/modules/trainingResultsState'
import { pathAssets } from '@/globals/globalvariables'
import { player } from '@/app/Player'
import { trainingTasks } from '@/app/modes/training/TrainingTasks'
import { disciplinePhasesManager } from '@/app/phases'
import { endManager } from '@/app/EndManager'
import { flightBalanceManager } from '@/app/FlightBalanceManager'
import { descentBalanceManager } from '@/app/DescentBalanceManager'
import { windManager } from '@/app/WindManager'
import { endCalculationsManager } from '@/app/EndCalculationsManager'
import { hill } from '@/app/Hill'
import { hillCurveCalculator } from '@/app/HillCurveCalculator'
import { startGateManager } from '@/app/StartGateManager'
import type { SpecialDataFromInit } from '@/app/types'

const rewardDataBackup = () => {

    return {
        stars: 0,

        score: {
            base: 0,
            total: 0,
            bonuses: 0
        },

        bonus: {
            benefits: 0,
            alchemy: 0,
            subscription: 0
        },

        subscription: {
            active: 0,
            tp: 0
        },

        attribute: {
            value_from: 0,
            value_next: 0,
            tp_from: 0,
            tp_new: 0,
            tp_milestone: 0
        },

        energy: {
            value_new_game: 0,
            available: 0
        },

        rewards: [
        ]
    }

}

@Options({
    props: {
    },
    components: {
        TrainingResult
    },
    data () {

        return {
            gsapes: [] as gsap.core.Tween[],
            rewardData: rewardDataBackup()
        }
    
    },
    computed: {
        ...mapGetters({
            trainingResultsState: 'TrainingResultsState/getTrainingResultsState',
            gameState: 'GameState/getGameState'
        }),
        otherSituations () {

            return !this.isTrainer && !this.firstInstruction && !this.gameState.isPrematureEnd
        
        },
        firstInstruction () {

            return corePhasesManager.firstInstructions
        
        },
        isTrainer () {

            return modes.isTrainingWithTrainerMode()
        
        },
        name () {

            console.warn(`disciplineName${requestManager.disciplineID}`)

            return this.$t(`disciplineName${requestManager.disciplineID}`)
            
        },
        icon () {
            
            return `${pathAssets}/ui/table/ICO-DISCIPLINE.png`
            
        },
        windowWidth () {

            return displayManager.width * displayManager.ratio
        
        },
        windowHeight () {

            return displayManager.height * displayManager.ratio
        
        },
        ratio () {

            return displayManager.ratio
        
        }
    },
    methods: {
        onButtonClickPlayAgain () {
            
            console.log('clicked to play again')
            this.$store.commit(
                'TrainingResultsState/SET_STATE_RESULT',
                false
            )
            // TODO: reset game
            if (this.gsapes.length > 0) {

                this.gsapes.forEach((gg: gsap.core.Tween) => gg.kill())
                this.gsapes = []
            
            }
            // Create dark overlay
            this.$store.commit('BlackOverlay/SET_OVERLAY', true)
            trainingTasks.reset()
            flightBalanceManager.reset()
            disciplinePhasesManager.reset()
            descentBalanceManager.reset()
            windManager.reset()
            endCalculationsManager.reset(true)
            timeManager.reset()

            // Get init data
            requestManager.sendInitRequest(
                (data: ResponseInit) => {

                    const dataFromRequest: ResponseInit = data

                    // trening
                    if (dataFromRequest.trainingData) {

                        trainingManager.setUpFromData(dataFromRequest.trainingData)

                    }
                    
                    let startGate = 0
                    if (dataFromRequest.specialData) {
                        
                        const specialData = data.specialData as SpecialDataFromInit
                        startGate = specialData.startGate ?? 0
                        
                    }
                    startGateManager.setStartGateFromServer(startGate)
                
                    trainingTasks.initTraining()

                    playersManager.players = dataFromRequest.players

                    // Reset vsetkych veci - core

                    // TODO: Reset game
                    corePhasesManager.reset()
                
                    requestManager.sendUpdateParamsRequest(() => {

                        this.$store.dispatch('clearStateAll')
                        game.restart()
                        endManager.reset()
                        
                        // prepocitame si startovu poziciu z novych at
                        hillCurveCalculator.calculateSpringBoardCurve(
                            player.recalculateStartingPosition()
                        )
                        // zresetujeme hraca na novu poziciu
                        player.reset()
                        hill.setBenchPosition()
                        player.updateCameraConfigOnStart()
                        
                        corePhasesManager.startFirstPhase()

                        // remove overlay
                   
                        this.$store.commit('BlackOverlay/SET_OVERLAY', false)
                    
                    })
            
                },
                trainingManager.retry
            )
            
        },
        onButtonClickContinue () {
            
            console.log('clicked to continue')
            this.$store.commit(
                'TrainingResultsState/SET_STATE_RESULT',
                false
            )
            corePhasesManager.setNextPhase()
            
        },
        isNewHighScore () {

            return trainingManager.isNewHighScore()
        
        }
    },
    watch: {
        
        trainingResultsState: {
            deep: true,
            handler (value: TrainingResultsState) {

                console.log('VALUE OF STATE', value)

                if (value.showResults && value.dataSet) {

                    this.rewardData = rewardDataBackup()
                    const { data } = this.trainingResultsState
                    
                    const duration = 1
                    const starsDuration = 0.3 * (data.stars ?? 0)
                    
                    let delay = duration + starsDuration + 0.2
                    const rewardsDuration = duration / data.rewards.length

                    this.rewardData.attribute.tp_milestone = data.attribute.tp_milestone
                    this.rewardData.attribute.tp_new = data.attribute.tp_from
                    this.rewardData.attribute.value_from = data.attribute.value_from
                    this.rewardData.attribute.value_next = data.attribute.value_from + 1
                    this.rewardData.bonus = data.bonus

                    const gsaper1 = gsap.to(this.rewardData, {
                        callbackScope: this,
                        duration: duration + starsDuration,
                        stars: data.stars
                    })
                    this.gsapes.push(gsaper1)
                    const gsaper2 = gsap.to(this.rewardData.score, {
                        callbackScope: this,
                        duration,
                        delay,
                        base: data.score.base,
                        total: data.score.total,
                        bonuses: data.score.bonuses
                    })
                    this.gsapes.push(gsaper2)
                    delay += duration
                    
                    // gsap.to(this.rewardData.subscription, {
                    //     callbackScope: this,
                    //     duration,
                    //     active: data.subscription.active,
                    //     tp: data.subscription.tp
                    // })
                    
                    const newMilestone = data.attribute.tp_milestone_new ??
                        data.attribute.tp_milestone
                    
                    const attributeUp = data.attribute.value_from + 1 !== data.attribute.value_next
                    const newValue = attributeUp
                        ? this.rewardData.attribute.tp_milestone
                        : data.attribute.tp_new
                
                    const gsap3 = gsap.to(this.rewardData.attribute, {
                        callbackScope: this,
                        duration,
                        delay,
                        tp_new: newValue,
                        onComplete: () => {
                            
                            if (!attributeUp) return
                        
                            this.rewardData.attribute.tp_new = 0
                            this.rewardData.attribute.tp_milestone = newMilestone
                            this.rewardData.attribute.value_from = data.attribute.value_next - 1
                            this.rewardData.attribute.value_next = data.attribute.value_next
                        
                            gsap.to(this.rewardData.attribute, {
                                callbackScope: this,
                                duration,
                                delay: 0.2,
                                tp_new: data.attribute.tp_new
                            })
                            
                        }
                    })

                    this.gsapes.push(gsap3)
                    
                    // toto davame, ked je vyssi atribut, lebo potrebujeme to dat neskor dalsie
                    if (attributeUp) delay += (duration + 0.2)
                    
                    delay += duration
                    
                    this.rewardData.energy.value_new_game = data.energy.value_new_game
                    this.rewardData.energy.available = data.energy.available
                  
                    let index = 0
                    
                    gsap.timeline({
                        duration: rewardsDuration,
                        repeat: data.rewards.length,
                        delay,
                        onRepeat: () => {

                            this.rewardData.rewards.push(data.rewards[index])
                            index += 1
                        
                        }
                    })
                
                }
            
            }
        }
    }
})

export default class TrainingResults extends Vue {}

</script>

<style lang="less" scoped>
.training-results {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}
</style>
