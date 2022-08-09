/**
 * Mena sekcie
 */
export enum SectionNames {
    startSectionFirst = 'startSkijumpFirst',
    startSectionSecond = 'startSkijumpSecond',
    startSectionThird = 'startSkijumpThird',
    startSectionFourth = 'startSkijumpFourth',
    startSectionFifth = 'startSkijumpFifth',
    startSectionSixth = 'startSkijumpSixth',
    startSectionSeventh = 'startSkijumpSeventh',
    startSectionEight = 'startSkijumpEight',
    startSectionNine = 'startSkijumpNine',
    startSectionTen = 'startSkijumpTen',
    startSectionEleven = 'startSkijumpEleven',
    startSectionTwelve = 'startSkijumpTwelve',
    startSectionThirteen = 'startSkijumpThirteen',
    startSectionFourteen = 'startSkijumpFourteen',
    startSectionFifteen= 'startSkijumpFifteen',
    startSectionSixteen = 'startSkijumpSixteen',
    finish = 'finish'
}

type NameKeys = keyof typeof SectionNames;
type NameKeyFields = {[key in NameKeys]: string}

export interface UiState extends NameKeyFields {
    NameKeyFields: () => void
}

export enum TutorialEventType {
    jumpEvent = 'jumpEvent',
    landEvent = 'landEvent',
    finishEvent = 'finishEvent',
    awaitingEvent = 'awaitingEvent'
}

export enum TutorialObjectiveIds {
    speed = 'tutorialTask3-1',
    jump = 'tutorialTask3-2',
    jumpLength = 'tutorialTask3-3',
    landing = 'tutorialTask3-4'
}
