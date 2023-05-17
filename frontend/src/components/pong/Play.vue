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
					<!-- <input v-on:keyup.up="movePaddle"> -->
				</div>
				<div class="paddle2" :style="{ top: paddle2Y + 'px' }"></div>
			</div>
		</div>
	</div>
</template>
  
<script>
export default {
	name: 'PongGame',
data() {
	return {
		ball: {
			x: 422,
			y: 251,
			radius: 10,
			speedX: 1,
			speedY: 1,
			velocity: 5,
			},
			score1: 0,
			score2: 0,
			paddleY: 250,
			paddle2Y: 250, 
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
		const ballLeft = this.ball.y + (this.ball.radius / 2);
		if (this.ball.x < 15 && this.ball.x > 10 && ballLeft >= paddleTop && ballLeft <= paddleBottom) {
			this.ball.speedX =- this.ball.speedX;
		}
		if (this.ball.x < this.canvasWidth - 10 && this.ball.x > this.canvasWidth - 30 && ballLeft >= this.paddle2Y - 40 && ballLeft <= this.paddle2Y + 40) {
			this.ball.speedX =- this.ball.speedX;
		}

	},
	movePaddle() {
		if (event.key === 'w')
			this.paddleY -= 25;
		else if (event.key === 's')
			this.paddleY += 25;
	},
	draw() {
		this.paddle2Y = this.ball.y;
		for (let i = 0; i < this.ball.velocity; i++)
			this.moveBall();
		requestAnimationFrame(this.draw);
		window.addEventListener('keydown', this.movePaddle);
	},
},
	mounted() {
		this.canvas = this.$refs.canvas;
		this.canvasWidth = this.$refs.canvas.offsetWidth;
		this.canvasHeight = this.$refs.canvas.offsetHeight;
		this.draw();
	},
	beforeUnmount() {
		window.removeEventListener('keydown', this.movePaddle);
	},
};
</script>

<style>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 50vh;
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

.canvas-container {
	display: flex;
	justify-content: center;
}

.canvas {
	position: relative;
	width: 858px;
	height: 525px;
	background-color: rgb(163, 229, 243);
}

.line {
	position: absolute;
	left: 50%;
	top: 0;
	width: 5px;
	height: 100%;
	background-color: rgb(255, 241, 236);
}

.line {
	position: absolute;
	left: 50%;
	width: 5px;
	height: 100%;
	background-color: rgb(163, 229, 243);
	/* background-image: repeating-linear-gradient(transparent, transparent 4px, #fff 4px, #fff 12px); */
	background-image: repeating-linear-gradient(to bottom, rgb(255, 255, 250) 0px, rgb(255, 255, 250) 14px, transparent 14px, transparent 28.5px);
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
	background-color: rgb(255, 255, 250);
	transform: translateY(-50%);
}

.paddle2 {
	position: absolute;
	width: 10px;
	height: 80px;
	right: 5px;
	background-color: rgb(255, 255, 250);
	transform: translateY(-50%);
} 
</style>