import type { App } from 'vue'

export const setRatio = {
    install: (app: App): void => {

        app.config.globalProperties.$setRatio = (): void => {

            // tablet nastavujeme podla sirky, mobil podla vysky
            let ratio: number

            /* isTablet */
            if (window.innerWidth / window.innerHeight <= 1.6) {

                ratio = window.innerWidth / 1920
                // this.tablet = MobileDetector.isMobile()
       
            } else {

                ratio = window.innerHeight / 1080
       
            }
       
            // dame na 2 desatinne miesta
            ratio = Math.ceil(ratio * 100) / 100

            // aby sme nezoomovali nad 1
            if (ratio > 1) ratio = 1

            const viewport: HTMLElement | null = document.getElementById('Viewport')
            if (viewport) {

                const initialScale = `initial-scale=${ratio}`
                const widthHeight = `width=${window.innerWidth}, height=${window.innerHeight}`

                viewport.setAttribute(
                    'content',
                    `viewport-fit=cover, ${initialScale}, user-scalable=no, ${widthHeight}`
                )
       
            }
        
        }
    
    }
}
