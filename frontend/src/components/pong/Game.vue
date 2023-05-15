<template>
    <div>
      <h1>Pong Game</h1>
	<canvas> ref="canvas"</canvas>
    </div>
  </template>
  
<script>
import ball from "./Ball.vue";

export default {
	name: 'PongGame',
	components: {
		ball,
	},
	data() {
		return {
		ball: {
			x: 250,
			y: 200,
		},
		// canvas: null,
		};
	},
	methods: {
		moveBall() {
			// this.ballx += 5;
		}
	},

	mounted() {
		this.canvas = this.$refs.canvas;
		this.ctx = this.canvas.getContext("2d");
		
	},
};
</script>

<style>
canvas {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgb(180, 241, 254);
}
</style>