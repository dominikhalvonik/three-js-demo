<template>
  <div class="hud">
    <div class="info">
      <div>HUD</div>
      <div>--</div>
      <div>WIND</div>
      <div>speed: {{ startPhaseState.value }}</div>
      <div>direction: {{ startPhaseState.direction }}</div>
      <div>--</div>
      <div>VELOCITY</div>
      <div>x: {{ velocityState.velocityX.toFixed(4) }}</div>
      <div>y: {{ velocityState.velocityY.toFixed(4) }}</div>
      <div>z: {{ velocityState.velocityZ.toFixed(4) }}</div>
      <div>--</div>
      <div>GRAVITY</div>
      <div>x: {{ gravityState.x.toFixed(4) }}</div>
      <div>y: {{ gravityState.y.toFixed(4) }}</div>
      <div>z: {{ gravityState.z.toFixed(4) }}</div>
      <div>--</div>
      <div>SKIER SPEED</div>
      <div>Actual: {{ speedMeterState.speed.toFixed(4) }} km/h</div>
      <div>Takeoff: {{ speedMeterState.takeoffSpeed.toFixed(4) }} km/h</div>
      <div>--</div>
      <div>Frames from start: {{ framesPassedState.frames }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { mapGetters } from 'vuex'

@Options({
    computed: {
        ...mapGetters({
            startPhaseState: 'StartPhaseState/getStartPhaseState',
            velocityState: 'VelocityState/getVelocityState',
            gravityState: 'GravityState/getGravityState',
            framesPassedState: 'FramesPassedState/getFramesPassedState',
            speedMeterState: 'SpeedMeterState/getSpeedMeterState'
        })
    }
})

export default class HUD extends Vue {
    
}
</script>

<style lang="less" scoped>
.hud {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .info {
    display: flex;
    flex-direction: column;
    width: 16.666667%;
    background: black;
    color: white;
  }
}
</style>
