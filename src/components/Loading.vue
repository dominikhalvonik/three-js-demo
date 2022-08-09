<template>
  <game-loading
    v-if="show"
    :game-version="version"
  />
</template>

<script lang="ts">
import {
    Options, Vue
} from 'vue-class-component'
import { GameLoading } from '@powerplay/core-minigames-ui'

@Options({
    components: { GameLoading },
    data () {

        return {
            show: true
        }
    
    },
    computed: {
        version () {
            
            return document.getElementById('live-layout')?.getAttribute('data-version') ?? ''
            
        }
    }
})

export default class Loading extends Vue {}
</script>
