<template>
<div>
	<div class="container">
		<div class="canvas">
			<div class="player1" :style="{ top: player1.y + 'px'}"></div>
			<div class="player2" :style="{ top: player2.y + 'px'}"></div>
			<div class="ball" :style="{ left: ball.x + 'px', top: ball.y + 'px' }"></div>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: "GameTools",
	props: ['player1', 'player2', 'ball']
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