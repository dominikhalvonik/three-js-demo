import { SectionNames, AudioNames } from '../../types'
import { tutorialDefaultStates } from './TutorialDefaultState'
import store from '@/store'
import {
    audioManager, cameraManager,
    CameraStates, tutorialManager, TutorialMessageColors
} from '@powerplay/core-minigames'

/**
 * Informacie pre UI priapdne kontrolne prvky na zmenu UI roznych taskov
*/
export class TutorialUIChange {

    /** Hack lebo nulty task nespusta intro */
    private hack = false

    /** Referencia na vue */
    // eslint-disable-next-line
    private vm!: any;

    /** Meno prave beziacej sekcie */
    private actualSectionName: SectionNames | undefined

    /** Samotny stav ktory chceme vo roznych krokoch tutorialu */
    private uiState = {
        [SectionNames.startSectionFirst]: () => {

            console.log('SECTION FIRST')
            if (!this.hack) {

                store.commit('BlurState/SET_IS_ACTIVE', true)
                this.hack = true

            }
            this.setMobile(true)

        },
        [SectionNames.startSectionSecond]: () => {

            console.log('SECTION SECONDH')
            this.setMobile(false)
            this.resetTypeWrite()
            this.setMessage(true, 'tutorialText3-1')
            this.setAnne(true)
            
            audioManager.play(AudioNames.commentIntro)

        },
        [SectionNames.startSectionThird]: () => {

            console.log('SECTION THIRD')
            const isLeft = store.getters['GameSettingsState/getGameSettingsState'].isLeft
            this.setAnne(true, isLeft)
            this.resetTypeWrite()
            this.setMessage(false, 'tutorialText3-2')
            // Minor trick
            setTimeout(() => {

                this.resetTypeWrite()
                this.setMessage(true, 'tutorialText3-2')

            }, 100)

        },
        [SectionNames.startSectionFourth]: () => {

            console.log('SECTION FORTH')
            this.setMessage(false, '')
            this.setAnne(false)

        },
        [SectionNames.startSectionFifth]: () => {

            console.log('SECTION FIFTH')
            this.resetTypeWrite()
            this.setMessage(true, 'tutorialText3-3', TutorialMessageColors.blank, true)
            const isLeft = !store.getters['GameSettingsState/getGameSettingsState'].isLeft
            this.setAnne(true, isLeft)

        },

        [SectionNames.startSectionSixth]: () => {

            // zmenime store - podla storeu sa zmeny UI

            console.log('SECTION SIXTH')
            this.setMessage(false, '')
            this.setAnne(false)

        },
        [SectionNames.startSectionSeventh]: () => {

            console.log('SECTION SEVENTH')
            this.resetTypeWrite()
            this.setMessage(true, 'tutorialText3-4', undefined, undefined, 'takeOff')
            const isLeft = store.getters['GameSettingsState/getGameSettingsState'].isLeft
            this.setAnne(true, isLeft)

        },
        [SectionNames.startSectionEight]: () => {

            console.log('SECTION EIGHT')
            this.setMessage(false, '')
            this.setAnne(false)

        },
        [SectionNames.startSectionNine]: () => {

            console.log('SECTION Nine')
            this.resetTypeWrite()
            this.setMessage(true, 'tutorialText3-5', TutorialMessageColors.blank, true)
            const isLeft = !store.getters['GameSettingsState/getGameSettingsState'].isLeft
            this.setAnne(true, isLeft)

        },
        [SectionNames.startSectionTen]: () => {

            console.log('SECTION TEN')
            this.setMessage(false, '')
            this.setAnne(false)

        },
        [SectionNames.startSectionEleven]: () => {

            console.log('SECTION ELEVEN')
            this.resetTypeWrite()
            this.setMessage(true, 'tutorialText3-6', TutorialMessageColors.blank, true, 'landing')
            const isLeft = store.getters['GameSettingsState/getGameSettingsState'].isLeft
            this.setAnne(true, isLeft)

        },
        [SectionNames.startSectionTwelve]: () => {

            console.log('SECTION TWELVE')
            this.setMessage(false, '')
            this.setAnne(false)

        },
        [SectionNames.startSectionThirteen]: () => {

            cameraManager.stopTween()
            cameraManager.setState(CameraStates.discipline)
            console.log('SECTION THIRTEEN')
            this.resetTypeWrite()
            this.setMessage(true, 'tutorialText3-7')
            this.setAnne(true)

        },
        [SectionNames.startSectionFourteen]: () => {

            console.log('SECTION FOURTEEN')
            this.setMessage(false, '')
            this.setAnne(false)

        },
        [SectionNames.startSectionFifteen]: () => {

            cameraManager.stopTween()
            cameraManager.setState(CameraStates.discipline)
            console.log('SECTION FIFTEEN')
            this.resetTypeWrite()
            this.setMessage(true, 'tutorialText3-10', TutorialMessageColors.red)
            this.setAnne(true)

        },
        [SectionNames.startSectionSixteen]: () => {

            console.log('SECTION SIXTEEN')
            this.resetTypeWrite()
            this.setMessage(false, '')
            this.setAnne(false)

        },
        [SectionNames.finish]: () => {

            console.log('SECTION FINISH')
            this.resetTypeWrite()
            this.setMessage(true, 'tutorialText3-11', TutorialMessageColors.green)
            this.setAnne(true)

        }

    }

    /**
     * Nastavenie Vue referencie
     * @param vm - vue referencia
     */
    public registerVM (vm: unknown): void {
        
        this.vm = vm
        
    }

    /**
     * Resetnutie typewrite
     */
    private resetTypeWrite (): void {

        tutorialManager.setTypeWriting(true)
        store.commit('TutorialCoreState/SET_TYPE_WRITER', true)
    
    }
    
    /**
     * Zena UI podla aktualnej sekcie
     * @param sectionName - Meno aktualnej sekcie
     */
    private changeUi (sectionName: SectionNames): void {

        this.uiState[sectionName]()

    }

    /**
     * Inicializovanie
     */
    public init (): void {

        // Ak bude treba.

    }

    /**
     * Hlavna logika ui zmeny
     */
    private tutorialUILogic (): void {

        const sectionName = tutorialManager.getActualSectionName() as SectionNames
        if (sectionName && sectionName !== this.actualSectionName) {

            this.changeUi(sectionName)
            this.actualSectionName = sectionName

        }

    }

    /**
     * Public metoda do game loopu
     */
    public update (): void {

        tutorialDefaultStates.update()
        this.tutorialUILogic()

    }

    public setMobile (
        show: boolean
    ): this {

        store.commit('TutorialState/SET_MOBILE', {
            show
        })
        return this

    }

    public setAnne (
        showAnne: boolean,
        isRight = false
    ): this {

        store.commit('TutorialState/SET_ANNE', {
            showAnne,
            isRight
        })
        return this

    }

    /**
     * Nastavenie hlasky pre tutorial
     * @param showMessage - ci sa ma zobrazit hlaska
     * @param message - text
     * @param color - farba
     * @param offset - offset
     * @param yellowTextSpecial - specialny text klikni na XYZ
     * @returns this
     */
    public setMessage (
        showMessage: boolean,
        message = '',
        color = TutorialMessageColors.blank,
        offset = false,
        yellowTextSpecial = ''
    ): this {

        let yellowText = this.vm.$i18n.t('clickToContinue')
        if (yellowTextSpecial) {
            
            yellowText = this.vm.$i18n.t('tapToButton').replace(
                '[BUTTON]',
                this.vm.$i18n.t(yellowTextSpecial)
            )
            
        }
        
        store.commit(
            'TutorialState/SET_MESSAGE',
            { showMessage, message, color, offset, yellowText }
        )
        return this

    }

}

export const tutorialUIChange = new TutorialUIChange()
