<template>
<div>
	<div class="PongLogo">
			<h1>PONG</h1>
	</div>
	<div class="container">
		<div class="canvas">
			<div class="player1" :style="{ top: player1.y + 'px'}"></div>
			<div class="player2" :style="{ top: player2.y + 'px'}"></div>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: "GameTools",
	props: ['player1', 'player2']
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
</style>