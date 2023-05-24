<template>
	<div class="container">
		<h1>Pong Game</h1>
		<div class="canvas-container">
			<div class="canvas" ref="canvas">
				<div class="score1"> {{ score1 }}</div>
				<div class="score2"> {{ score2 }}</div>
				<div class="line"></div>
				<div class="ball" :style="{ left: ball.x + 'px', top: ball.y + 'px' }"></div>
				<div class="paddle" :style="{ top: paddleY + 'px' }">
				</div>
				<div class="paddle2" :style="{ top: paddle2Y + 'px' }"></div>
				<div :style="dynamicStyle">
					<div :style="textStyle"> {{  dynamicText }}</div>
					<router-link to="/Play"><button v-if="leaderboard" @click="refreshPage">Retry</button></router-link>
					<router-link to="/Leaderboard"><button v-if="leaderboard">Leaderboard</button></router-link>
					<router-link to="/"><button v-if="leaderboard">Exit</button></router-link>
				</div>
			</div>
		</div>
	</div>
</template>
  
<script>
export default {
	name: 'PongGame',
data() {
	return {
		leaderboard: false,
		dynamicStyle: {
			endScreen: 'false',
			position: 'absolute',
			top: '35%',
			left: '33%',
			backgroundColor: 'rgb(178, 218, 231)',
			width: '0px',
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
			speedX: 1,
			speedY: 1,
			velocity: 5,
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
	};
},
methods: {
	moveBall(){
		this.ball.x += this.ball.speedX;
		this.ball.y += this.ball.speedY;

		if (this.ball.x + this.ball.radius > this.canvasWidth - 10 || this.ball.x < 0) {
			this.ball.speedX =- this.ball.speedX;
		}
		if (this.ball.y + this.ball.radius > this.canvasHeight - 10 || this.ball.y < 0) {
			this.ball.speedY =- this.ball.speedY;
		}

		if (this.ball.x < 0){
			this.score2++;
			this.ball.x = 422;
			this.ball.y = 251;
		}
		if (this.ball.x + this.ball.radius > this.canvasWidth - 10){
			this.score1++;
			this.ball.x = 422;
			this.ball.y = 251;
		}
		const paddleTop = this.paddleY - 40;
		const paddleBottom = this.paddleY + 40;
		// if (this.ball.x < 15 && this.ball.x > 10 && ballCenterY >= paddleTop && ballCenterY <= paddleBottom) {
		// // Calculate the new speedX and speedY based on the collision position
		// const collisionOffset = ballCenterY - (this.paddleY + 40);
		// const normalizedOffset = collisionOffset / 40; // Normalize the offset between -1 and 1
		// const bounceAngle = normalizedOffset * Math.PI / 4; // Adjust the angle as needed
		// this.ball.speedX = -Math.cos(bounceAngle) * this.ball.velocity;
		// this.ball.speedY = Math.sin(bounceAngle) * this.ball.velocity;
		// }

		const ballLeft = this.ball.y + (this.ball.radius / 2);
		if (this.ball.x < 15 && this.ball.x > 10 && ballLeft >= paddleTop && ballLeft <= paddleBottom) {
			const collisionOffset = (ballLeft - this.paddleTop)/ 80;
			const normalizedOffset = (Math.PI / 4) * Math.sin(this.paddleY / 80);
			const bounceAngle = (collisionOffset - 0.5) * normalizedOffset;

			console.log('Bounce Angle', bounceAngle);
			console.log('Math', Math.cos(bounceAngle));
			console.log('Ball Speed X', this.ball.speedX);

			this.ball.speedX = Math.sin(bounceAngle) * this.ball.velocity;
			// this.ball.speedX =- this.ball.speedX;
		}
		if (this.ball.x < this.canvasWidth - 10 && this.ball.x > this.canvasWidth - 30 && ballLeft >= this.paddle2Y - 40 && ballLeft <= this.paddle2Y + 40) {
			this.ball.speedX =- this.ball.speedX;
		}
		this.updateDynamicStyle();
		this.updateTextStyle();
	},
	// ending pop-up
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
	// key input
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
	//paddle movement
	movePaddle() {
		if (this.keysPressed['w'] && this.paddleY > 40)
			this.paddleY -= 1;
		else if (this.keysPressed['s'] && this.paddleY < this.canvasHeight - 40)
			this.paddleY += 1;
	},
	loop() {
		this.paddle2Y = this.ball.y;
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
	},
},
	mounted() {
		window.addEventListener('keyup', this.keyUp);
		window.addEventListener('keydown', this.keyDown);
		setInterval(this.movePaddle, 1); // Adjust the interval value as needed for desired smoothness
		this.handleResize();
		this.ball.x = (this.canvasWidth / 2 - 8);
		this.ball.y = (this.canvasHeight / 2 - 5);
		// this.ball.speedX = Math.random() > 0.5 ? 1 : - 1;
		// this.ball.speedY = Math.random() > 0.5 ? 1 : - 1;
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
	background-image: repeating-linear-gradient(to top, rgb(250, 250, 250) 0px, rgb(250, 250, 250) 14px, transparent 14px, transparent 28.5px);
}

.ball {
	position: absolute;
	left: 0;
	top: 0;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background-color: rgb(208, 16, 32);
}

.paddle {
	position: absolute;
	width: 10px;
	height: 80px;
	left: 5px;
	background-color: rgb(90, 92, 159);
	transform: translateY(-50%);
}

.paddle2 {
	position: absolute;
	width: 10px;
	height: 80px;
	right: 5px;
	background-color: rgb(90, 92, 159);
	transform: translateY(-50%);
}

.leaderboard {
	position: absolute;
	top: 200px;
}
</style>