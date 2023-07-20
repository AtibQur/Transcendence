<template>
	<div class="PongLogo">
		<h1>PONG</h1>
		<div class="text-wrapper">
			<h1 class="dynamic-text">{{ dynamicText1 }}</h1>
			<h1 class="dynamic-text">{{ dynamicText2 }}</h1>
		</div>
	</div>
		<GameTools :player1="player1" :player2="player2" :ball="ball" :score1="score1" :score2="score2"/>
	<div class="gameover-container" v-if="win">
		<h1>VICTORY!</h1>
	</div>
	<div class="gameover-container" v-if="lose">
		<h1>DEFEAT</h1>
	</div>
	<div class="gameover-container">
		<router-link to="/Leaderboard"><button class="gameOverBtn" v-if="end">Leaderboard</button></router-link>
		<router-link to="/"><button class="gameOverBtn" v-if="end">Exit</button></router-link>
	</div>
</template>

<script lang="ts">
	import { socket } from '../../socket'
	import GameTools from './GameTools.vue'
	import { defineComponent } from 'vue'
	import {socket_match_id, p1_id, p2_id, p1_socket_id, p2_socket_id, username1, username2, match_id} from './MatchMaking.vue'
	import { useRouter } from 'vue-router'
	import axiosInstance from '../../axiosConfig'

	export default defineComponent({
	name: "MultiplayerMatch",
	components: { GameTools},
data() {
	return {
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
		}
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
	}
},

mounted() {
	socket.on('connect', () => console.log('Socket Connected!'));
	if (!socket) {
		console.log('Socket not connected')
		return;
	}
	this.moveInfo.socket_match_id = socket_match_id;
	console.log("p1: ", username1, "p2:", username2)
	this.dynamicText1 = username1;
	this.dynamicText2 = username2;
	console.log("this user:", socket.id)
	if (socket.id === undefined)
		this.$router.push('/play');
	console.log("Player1 ID: ", p1_socket_id)
	console.log("Player2 ID: ", p2_socket_id)

	socket.on('match',async (match: {
		state: string
		ball: any
		player1: number
		player2: number
		player1Id: string
		player2Id: string
		score1: number
		score2: number
	}) => {
		this.ball = match.ball;
		this.player1.y = match.player1
		this.player2.y = match.player2
		this.score1 = match.score1
		this.score2 = match.score2

		// hier eindigt match
		if (this.score1 === 5 || this.score2 === 5){
			if (this.score1 === 5){
				if (socket.id === p1_socket_id)
					this.win = true;
				else
					this.lose = true;
			}
			else if (this.score2 === 5){
				if (socket.id === p2_socket_id)
					this.win = true;
				else
					this.lose = true;
				}
			console.log("match_id: ", socket_match_id)
			console.log("this.score1: ", this.score1)
			console.log("this.score2: ", this.score2)

			// let finished_match_res;
			// if (match_id){
				// finished_match_res = await axiosInstance.patch('match/finish/' + match_id.toString(), {player_points: this.score1, opponent_points: this.score2});
				// console.log(finished_match_res.data)
			// }
			this.end = true;
		}
		if (match.state === 'stop')
			this.$router.push('/play');
	})

	window.addEventListener('keyup', this.keyUp);
	window.addEventListener('keydown', this.keyDown);
	setInterval(this.move, 1)
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
	text-shadow: -1.5px 2px 1px #2164b480;
	top: 45%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.gameOverBtn {
	color: #134279;
	font-size: 15px;
	border: none
}

.gameOverBtn:hover {
	color: #79abe6;
}

.text-wrapper {
	display: flex;
	position: absolute;
	align-items: center;
	/* margin-left: 40%; */
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
  margin: 250px;
}

.vs-text {
  margin: 0 100px; /* Adjust the spacing around the "VS" text */
}

</style>