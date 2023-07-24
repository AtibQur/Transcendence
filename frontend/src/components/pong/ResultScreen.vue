<template>
	<div class="PongLogo">
		<h1>PONG</h1>
	</div>
	<div class="gameover-container" v-if="win">
		<h1>VICTORY!</h1>
	</div>
	<div class="gameover-container" v-if="lose">
		<h1>DEFEAT!</h1>
	</div>
	<div class="disconnected-container" v-if="disconnected">
		<h1>The other player disconnected</h1>
	</div>
	<div class="gameover-container">
		<h1 class="dynamicText">{{ dynamicScore1 }}</h1>
		<h1 class="dynamicText">{{ dynamicScore2 }}</h1>
		<router-link to="/Leaderboard"><button class="gameOverBtn" >Leaderboard</button></router-link>
		<router-link to="/"><button class="gameOverBtn">Exit</button></router-link>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { socket } from '../../socket'

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
	console.log(this.score1, this.score2)
	if (this.p1_socketId === socket.id){
		if (this.score1 === 5){
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
		if (this.score2 === 5){
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

<style>
.gameover-container {
	position: absolute;
	font-size: 40px;
	text-align: center;
	font-weight: bold;
	color: #134279;
	/* text-shadow: -1.5px 2px 1px #2164b480; */
	top: 45%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.disconnected-container {
	position: absolute;
	font-size: 10px;
	top: 70%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: #bc2626;
}

.dynamicText {
	font-size: 40px;
	text-align: center;
	font-weight: bold;
	text-shadow: none;
	color: #134279;
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