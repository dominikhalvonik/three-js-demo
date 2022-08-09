export const marksConfig = {
    
    /** base mark */
    baseMark: 12,
    
    /** style coef */
    styleCoef: 6,
    
    /** po kolkych metroch davame inu hodnotu styleMark */
    styleMarkRangeTreshold: 145,
    
    /** styleMark nad hodnotu treshold */
    styleMarkRangeAboveTreshold: 0.5,
    
    /** styleMark pod hodnotu treshold */
    styleMarkRangeBelowTreshold: 1,
    
    /** bonus za prekonanie kPointu */
    kPointBonus: 1,
    
    /** bonus za prekonanie hs */
    hillSizeBonus: 1,
    
    /** nastavenie postihov pri hand touch */
    penaltiesHandTouch: [
        
        { from: 0, to: 100, points: -3.5 },
        { from: 100, to: 110, points: -3 },
        { from: 110, to: 115, points: -2.5 },
        { from: 115, to: 120, points: -2 },
        { from: 120, to: 125, points: -1.5 },
        { from: 125, to: 999, points: -2 }
        
    ],
    
    /** nastavenie postihov pri pade */
    penaltiesFall: [
        
        { from: 0, to: 100, points: -5.5 },
        { from: 100, to: 110, points: -5 },
        { from: 110, to: 115, points: -4.5 },
        { from: 115, to: 120, points: -4 },
        { from: 120, to: 125, points: -3.5 },
        { from: 125, to: 999, points: -4 }
        
    ]
    
}
