<template>
	<div v-if="!showResults">
		<GameTools :player1="player1" :player2="player2" 
			:ball="ball" 
			:score1="score1" :score2="score2"
			:powerUpPixel="powerUpPixel"
			:powerUpVisable="powerUpVisable" 
			:dynamicText1="dynamicText1" :dynamicText2="dynamicText2" />
	</div>

	<ResultScreen v-if="showResults" 
		:score1="score1" :score2="score2" 
		:p1_socketId="p1_socketId" :p2_socketId="p2_socketId"
		:stop="stop" />
</template>

<script lang="ts">
	import { socket } from '@/utils/socket'
	import { defineComponent } from 'vue'
	import {
	p1_socket_id,
	p2_socket_id,
	username1,
	username2,
	match_id,
	socket_match_id,
	} from './shared';
	import { useRouter } from 'vue-router'
	import axiosInstance from '@/utils/axiosConfig'

	import GameTools from './GameTools.vue'
	import ResultScreen from './ResultScreen.vue'


	export default defineComponent({
	name: "MultiplayerMatch",
	components: { GameTools, ResultScreen},
data() {
	return {
		matchSaved: false,
		showResults: false,
		dynamicText1: '',
		dynamicText2: '',
		end: false,
		win: false,
		lose: false,
		router: useRouter(),
		canvas: {
			width: 858,
			height: 526,
		},
		ball: {
			x: 429 - 10,
			y: 263 - 10,
			radius: 10,
			dX: 1,
			dY: 1,
			velocity: 2,
		},
		player1: {
			y: 262,
			h: 80,
		},
		player2: {
			y: 262,
			h: 80,
		},
		score1: 0,
		score2: 0,
		keysPressed: {
			w: false,
			s: false,
		},
		moveInfo: {
			socket_match_id: 0,
			move: 263,
		},
		p1_socketId: '',
		p2_socketId: '',
		stop: false,
		powerUp: {
			type: 0,
			x: 0,
			y: 0,
		},
		powerUpPixel: {
			x: 0,
			y: 0,
		},
		powerUpVisable: false,
	};
},

methods: {
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

	// Movement
	moveP1() {
		if (this.keysPressed['w'] && this.moveInfo.move > (this.player1.h / 2)){
			this.moveInfo.move -= 2;
			socket.emit('move', this.moveInfo);
		}
		if (this.keysPressed['s'] && this.moveInfo.move < (this.canvas.height - (this.player1.h / 2) - 10)){
			this.moveInfo.move += 2;
			socket.emit('move', this.moveInfo);
		}
	},
	moveP2() {
		if (this.keysPressed['w'] && this.moveInfo.move > (this.player2.h / 2)){
			this.moveInfo.move -= 2;
			socket.emit('move', this.moveInfo);
		}
		if (this.keysPressed['s'] && this.moveInfo.move < (this.canvas.height - this.player2.h / 2)- 10){
			this.moveInfo.move += 2;
			socket.emit('move', this.moveInfo);
		}
	},

	async saveFinishedMatch(match_id: number, score1: number, score2: number) {
		let finished_match_res;
		if (match_id){
			finished_match_res = await axiosInstance.patch('match/finish/' + match_id.toString(), {player_points: score1, opponent_points: score2});
		}
	},

	showPowerUp(powerUp: any){
		if (powerUp){
			if (powerUp.type !== 0){
				this.powerUpVisable = true;
				this.powerUpPixel.x = powerUp.x;
				this.powerUpPixel.y = powerUp.y;
				if (powerUp.active){
					this.powerUpVisable = false;
				}
			}
		}
	},

	printInfo() {
		this.moveInfo.socket_match_id = socket_match_id.value;
		this.dynamicText1 = username1.value;
		this.dynamicText2 = username2.value;
		if (socket.id === undefined)
			this.$router.push('/play');
		this.p1_socketId = p1_socket_id.value;
		this.p2_socketId = p2_socket_id.value;
	}
},

mounted() {
	if (!socket){
		console.log("Error: Socket not connected")
		return;
	}
	this.showResults = false;
	if (!this.matchSaved){
		this.printInfo();
	}
	socket.on('match',async (match: {
		state: string
		ball: any
		player1: number
		player2: number
		player1Height: number
		player2Height: number
		score1: number
		score2: number
		powerUp: any
	}) => {
		this.ball = match.ball;
		this.player1.y = match.player1
		this.player2.y = match.player2
		this.player1.h = match.player1Height
		this.player2.h = match.player2Height
		this.score1 = match.score1
		this.score2 = match.score2
		this.powerUp = match.powerUp

		this.showPowerUp(this.powerUp);
		if (match.state === 'end'){
			this.saveFinishedMatch(match_id.value, this.score1, this.score2)
			this.showResults = true
			this.matchSaved = true;
		}
		if (match.state === 'stop'){
			this.stop = true;	
			this.saveFinishedMatch(match_id.value, this.score1, this.score2)
			this.showResults = true;
			this.matchSaved = true;
		}
	})

	window.addEventListener('keyup', this.keyUp);
	window.addEventListener('keydown', this.keyDown);
	if (p1_socket_id.value === socket.id)
		setInterval(this.moveP1, 1)
	if (p2_socket_id.value === socket.id)
		setInterval(this.moveP2, 1)
	}

})
</script>

<style>
.text-wrapper {
	display: flex;
	position: absolute;
	align-items: center;
	justify-content: center;
	transform: translate(-50%, -50%);
	position: absolute;
	top: 75%;
	left: 50%;
	z-index: 10;
	font-size: 12px;
	text-shadow: none;
}

</style>