<template>
	<div class="PongLogo">
		<h1>PONG</h1>
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
	import {p1, p2} from './MatchMaking.vue'
	import { useRouter } from 'vue-router'
	import axios from 'axios'

	export default defineComponent({
	name: "MultiplayerMatch",
	components: { GameTools},
data() {
	return {
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
			a: false,
			d: false,
		},
	};
},
methods: {
	keyUp(event) {
		if (event.key === 'w' || event.key === 's' || event.key === 'a' || event.key === 'd') {
			this.keysPressed[event.key] = false;
		}
	},
	keyDown(event) {
		if (event.key === 'w' || event.key === 's' || event.key === 'a' || event.key === 'd') {
			this.keysPressed[event.key] = true;
		}
	},

	moveLeft() {
		if (this.keysPressed['w'] && this.player1.y > 40){
			this.player1.y -= 2;
			socket.emit('moveLeft', this.player1.y);
		}
		if (this.keysPressed['s'] && this.player1.y < this.canvas.height - 40){
			this.player1.y += 2;
			socket.emit('moveLeft', this.player1.y);
		}
	},
	moveRight() {
		if (this.keysPressed['a'] && this.player2.y > 40){
			this.player2.y -= 2;
			socket.emit('moveRight', this.player2.y);
		}
		if (this.keysPressed['d'] && this.player2.y < this.canvas.height - 40){
			this.player2.y += 2;
			socket.emit('moveRight', this.player2.y);
		}
	},
	// async handleUnload(){
	// 	console.log("you refreshed or left the page")
	// 	await axios.post('/api/notify-user-leave');

	// },
},
// beforeMount() {
// 	window.addEventListener('unload', this.handleUnload);
// },
// beforeUnmount() {
//   window.removeEventListener('unload', this.handleUnload);
// },
mounted() {
	socket.on('connect', () => console.log('Socket Connected!'));
	if (!socket) {
		console.log('Socket not connected')
		return;
	}
	console.log("this user:", socket.id)
	console.log("P1 ID", p1)
	console.log("P2 ID", p2)

	socket.on('match', (match: {
		ball: any
		player1: number
		player2: number
		player1Id: string
		player2Id: string
		socket_id: string
		score1: number
		score2: number
	}) => {
		this.ball = match.ball;

		this.player1.y = match.player1
		this.player2.y = match.player2

		this.score1 = match.score1
		this.score2 = match.score2

		// hier eindigt match
		if (this.score1 === 5){
			if (socket.id === p2)
				this.win = true;
			else
				this.lose = true;
			this.end = true;
		}
		else if (this.score2 === 5){
			if (socket.id === p1)
				this.win = true;
			else
				this.lose = true;
			this.end = true;
		}
	})
	socket.on('playerDisconnected', (data: {id: any }) => 
	{ 
		console.log(data.id, 'ended the match')
		socket.emit('endGame');
		this.$router.push('/play');
	})
	window.addEventListener('beforeunload', () => {
		socket.emit('playerDisconnecting', { id: socket.id });
		this.$router.push('/play');
	});

	window.addEventListener('keyup', this.keyUp);
	window.addEventListener('keydown', this.keyDown);
	if (socket.id === p1)
		setInterval(this.moveLeft, 1);
	else if (socket.id === p2)
		setInterval(this.moveRight, 1);
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
</style>