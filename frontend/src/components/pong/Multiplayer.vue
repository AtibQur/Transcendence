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

export default defineComponent({
	name: "MultiplayerMatch",
	components: { GameTools },
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
		},
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
	movePaddle() {
		if (this.keysPressed['w'] && this.player1.y > 40){
			this.player1.y -= 2;
			socket.emit('movement', this.player1.y);
		}
		if (this.keysPressed['s'] && this.player1.y < this.canvas.height - 40){
			this.player1.y += 2;
			socket.emit('movement', this.player1.y);
		}
	},
},
mounted() {
	socket.on('connect', () => console.log('Socket Connected!'));
	if (!socket) {
		console.log('Socket not connected')
		return;
	}

	socket.on('match', (match: {
		ball: any
		player1: number;
		player2: number
		socket_id: string
		score1: number
		score2: number
	}) => {
		this.ball = match.ball;
		if (match.socket_id !== socket.id)
			this.player1.y = match.player2
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
	setInterval(this.movePaddle, 1);
	}
})

</script>
