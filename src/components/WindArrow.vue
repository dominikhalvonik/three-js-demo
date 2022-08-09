<template>
  <div class="wind-arrow-wrapper">
    <span
      class="wind-arrow"
      :class="[isRed ? 'red-arrow' : 'green-arrow']"
      :style="[{transform: rotateValue}]"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { mapGetters } from 'vuex'
import { WindDirection } from '../app/types'

@Options({
    props: {
        
    },
    computed: {
        ...mapGetters({
            startPhaseState: 'StartPhaseState/getStartPhaseState'
        }),
        isRed () {

            // zelena sipka = ak je smer vetra E, NE, N, NW a W
            let result = false
            
            if (
                Number(WindDirection[this.startPhaseState.direction]) > 2 &&
                Number(WindDirection[this.startPhaseState.direction]) < 6
            ) {

                result = true
            
            }
            return result
        
        },
        rotateValue () {
            
            const deg = (Number(WindDirection[this.startPhaseState.direction]) + 2) * -45
            
            return `rotate(${deg}deg)`
        
        }
    }
})

export default class WindArrow extends Vue {
}

</script>

<style lang="less" scoped>

@assets-url: 'https://appspowerplaymanager.vshcdn.net/images/winter-sports/minigame/ski-jumping/ui';

.wind-arrow-wrapper {
    display: inline-block;
    margin-right: 20px;
}
.wind-arrow {
    width: 32px;
    height: 26px;
    display: inline-block;
    
}
.red-arrow {
    background: url("@{assets-url}/RED-ARROW-LEFT.png") center;
}
.green-arrow {
    background: url("@{assets-url}/GREEN-ARROW-LEFT.png") center;
}
</style>
