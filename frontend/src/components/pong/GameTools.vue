<template>
	<div class="container">
		<div class="canvas">
			<div class="player1" :style="{ top: player1.y + 'px'}"></div>
			<div class="player2" :style="{ top: player2.y + 'px'}"></div>
			<div class="score1"> {{ score1 }}</div>
			<div class="score2"> {{ score2 }}</div>
			<div class="line"></div>
			<div class="ball" :style="{ left: ball.x + 'px', top: ball.y + 'px' }"></div>
	</div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: "GameTools",
	components: {},
	props: ['player1', 'player2', 'ball', 'score1', 'score2'],
});
</script>

<style>
html, body {
  background-color: rgb(178, 218, 231); /* Set your desired background color here */
  margin: 0;
  padding: 0;
  height: 100%;
}
.PongLogo {
	position: relative;
	font-size: 50px;
	padding: 100px;
	/* top: 100px; */
}
.container {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 30vh;
}
.canvas{
	position: relative;
	width: 858px;
	height: 525px;
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
	width: 15px;
	height: 80px;
	left: 5px;
	background-color: rgb(90, 92, 159);
	transform: translateY(-50%);
}
.player2 {
	position: absolute;
	width: 15px;
	height: 80px;
	right: 5px;
	background-color: rgb(90, 92, 159);
	transform: translateY(-50%);
}

.line {
	position: absolute;
	left: 50%;
	width: 5px;
	height: 100%;
	background-color: rgb(250, 250, 250);
	background-image: repeating-linear-gradient(to top, rgb(178, 218, 231) 0px, rgb(178, 218, 231) 14px, transparent 14px, transparent 28.5px);
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

</style>