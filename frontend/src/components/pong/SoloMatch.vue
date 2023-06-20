<template>
	<GameTools :player1="player1" :player2="player2" :ball="ball" :score1="score1" :score2="score2"/>
	<div class="gameover-container" v-if="win">
		<h1>VICTORY!</h1>
	</div>
	<div class="gameover-container" v-if="lose">
		<h1>DEFEAT</h1>
	</div>
	<div class="gameover-container">
		<router-link to="/Play"><button class="gameOverBtn" v-if="end" @click="refreshPage">Retry</button></router-link>
		<router-link to="/Leaderboard"><button class="gameOverBtn" v-if="end">Leaderboard</button></router-link>
		<router-link to="/"><button class="gameOverBtn" v-if="end">Exit</button></router-link>
	</div>
</template>

<script lang="ts">
import GameTools from './GameTools.vue'
import { defineComponent } from 'vue'

export default defineComponent({
	name: "SoloMatch",
	components: { GameTools },
	props: ['selectedDifficulty'],
data() {
	return {
			end: false,
			win: false,
			lose: false,
			gameOver: false,
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
				y: 262,
			},
			player2: {
				y: 262,
				computerSpeed: 1,
			},
			score1: 0,
			score2: 0,
			keysPressed: {
				w: false,
				s: false,
			},
		};
	},
methods: {
	// setDifficulty(){
	// 	console.log('Received Difficulty:', difficulty);
	// 	this.selectDifficulty = difficulty;
	// },
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
	resetBall() {
		this.ball.x = 422;
		this.ball.y = 251;
		this.ball.velocity = 2;
		this.ball.dX = Math.random() > 0.5 ? 1 : - 1;
		this.ball.dY = Math.random() > 0.5 ? 1 : - 1;
		this.ball.y = (Math.random() * this.canvas.height);
	},
	canvasCollision(){
		if (this.ball.x + this.ball.radius > this.canvas.width - 10 || this.ball.x < 0) {
			this.ball.dX =- this.ball.dX;
		}
		if (this.ball.y + this.ball.radius > this.canvas.height - 10 || this.ball.y < 0) {
			this.ball.dY =- this.ball.dY;
		}
		if (this.ball.x < 0){
			this.score2++;
			this.resetBall();
		}
		if (this.ball.x + this.ball.radius > 848){
			this.score1++;
			this.resetBall();
		}
	},
	paddleCollision(){
		const paddleTop = this.player1.y - 40;
		const paddleBottom = this.player1.y + 40;
		const ballCenter = this.ball.y + (this.ball.radius / 2);
		if (this.ball.x < 15 && this.ball.x > 10 && ballCenter >= paddleTop && ballCenter <= paddleBottom) {
			this.ball.dX =- this.ball.dX;
			this.ball.velocity += 0.01;
		}
		if (this.ball.x < this.canvas.width - 10 && this.ball.x > this.canvas.width - 30 && ballCenter >= this.player2.y - 40 && ballCenter <= this.player2.y + 40) {
			this.ball.dX =- this.ball.dX;
			this.ball.velocity += 0.01;
		}
	},
	difficultyMode(){
		if (this.ball.y > this.player2.y && this.player2.y < this.canvas.height - 40)
			this.player2.y += 2 * this.player2.computerSpeed;
		else if (this.player2.y > 40)
			this.player2.y -= 2 * this.player2.computerSpeed;
	},
	movePaddle() {
		if (this.selectedDifficulty == 'easy')
			this.player2.computerSpeed = 0.55;
		if (this.selectedDifficulty == 'medium')
			this.player2.computerSpeed = 0.6;
		if (this.selectedDifficulty == 'hard')
			this.player2.computerSpeed = 0.65;
		this.difficultyMode();
		if (this.keysPressed['w'] && this.player1.y > 40){
			this.player1.y -= 2;
		}
		if (this.keysPressed['s'] && this.player1.y < this.canvas.height - 40){
			this.player1.y += 2;
		}
	},
	checkScore() {
		if (this.score1 == 5){
			this.win = true;
			this.gameOver = true;
			this.end = true;
		}
		if (this.score2 == 5){
			this.lose = true;
			this.gameOver = true;
			this.end = true;
		}
		
	},
	moveBall() {
		this.ball.x += this.ball.dX * this.ball.velocity;
		this.ball.y += this.ball.dY * this.ball.velocity;
		this.canvasCollision();
		this.paddleCollision();
		this.checkScore();
	},
	loop(){
		if (this.gameOver === false){
			for (let i = 0; i < this.ball.velocity; i++)
				this.moveBall();
			requestAnimationFrame(this.loop);
		}
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

<style>
.gameover-container {
	position: absolute;
	font-size: 40px;
	text-align: center;
	font-weight: bold;
	color: #134279;
	text-shadow: -1.5px 2px 1px #2164b480;
	top: 45%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.gameOverBtn {
	color: #134279;
	font-size: 15px;
	border: none
}

.gameOverBtn:hover {
	color: #79abe6;
}

</style>