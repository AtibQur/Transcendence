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
	console.log(socket.id)
	if (!socket) {
		console.log('Socket not connected')
		return;
	}

	socket.on('match', (match: {
		ball: any
		player2: any
	}) => {
		// console.log(match.bawsll)
		this.ball = match.ball;
		this.player2.y = match.player2
		console.log(this.player2)
	})

	window.addEventListener('keyup', this.keyUp);
	window.addEventListener('keydown', this.keyDown);
	setInterval(this.movePaddle, 1);
	}
})

</script>
