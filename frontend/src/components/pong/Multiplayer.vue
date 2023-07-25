<template>
	<div v-if="!showResults">
		<div class="PongLogo">
			<h1>PONG</h1>
			<div class="text-wrapper">
				<h1 class="dynamic-text">{{ dynamicText1 }}</h1>
				<h1 class="dynamic-text">{{ dynamicText2 }}</h1>
			</div>
		</div>
		<div v-if="inMatch">
			<GameTools :player1="player1" :player2="player2" :ball="ball" :score1="score1" :score2="score2"/>
		</div>
	</div>

	<ResultScreen v-if="showResults" 
		:score1="score1" :score2="score2" 
		:p1_socketId="p1_socketId" :p2_socketId="p2_socketId"
		:stop="stop" />
</template>

<script lang="ts">
	import { socket } from '../../socket'
	import GameTools from './GameTools.vue'
	import ResultScreen from './ResultScreen.vue'
	import { defineComponent } from 'vue'
	import {socket_match_id, p1_socket_id, p2_socket_id, username1, username2} from './MatchMaking.vue'
	import { useRouter } from 'vue-router'
	import axiosInstance from '../../axiosConfig'

	export default defineComponent({
	name: "MultiplayerMatch",
	components: { GameTools, ResultScreen},
data() {
	return {
		showResults: false,
		inMatch: true,
		dynamicText1: '',
		dynamicText2: '',
		end: false,
		win: false,
		lose: false,
		router: useRouter(),
		canvas: {
			width: 858,
			height: 525,
		},
		ball: {
			x: 429,
			y: 262,
			radius: 10,
			dX: 1,
			dY: 1,
			velocity: 2,
		},
		player1: {
			y: 262,
		},
		player2: {
			y: 262,
		},
		score1: 0,
		score2: 0,
		keysPressed: {
			w: false,
			s: false,
		},
		moveInfo: {
			socket_match_id: 0,
			move: 0,
		},
		p1_socketId: '',
		p2_socketId: '',
		stop: false,
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

	move() {
		if (this.keysPressed['w'] &&this.moveInfo.move > 40){
			this.moveInfo.move -= 2;
			socket.emit('move', this.moveInfo);
		}
		if (this.keysPressed['s'] && this.moveInfo.move < this.canvas.height - 40){
			this.moveInfo.move += 2;
			socket.emit('move', this.moveInfo);
		}
	},

	async saveFinishedMatch(match_id: number, socket_match_id: number, score1: number, score2: number) {

		console.log("match_id: ", socket_match_id)
		console.log("this.score1: ", this.score1)
		console.log("this.score2: ", this.score2)

		// finished match saves here
		let finished_match_res;
		if (match_id){
			finished_match_res = await axiosInstance.patch('match/finish/' + match_id.toString(), {player_points: this.score1, opponent_points: this.score2});
			console.log("Finished match data:", finished_match_res.data)
		}
		//
	}
},

mounted() {
	socket.on('connect', () => console.log('Socket Connected!'));
	if (!socket) {
		console.log('Socket not connected')
		return;
	}
	this.moveInfo.socket_match_id = socket_match_id;
	console.log("p1 username: ", username1, "p2 username :", username2)
	this.dynamicText1 = username1;
	this.dynamicText2 = username2;
	console.log("this user:", socket.id)
	if (socket.id === undefined)
		this.$router.push('/play');
	this.p1_socketId = p1_socket_id;
	this.p2_socketId = p2_socket_id;
	console.log("Player1 ID: ", p1_socket_id)
	console.log("Player2 ID: ", p2_socket_id)
	console.log("MATCH", socket_match_id)

	socket.on('match',async (match: {
		state: string
		ball: any
		player1: number
		player2: number
		score1: number
		score2: number
	}) => {
		this.ball = match.ball;
		this.player1.y = match.player1
		this.player2.y = match.player2
		this.score1 = match.score1
		this.score2 = match.score2
		if (match.state === 'end'){
			console.log("this match is finished")
			this.showResults = true;
			this.inMatch = false;
		}
		if (match.state === 'stop'){
			this.stop = true;	
			this.showResults = true;
			this.inMatch = false;
		}
			// this.$router.push('/play');
	})

	window.addEventListener('keyup', this.keyUp);
	window.addEventListener('keydown', this.keyDown);
	setInterval(this.move, 1)
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
	z-index: 9999;
	font-size: 12px;
	text-shadow: none;
}

.dynamic-text {
	/* position: absolute; */
	/* left: 50%; */
  margin: 250px;
  /* transform: translate(-50%, -50%); */
}

</style>