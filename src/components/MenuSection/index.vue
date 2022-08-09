<template>
  <section
    class="menu"
    @mousedown.stop=""
    @mouseup.stop=""
    @touchstart.stop=""
    @touchend.stop=""
    @click.stop=""
  >
    <menu-overlay v-if="showOverlay" />
    <menu-icon-component
      v-show="showMenu"
      :toggle-automatic="settingsOpenAutomatic || keyOpenMenu"
      class="layout-menu pointer-events-auto"
      :show-exit="showExit"
      :exit-flashing="settingsOpenAutomatic"
      @onToggle="onToggle"
      @settings-action="openSettings"
      @instructions-action="toggleInstructions(true)"
      @exit-action="exitOpen = true"
    />
    <instruction-component
      v-if="instructionsState"
      :is-mobile="isMobile"
      @close-instructions="toggleInstructions(false)"
    />
    <exit-discipline-modal
      v-if="exitOpen"
      :is-training="isTraining"
      :is-tutorial="isTutorial"
      class="pointer-events-auto"
      @yes="actionExit"
      @back="closeExit"
    />
    <settings-modal
      v-if="settingsOpen"
      class="pointer-events-auto"
      :show-graphics-settings="!isAppWsm"
      @close="closeSettings"
      @settings-change="setThings"
    />
  </section>
</template>

<script lang="ts">
import {
    Options, Vue
} from 'vue-class-component'

import { Menu, ExitDisciplineModal, SettingsModal, MenuOverlay } from '@powerplay/core-minigames-ui'
import InstructionComponent from './InstructionComponent/index.vue'
import {
    game, requestManager, gameStats, settings, SettingsTypes, modes, tutorialManager
} from '@powerplay/core-minigames'
import { mapGetters } from 'vuex'
import { disciplinePhasesManager } from '@/app/phases'
import store from '@/store'

@Options({
    props: {
        isMobile: {
            type: Boolean,
            required: true
        },
        isAppWsm: {
            type: Boolean,
            required: true
        },
        showOverlay: {
            type: Boolean,
            required: false
        }
    },
    components: {
        MenuIconComponent: Menu,
        ExitDisciplineModal,
        SettingsModal,
        InstructionComponent,
        MenuOverlay
    },
    data () {

        return {
            settingsOpen: false,
            exitOpen: false,
            showExit: true,
            keyOpenMenu: false
        }
    
    },
    computed: {
        ...mapGetters({
            gameSettingsState: 'GameSettingsState/getGameSettingsState',
            instructionsState: 'InstructionsState/getShowInstructions',
            settingsOpenAutomatic: 'TutorialState/getSettings',
            exitPressed: 'InputsState/getExitPressed'
        }),
        showMenu () {

            return !(this.settingsOpen || this.exitOpen || this.instructionsState)
        
        },
        isTraining () {
            
            return modes.isTrainingMode()
            
        },
        isTutorial () {
            
            return modes.isTutorial()
            
        }
    },
    methods: {
        actionExit (): void {
            
            if (gameStats.wasExitedGame()) {

                requestManager.redirect()
                return
            
            }
            
            gameStats.setExitedGame(true)
            disciplinePhasesManager.prematureEnded = true
            this.exitOpen = false
            
            // predcasne ukoncenie
            // game.pauseGame()
            game.prematureFinishGame(disciplinePhasesManager.disciplinePrematureEnd)
            
            store.commit('GameState/SET_STATE', {
                isPrematureEnd: true
            })

            if (modes.isTutorial()) {

                store.commit('LoadingCircleState/SET_STATE', {
                    isActive: true
                })
            
            }
            
        },
        closeExit (): void {

            this.exitOpen = false
        
        },
        closeSettings (): void {

            this.settingsOpen = false
            this.setThings()
            settings.saveValues()
            tutorialManager.blockInputsManually()
        
        },
        openSettings (): void {

            this.$store.commit('GameSettingsState/SET_STATE', {
                graphicsSettings: settings.getSetting(SettingsTypes.quality)
            })
            
            this.settingsOpen = true
        
        },
        toggleInstructions (value: boolean): void {

            this.$store.commit('InstructionsState/SET_INSTRUCTIONS_VISIBILITY', value)
        
        },
        setThings (): void {
            
            settings.update(
                'quality', this.gameSettingsState.graphicsSettings
            )
            settings.update(
                'sounds', this.gameSettingsState.volume ? 1 : 0
            )
            settings.update(
                'qualityAuto', this.gameSettingsState.graphicsAuto ? 1 : 0
            )
            settings.update(
                'isLeft', this.gameSettingsState.isLeft ? 1 : 0
            )
            
        },
        onToggle (isOpen: boolean): void {

            this.keyOpenMenu = isOpen
            this.$emit('toggle-ui', this.keyOpenMenu)
        
        }
    },
    watch: {
        // pridat s novym modalom vzdy premennu na otvaranie modalu
        settingsOpen () {

            this.$emit('toggle-ui', this.settingsOpen)
        
        },
        exitOpen () {

            this.$emit('toggle-ui', this.exitOpen)
        
        },
        instructionsState () {
            
            this.$emit('toggle-ui', this.instructionsState)
        
        },
        exitPressed (newValue) {

            if (newValue) {
                
                this.keyOpenMenu = !this.keyOpenMenu
                
                if (this.settingsOpen) {

                    this.keyOpenMenu = false
                    this.closeSettings()
                
                }
                if (this.exitOpen) {

                    this.keyOpenMenu = false
                    this.closeExit()
                
                }
                if (this.instructionsState) {

                    this.keyOpenMenu = false
                    this.toggleInstructions(false)
                
                }
            
            }
        
        }
    }/* ,
    mounted () {
        
        if (requestManager.TUTORIAL_ID) this.showExit = false
    
    } */
})

export default class MenuSection extends Vue {}
</script>

<style scoped lang="less">
.layout-menu {
    position: absolute;
    top: 1%;
    right: 1%;
}
</style>
