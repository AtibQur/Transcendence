<template>
	<div class="PongLogo">
		<h1>PONG</h1>
	</div>
		<GameTools :player1="player1" :player2="player2" :ball="ball" :score1="score1" :score2="score2"/>
</template>

<script lang="ts">
import { socket } from '../../socket'
import GameTools from './GameTools.vue';
import { defineComponent } from 'vue'
import {p1, p2} from './MatchMaking.vue'
import { matchedRouteKey } from 'vue-router';

export default defineComponent({
	name: "MultiplayerMatch",
	components: { GameTools},
data() {
	return {
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
},
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
		socket_id: string
		score1: number
		score2: number
	}) => {
		this.ball = match.ball;

		this.player1.y = match.player1
		this.player2.y = match.player2

		this.score1 = match.score1
		this.score2 = match.score2
		if (this.score1 === 5 || this.score2 === 5){
			socket.emit('endGame');
		}
	})
	socket.on('playerDisconnected', (data: {id: any }) => 
	{ 
		console.log(data.id, 'ended the match')
		socket.emit('endGame');
	})
	window.addEventListener('keyup', this.keyUp);
	window.addEventListener('keydown', this.keyDown);
	if (socket.id === p1)
		setInterval(this.moveLeft, 1);
	else if (socket.id === p2)
		setInterval(this.moveRight, 1);
	}
})

</script>
