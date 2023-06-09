<template>
	<div>
		<GameTools :player1="player1" :player2="player2" :ball="ball" />
	</div>
</template>

<script lang="ts">
import { socket } from '../../socket'
import GameTools from './GameTools.vue'
import { defineComponent } from 'vue'

export default defineComponent({
	name: "SoloMatch",
	components: { GameTools},
	props: ['settings'],
data() {
	return {
			canvas: {
				width: 858,
				height: 525,
			},
			ball: {
				x: 429,
				y: 262,
				radius: 10,
				dX: 1,
				dY: 1,
				velocity: 2,
			},
			player1: {
				y: 200,
			},
			player2: {
				y: 200,
			},
			keysPressed: {
				w: false,
				s: false,
			},
		};
	},
methods: {
	keyUp(event) {
		if (event.key === 'w' || event.key === 's') {
			this.keysPressed[event.key] = false;
		}
	},
	keyDown(event) {
		if (event.key === 'w' || event.key === 's') {
			this.keysPressed[event.key] = true;
		}
	},
	canvasCollision(){
		if (this.ball.x + this.ball.radius > this.canvas.width - 10 || this.ball.x < 0) {
			this.ball.dX =- this.ball.dX;
		}
		if (this.ball.y + this.ball.radius > this.canvas.height - 10 || this.ball.y < 0) {
			this.ball.dY =- this.ball.dY;
		}
		if (this.ball.x < 0){
			// this.score2++;
			this.ball.x = 422;
			this.ball.y = 251;
		}
		if (this.ball.x + this.ball.radius > 848){
			// this.score1++;
			this.ball.x = 422;
			this.ball.y = 251;
		}
	},
	paddleCollision(){
		const paddleTop = this.player1.y - 40;
		const paddleBottom = this.player1.y + 40;
		const ballCenter = this.ball.y + (this.ball.radius / 2);
		if (this.ball.x < 15 && this.ball.x > 10 && ballCenter >= paddleTop && ballCenter <= paddleBottom) {
			this.ball.dX =- this.ball.dX;
		}
		if (this.ball.x < this.canvas.width - 10 && this.ball.x > this.canvas.width - 30 && ballCenter >= this.player2.y - 40 && ballCenter <= this.player2.y + 40) {
		this.ball.dX =- this.ball.dX;
		}
	},
	//Paddle Movement
	movePaddle() {
		if (this.keysPressed['w'] && this.player1.y > 40){
			this.player1.y -= 1;
		}
		if (this.keysPressed['s'] && this.player1.y < this.canvas.height - 40){
			this.player1.y += 1;
		}
	},
	moveBall(){
		this.ball.x += this.ball.dX * this.ball.velocity;
		this.ball.y += this.ball.dY * this.ball.velocity;
		this.canvasCollision();
		this.paddleCollision();
	},
	loop(){
		for (let i = 0; i < this.ball.velocity; i++)
			this.moveBall();
		requestAnimationFrame(this.loop);
	}
},
mounted() {
		window.addEventListener('keyup', this.keyUp);
		window.addEventListener('keydown', this.keyDown);
		setInterval(this.movePaddle, 1);
		this.loop();
	}
})

</script>