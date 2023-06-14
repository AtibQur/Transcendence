<template>
	<div class="container">
		<div class="PongLogo">
			<h1>PO1NG</h1>
		</div>
		<div class="canvas-container">
			<div class="canvas" ref="canvas">
				<div class="score1"> {{ score1 }}</div>
				<div class="score2"> {{ score2 }}</div>
				<div class="line"></div>
				<div class="ball" :style="{ left: ball.x + 'px', top: ball.y + 'px' }"></div>
				<div class="paddle" :style="{ top: paddleY + 'px' }"></div>
				<div class="paddle2" :style="{ top: paddle2Y + 'px' }"></div>
				<div :style="dynamicStyle">
					<div :style="textStyle"> {{  dynamicText }}</div>
					<div class="buttons">
						<router-link to="/Play"><button v-if="leaderboard" @click="refreshPage">Retry</button></router-link>
						<router-link to="/Leaderboard"><button v-if="leaderboard">Leaderboard</button></router-link>
						<router-link to="/"><button v-if="leaderboard">Exit</button></router-link>
					</div>
				</div>
				<button class="start-button" v-if="!gameStarted" @click="startGame">Press to start</button>
			</div>
		</div>
	</div>
</template>
  
<script>
// import io from 'socket.io-client';
export default {
	name: 'PongGame',
data() {
	return {
		socket: null,
		leaderboard: false,
		dynamicStyle: {
			endScreen: 'false',
			position: 'absolute',
			top: '35%',			width: '0px',
			height: '0px',
			// border: '1.5px solid rgb(32, 38, 130)',
		},	
		dynamicText: '',
		textStyle: {
			marginTop: '30px',
			fontSize: '50px',
			textAlight: 'center',
			fontWeight: 'bold',
			textShadow: '-1.5px 2px 1px rgb(33, 100, 180, 0.5)',
		},
		ball: {
			x: 50,
			y: 50,
			radius: 10,
			dirX: 1,
			dirY: 1,
			velocity: 4,
		},
			score1: 0,
			score2: 0,
			paddleY: 250,
			paddle2Y: 250,
		keysPressed: {
			w: false,
			s: false,
		},
		gameOver: false,
		gameStarted: false,
	};
},
methods: {
	// Ball Movement
	moveBall(){
		if (this.gameStarted === false)
			return;
		this.ball.x += this.ball.dirX;
		this.ball.y += this.ball.dirY;

		if (this.ball.x + this.ball.radius > this.canvasWidth - 10 || this.ball.x < 0) {
			this.ball.dirX =- this.ball.dirX;
		}
		if (this.ball.y + this.ball.radius > this.canvasHeight - 10 || this.ball.y < 0) {
			this.ball.dirY =- this.ball.dirY;
		}

		if (this.ball.x < 0){
			this.score2++;
			this.ball.x = 422;
			this.ball.y = 251;
			this.ball.velocity = 5;
		}
		if (this.ball.x + this.ball.radius > this.canvasWidth - 10){
			this.score1++;
			this.ball.x = 422;
			this.ball.y = 251;
			this.ball.velocity = 5;
		}

		// Ball Bounce
		const paddleTop = this.paddleY - 40;
		const paddleBottom = this.paddleY + 40;
		const ballCenter = this.ball.y + (this.ball.radius / 2);
		const hitPoint = ballCenter - paddleTop;
		if (this.ball.x < 15 && this.ball.x > 10 && ballCenter >= paddleTop && ballCenter <= paddleBottom) {
			this.ball.velocity += 0.5;
			this.ball.dirX =- this.ball.dirX;
		}
		if (this.ball.x < this.canvasWidth - 10 && this.ball.x > this.canvasWidth - 30 && ballCenter >= this.paddle2Y - 40 && ballCenter <= this.paddle2Y + 40) {
			this.ball.velocity += 0.5;
			this.ball.dirX =- this.ball.dirX;
		}
		this.updateDynamicStyle();
		this.updateTextStyle();
	},
	// Ending Pop-Up
	updateTextStyle(){
		const textSize = this.canvasWidth * 0.05;
		this.textStyle.fontSize = `${textSize}px`;
	},
	updateDynamicStyle(){
		const scaledWidth = this.canvasWidth * 0.35;
		const scaledHeight = this.canvasHeight * 0.25;
		if (this.score1 == 5){
			if (this.dynamicStyle.endScreen === 'false'){
				this.dynamicStyle.width = `${scaledWidth}px`;
				this.dynamicStyle.height = `${scaledHeight}px`;
				this.dynamicText = 'VICTORY!';
				this.leaderboard = true;
			}
			this.gameOver = true;
		}
		if (this.score2 == 5){
			if (this.dynamicStyle.endScreen === 'false'){
				this.dynamicStyle.width = `${scaledWidth}px`;
				this.dynamicStyle.height = `${scaledHeight}px`;
				this.dynamicText = 'DEFEAT!';
				this.leaderboard = true;
			}
			this.gameOver = true;
		}
	},
	refreshPage() {
      location.reload();
    },
	// Key Input
	keyUp(event) {
			if (event.key === 'w' || event.key === 's' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
				this.keysPressed[event.key] = false;
			}
		},
	keyDown(event) {
		if (event.key === 'w' || event.key === 's' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			this.keysPressed[event.key] = true;
		}
	},
	//Paddle Movement
	movePaddle() {
		if (this.keysPressed['w'] && this.paddleY > 40)
			this.paddleY -= 2;
		if (this.keysPressed['s'] && this.paddleY < this.canvasHeight - 40)
			this.paddleY += 2;
		if (this.keysPressed['ArrowUp'] && this.paddle2Y > 40)
			this.paddle2Y -= 2;
		if (this.keysPressed['ArrowDown'] && this.paddle2Y < this.canvasHeight - 40)
			this.paddle2Y += 2;
	},
	loop() {
		if (this.gameOver === false){
			for (let i = 0; i < this.ball.velocity; i++)
				this.moveBall();
				requestAnimationFrame(this.loop);
			}
	},
	handleResize() {
		this.canvas = this.$refs.canvas;
		this.canvasWidth = this.$refs.canvas.offsetWidth;
		this.canvasHeight = this.canvasWidth * (9 / 16);
		this.ball.x = this.canvasWidth / 2 - 7;
		this.ball.y = (Math.random() * this.canvasHeight);
	},
	startGame(){
		this.gameStarted = true;
	}
},
	mounted() {
		// const socket = io('http://localhost:3000');
		// socket.emit('customEvent', { message: 'Hello server!' });
		window.addEventListener('keyup', this.keyUp);
		window.addEventListener('keydown', this.keyDown);
		setInterval(this.movePaddle, 1); // Adjust the interval value as needed for desired smoothness
		this.handleResize();
		this.ball.dirX = Math.random() > 0.5 ? 1 : - 1;
		this.ball.dirY = Math.random() > 0.5 ? 1 : - 1;
		this.loop();
	},
	beforeUnmount() {
		window.removeEventListener('keyup', this.keyUp);
		window.removeEventListener('keydown', this.keyDown);
	},
};
</script>

<style>
html, body {
  background-color: rgb(178, 218, 231); /* Set your desired background color here */
  margin: 0;
  padding: 0;
  height: 100%;
}

.PongLogo {
    font-family: 'JetBrains Mono';
    font-style: normal;
    font-weight: 400;
    font-size: 30px;
    line-height: 127px;
    color: #134279;
    text-shadow: -3px 3px #a29e9e;
}

.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 80vh;
}

.canvas-container {
	display: flex;
	justify-content: center;
	width: 80%;
	max-width: 1550px;
	min-width: 800px;
}

.canvas {
	position: relative;
	top: 50px;
	width: 100%;
	padding-bottom: 56.25%;
	background-color: rgb(250, 250, 250);

}

.score1 {
	position: absolute;
	left: 40%;
	font-size: 25px;
	font-weight: bold;
	margin-top: 30px;
}

.score2 {
	position: absolute;
	right: 40%;
	font-size: 25px;
	font-weight: bold;
	margin-top: 30px;
}

.line {
	position: absolute;
	left: 50%;
	width: 5px;
	height: 100%;
	background-color: rgb(178, 218, 231);
	background-image: repeating-linear-gradient(to top, )rgb(250, 250, 250 0px, rgb(250, 250, 250) 14px, transparent 14px, transparent 28.5px);
}

.ball {
	position: absolute;
	width: 20px;
	height: 20px;
	/* top: 50px; */
	/* left: 50px; */
	border-radius: 50%;
	background-color: rgb(208, 16, 32);
}

.paddle {
	position: absolute;
	width: 15px;
	height: 80px;
	left: 5px;
	background-color: rgb(90, 92, 159);
	transform: translateY(-50%);
}

.paddle2 {
	position: absolute;
	width: 15px;
	height: 80px;
	right: 5px;
	background-color: rgb(90, 92, 159);
	transform: translateY(-50%);
}

.leaderboard {
	position: absolute;
	top: 200px;
}

.start-button {
	position: absolute;
	padding: 10px 20px;
	color: #2c3e50;
	font-size: 40px;
	top: 18%;
	left: 34.5%;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}
.start-button:hover {
  background-color: #45a049;
}

.buttons {
	position: absolute;
	top: 10%;
	left: 20%;
}

</style>




<template>
	<div>
		<h1>Play</h1>
		<div class="button">
			<button @click="startPlay">
				<!-- <GameSettings :settings="settings"/> -->
				1 Player</button>
		</div>
	</div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import GameSettings from "./Game.vue"

export default defineComponent ({
	name: "PlayGame",
	data() {
		return {
			settings: true
		}
	},
	methods: {
		startPlay(){
			console.log('Start an practice match');

		},
	}
});

</script>

<style>
.button {
	position: absolute;
}
</style>