<template>
  <div>
    <power-stick
      :only-horizontal="horizontal"
      :disabled="disabled"
      :is-scaled="isScaled"
      @positionX="changeMovementX"
      @positionY="changeMovementY"
      @endContact="endContact"
    />
  </div>
</template>

<script lang="ts">
import {
    Options, Vue
} from 'vue-class-component'

import { PowerStick } from '@powerplay/core-minigames-ui'
import { inputsManager } from '@powerplay/core-minigames'

@Options({
    props: {
        horizontal: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: true
        },
        isScaled: {
            type: Boolean,
            default: true
        }
    },
    components: {
        PowerStick
    },

    methods: {
        endContact () {

            // musime dat manulane ukoncenie buttonu, aby sa ukoncil takisto actionPressed v inputs
            inputsManager.handleMouseUp()
            this.$store.commit('MovementState/SET_POSITION_X', 0)
            this.$store.commit('MovementState/SET_POSITION_Y', 0)
        
        },
        changeMovementX (positionX: number) {

            if (this.disabled) return

            this.$store.commit('MovementState/SET_POSITION_X', parseFloat(positionX.toFixed(2)))
        
        },
        changeMovementY (positionY: number) {

            if (this.disabled) return

            this.$store.commit('MovementState/SET_POSITION_Y', parseFloat(positionY.toFixed(2)))
        
        }
    }
})

export default class JoyStick extends Vue {}
</script>

<style>

</style>
