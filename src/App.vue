<template>
  <structure-component />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import StructureComponent from '@/components/StructureComponent/index.vue'

// Three JS inter-project codes
import { Main } from '@/app/Main'
import { debugConfig } from '@/app/config'
import { MobileDetector } from '@powerplay/core-minigames'

@Options({
    components: {
        StructureComponent
    },
    data () {

        return {
            main: undefined
        }
    
    },
    methods: {
        createMain (): void {

            this.main = new Main()
            if (!this.main) {

                this.$store.commit('ErrorState/SET_STATE', 'App startup error')
            
            }
            this.$store.commit(
                'MobileState/SET_IS_MOBILE',
                MobileDetector.isMobile()
            )

            // eslint-disable-next-line
      if (Number(import.meta.env.VITE_APP_LOCAL)) (window as any).main = this.main;

            if (debugConfig.debugCamera) {

                const wrapper = document.getElementById('game-wrapper')
                if (wrapper) wrapper.style.pointerEvents = 'none'
            
            }
        
        }
    },
    beforeCreate () {

        // TODO: spravit do core-minigames-ui cez install
        this.$setRatio()
    
    },
    created () {

        this.createMain()
    
    }
})
export default class App extends Vue {}
</script>

<style lang="less">
.blur-class {
  filter: blur(4px);
}
body {
  margin: 0px 0px 1px 0px; /* the extra 1px allows the iOS inner/outer check to work */
  padding: 0;
  overflow: hidden;
  color: #000;
  background-color: #000;
  font-size: 16px;
  user-select: none;
  -webkit-font-smoothing: subpixel-antialiased;
  -webkit-tap-highlight-color: transparent;
}

*,
*::before,
*::after {
  font-family: Roboto, serif;
  box-sizing: border-box;
}

#game-wrapper {
  z-index: 100;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

#game-container {
  position: absolute;
  display: block;
  top: 0;
  z-index: 1;
  overflow: hidden;
  background-repeat: repeat-x;
}

#game-container.hidden {
  opacity: 0;
}

#game-container canvas {
  width: 100%;
  height: 100%;
}

#live-layout:not(.mobile) #game-container {
  height: 720px;
}

#live-layout {
  position: absolute;
  left: 0;
  top: 0;
  margin: 0;
  padding: 0;
  background-color: #000;
  background-size: cover;
  width: 100%;
  height: 100%;
  text-align: center;
}

#live-layout:not(.mobile) {
  background: url("https://appspowerplaymanager.vshcdn.net/images/winter-sports/minigame/bg.jpg")
    center;
}

#live-layout:not(.mobile) .live-layout-wrapper {
  position: relative;
  left: 50%;
  top: 50%;
  box-shadow: 4px 2px 5px #333, -4px 2px 5px #333;
  transform: translate(-50%, -50%);
  width: 1280px;
  height: 720px;
  background: #000;
}

#live-layout-wrapper.hidden {
  opacity: 0;
}

.live-layout-wrapper-logo {
  display: none;
}

.mobile.ios:not(.tablet-ios) .live-layout-wrapper {
  position: absolute;
  left: 0;
  top: 0;
}

/*
Icon classes can be used entirely standalone. They are named after their original file names.

Example usage in HTML:

`display: block` sprite:
<div class="icon-home"></div>

To change `display` (e.g. `display: inline-block;`), we suggest using a common CSS class:

// CSS
.icon {
  display: inline-block;
}

// HTML
<i class="icon icon-home"></i>
*/
</style>
