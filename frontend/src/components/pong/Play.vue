<template>
	<div class>
		<div class="PongLogo">
			<h1>PONG</h1>
		</div>
		<div class="btns">
			<button class="start-button" v-if="!startSolo" @click="startGame">Solo Game</button>
			<button class="start-button" v-if="!startMatch" @click="joinGame">Join Game</button>
		</div>
	</div>
	<!-- <GameTools v-if="startSolo" :player1="player1" :player2="player2" :ball="ball" /> -->
	<SoloMatch v-if="startSolo" :settings="settings" />
</template>

<script lang="ts">
import { socket } from '../../socket'
// import GameTools from './GameTools.vue'
import SoloMatch from './SoloMatch.vue'
import { defineComponent } from 'vue'

export default defineComponent({
	name: "PlayGame",
	components: {SoloMatch},
	props: ['settings'],
data() {
	return {
			startSolo: false,
			startMatch: false,
		};
	},
methods: {
	startGame(){
		console.log("1 Player game started");
		this.startSolo = true;
	},
	joinGame(){
		this.startMatch = true;
	}
// 	keyUp(event) {
// 		if (event.key === 'w' || event.key === 's') {
// 			this.keysPressed[event.key] = false;
// 			socket.emit('movement', this.player1);
// 			console.log('Key Down Pressed');
// 		}
// 	},
// 	keyDown(event) {
// 		if (event.key === 'w' || event.key === 's') {
// 			this.keysPressed[event.key] = true;
// 			socket.emit('movement', this.player1);
// 			console.log('Key Down Pressed');
// 		}
// 	},
// 	//Paddle Movement
// 	movePaddle() {
// 		if (this.keysPressed['w']){
// 			this.player1.y -= 1;
// 		}
// 		if (this.keysPressed['s']){
// 			this.player1.y += 1;
// 		}
// 	},
},
mounted() {
		// socket.on('connect', () => console.log('Socket Connected!'));
		// if (!socket) {
		// 	console.log('Socket not connected')
		// 	return;
		// }
		// window.addEventListener('keyup', this.keyUp);
		// window.addEventListener('keydown', this.keyDown);
		// setInterval(this.movePaddle, 1);
		// socket.emit('movement', this.move);
	}
})

</script>

<style>
.btns {
	position: absolute;
	top: 40%;
	left: 50%;
	transform: translate(-50%, -50%);
	/* text-align: center; */

}
.start-button{
	display: block;
	margin-top: 10px;
	width: 200px; 
	height: 60px; 
	font-size: 20px;
	font-weight: 100px;
	color: #134279;
	background-color: #FAFAFA;
	border: 1px solid #134279;
}

.start-button:hover {
	background-color: #6e9bd2;
}
</style>