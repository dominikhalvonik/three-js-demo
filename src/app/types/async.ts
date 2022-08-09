/** Data pre jeden skok pre request */
export type JumpResultForRequest = {
    
    meters: number,
    points: number,
    /* eslint-disable */
    points_distance: number,
    points_style: number,
    compensation_wind: number
    /* eslint-enable */
    
}

/** Data, ktore sa posielaju na server v save results requeste */
export type SaveResultsDataToSend = {
    
    jumps: JumpResultForRequest[],
    positions: string[]
    trainingResults?: number[],
    perfectTakeoffs: number,
    telemarks: number
    
}
