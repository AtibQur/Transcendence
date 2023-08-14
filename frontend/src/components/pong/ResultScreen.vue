<template>
	<div class="PongLogo">
		<h1>PONG</h1>
	</div>
	<div class="gameover-container" v-if="win">
		<h1 style="color: #1fb01f">VICTORY!</h1>
	</div>
	<div class="gameover-container" v-if="lose">
		<h1 style="color: #bf2e2e">DEFEAT!</h1>
	</div>
	<div class="gameover-container" v-if="disconnected">
		<h1 class="disconnected-container">The other player disconnected</h1>
	</div>
	<div class="gameover-container">
		<h1 class="dynamicText">{{ dynamicScore1 }}</h1>
		<h1 class="dynamicText">{{ dynamicScore2 }}</h1>
		<router-link to="/Leaderboard"><button class="custom-button-1">Leaderboard</button></router-link>
		<router-link to="/"><button class="custom-button-1">Exit</button></router-link>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { socket } from '@/utils/socket'

export default defineComponent({
	name: "ResultScreen",
	props: ['score1', 'score2', 'p1_socketId', 'p2_socketId', 'stop'],
data() {
	return {
		win: false,
		lose: false,
		disconnected: false,
		dynamicScore1: '',
		dynamicScore2: '',
		};
	},

methods: {
},

mounted() {
	if (this.p1_socketId === socket.id){
		if (this.score1 === 10){
			this.win = true;
			if (this.stop == true){
				this.disconnected = true;
			}
		}
		else
			this.lose = true;
		this.dynamicScore1 = 'score: ' + this.score1;
	}
	else if (this.p2_socketId === socket.id){
		if (this.score2 === 10){
			this.win = true;
			if (this.stop == true){
				this.disconnected = true;
			}
		}
		else
			this.lose = true;
		this.dynamicScore2 = 'score: ' + this.score2;
	}
}
})
</script>

<style scoped>
.gameover-container {
	display: contents;
	flex-direction: column;
	align-items: center;
    justify-content: center;
	font-size: 40px;
	color: #134279;
}
.disconnected-container {
	font-size: 20px;
	color: #bc2626;
}

.dynamicText {
	font-size: 30px;
	text-align: center;
	font-weight: bold;
	text-shadow: none;
	top: 30%;
	color: #134279;
}

</style>