<template>
  <div class="finish-top-box">
    <div class="spacer" />
    <blue-box
      v-if="showFirstBox"
      :style="{height: 'auto', width: '900px'}"
    >
      <div
        v-if="firstPlace"
        class="finish-top-box-yellow finish-top-box-top-padding"
      >
        {{ $t('congratulations') }}
      </div>
      <div
        v-if="position === 1"
        class="finish-top-box-big-white finish-top-box-full-padding"
      >
        {{ $t('winner') }}
      </div>
      <div
        v-else
        class="finish-top-box-big-white finish-top-box-full-padding"
      >
        {{ $t('rankX').replace('%s', position) }}
      </div>
    </blue-box>
    <blue-box
      v-if="showSecondBox"
      :style="{height: 'auto', width: '900px'}"
      :show-border="true"
    >
      <div
        v-if="personalBest"
        class="finish-top-box-yellow finish-top-box-bottom-padding"
      >
        {{ $t('personalBest') }}
      </div>
      <div
        v-if="newPersonalBest"
        class="finish-top-box-yellow finish-top-box-bottom-padding"
      >
        {{ $t('newPersonalBest') }}
      </div>
    </blue-box>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { mapGetters } from 'vuex'
import {
    BlueBox
} from '@powerplay/core-minigames-ui'

@Options({
    props: {
        showFirstBox: {
            type: Boolean,
            required: false,
            default: false
        },
        showSecondBox: {
            type: Boolean,
            required: false,
            default: false
        },
        firstPlace: {
            type: Boolean,
            required: false,
            default: false
        },
        personalBest: {
            type: Boolean,
            required: false,
            default: false
        },
        newPersonalBest: {
            type: Boolean,
            required: false,
            default: false
        },
        position: {
            type: Number,
            required: true
        }
    },
    components: {
        BlueBox
    },
    computed: {
        ...mapGetters({
        })
    }
})

export default class FinishTopBox extends Vue {}

</script>

<style lang="less" scoped>
    .blue-box {
        height: auto;
        left: 50%;
        top: 5%;
        text-transform: uppercase;
    }
    .spacer {
        padding: 35px 0 25px;
        text-shadow: 0.6px 0.8px 0.9px rgba(0, 0, 0, 0.71);
        font-family: Roboto;
        font-size: 30px;
        font-weight: bold;
        font-style: italic;
        color: #ffffff;
    }
    
    .finish-top-box-yellow {
        text-shadow: 0.6px 0.8px 0.9px rgba(0, 0, 0, 0.71);
        font-family: Roboto;
        font-size: 36px;
        line-height: 36px;
        font-weight: bold;
        font-style: italic;
        color: #fadd1e;
    }
    
    .finish-top-box-medium-white {
        
        text-shadow: 0.6px 0.8px 0.9px rgba(0, 0, 0, 0.71);
        font-family: Roboto;
        font-size: 48px;
        line-height: 48px;
        font-weight: bold;
        font-style: italic;
        color: #ffffff;
    }
    
    .finish-top-box-big-white {
        text-shadow: 0.6px 0.8px 0.9px rgba(0, 0, 0, 0.71);
        font-family: Roboto;
        font-size: 60px;
        line-height: 60px;
        font-weight: bold;
        font-style: italic;
        color: #ffffff;
    }
    
    .finish-top-box-full-padding {
        padding: 20px 0;
    }
    
    .finish-top-box-top-padding {
        padding: 20px 0 0;
    }
    
    .finish-top-box-bottom-padding {
        padding: 20px 0 20px;
    }
</style>
