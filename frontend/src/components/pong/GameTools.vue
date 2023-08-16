<template>
	<div class="PongLogo2">
		<h1>PONG</h1>
	</div>
	<div class="container">
		<div class="canvas" :style="{ width: 858 + 'px', height: 526 + 'px' }" ref="canvas">
			<h1 class="dynamicText1">{{ dynamicText1 }}</h1>
			<h1 class="dynamicText2">{{ dynamicText2 }}</h1>
			<div class="player1" :style="{ top: player1.y + 'px', left: player1.x + 'px', height: player1.h + 'px' }"></div>
			<div class="player2" :style="{ top: player2.y + 'px', left: player2.x + 'px', height: player2.h + 'px' }"></div>
			<div class="score1"> {{ score1 }}</div>
			<div class="score2"> {{ score2 }}</div>
			<div class="line" :style="{ width: 4 + 'px', left: center + 'px'}"></div>
			<div class="ball" :style="{ left: ball.x + 'px', top: ball.y + 'px' }"></div>

			<div v-if="powerUpVisable">
				<img class="powerUpPixel"
				src="../../assets/images/PONG_logo.png"
				:style="{ top: powerUpPixel.x + 'px', left: powerUpPixel.y + 'px' }"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: "GameTools",
	components: {},
	props: ['player1', 'player2', 'ball', 'score1', 'score2', 'powerUpPixel', 'powerUpVisable', 'dynamicText1', 'dynamicText2'],
data() {
	return {
		center: 0,
	}
},
mounted() {
		const canvas = this.$refs.canvas as HTMLDivElement;
		if (canvas) {
			this.center = (canvas.offsetWidth / 2) - 2;
		}
	}
});

</script>

<style>
html, body {
  background-color: rgb(178, 218, 231);
  margin: 0;
  padding: 0;
  height: 100%;
}

.PongLogo2 {
	font-family: 'JetBrains Mono';
	font-style: normal;
	font-weight: 400;
	font-size: 60px;
	line-height: 127px;
	color: #134279;
	text-shadow: -3px 3px var(--gray-shadow);
	padding: 100px;
}

.dynamicText1 {
	position: absolute;
	font-size: 25px;
	left: 15%;
	top: -70px;
	color: rgb(90, 92, 159);
}

.dynamicText2 {
	position: absolute;
	font-size: 25px;
	right: 15%;
	top: -70px;
	color: rgb(90, 92, 159);
}

.container {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 30vh;
}
.canvas{
	position: relative;
	background-color: rgb(250, 250, 250);
	border: 5px solid rgb(133, 168, 203);
}

.score1 {
	position: absolute;
	left: 40%;
	font-size: 25px;
	font-weight: bold;
	margin-top: 30px;
	color: rgb(90, 92, 159);
}

.score2 {
	position: absolute;
	right: 40%;
	font-size: 25px;
	font-weight: bold;
	margin-top: 30px;
	color: rgb(90, 92, 159);
}

.player1 {
	position: absolute;
	top: 50%;
	width: 15px;
	height: 80px;
	background-color: rgb(90, 92, 159);
	transform: translateY(-50%);
}
.player2 {
	position: absolute;
	top: 50%;
	width: 15px;
	height: 80px;
	right: 0px;
	background-color: rgb(90, 92, 159);
	transform: translateY(-50%);
}

.line {
	position: absolute;
	width: 4px;
	height: 100%;
	background-color: rgb(250, 250, 250);
	background-image: repeating-linear-gradient(to top, rgb(178, 218, 231) 0px, rgb(178, 218, 231) 14px, transparent 14px, transparent 28.5px);
}

.ball {
	position: absolute;
	width: 21px;
	height: 21px;
	background-color:rgb(246, 125, 125);
	border-radius: 25%;
}

.powerUpPixel {
	position: absolute;
	width: 32px;
	height: 32px;
}

</style>