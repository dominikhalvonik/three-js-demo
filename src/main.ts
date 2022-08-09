import { Buffer } from 'buffer';
window.Buffer = Buffer;

document.getElementById('live-layout').setAttribute('data-version', __APP_VERSION__)

import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import i18n from './i18n'
import '@powerplay/core-minigames-ui/dist/powerframe.css'
import { initializeCoreAndError, setStartTime } from './helpers/initializeCoreAndError'
import { setRatio } from './plugins/setRatio'

setStartTime()
export const app = createApp(App)

initializeCoreAndError()

app.use(store).use(i18n).use(setRatio).mount('#game-wrapper')
