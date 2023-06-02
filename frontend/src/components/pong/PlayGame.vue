<template>
	<div>
		<GameTools :player1="player1" :player2="player2" />
	</div>
</template>

<script lang="ts">
import { io } from 'socket.io-client';
import GameTools from './GameTools.vue'
import { defineComponent } from 'vue'

export default defineComponent({
	name: "PlayGame",
	components: { GameTools },
	// props: ['socket'],
data() {
	return {
			socket: null,
			player1: {
				y: 200,
			},
			player2: {
				y: 200,
			},
			keysPressed: {
				w: false,
				s: false,
			},
			move: {
				step: 0
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
	//Paddle Movement
	movePaddle() {
		if (this.keysPressed['w']){
			this.move.step -= 2;
			this.player1.y -= 2;
		}
		if (this.keysPressed['s']){
			this.move.step += 2;
			this.player1.y += 2;
		}
		},
	},
mounted() {
		// this.socket = io('http://localhost:3000');
		// this.socket.on(
		// 	'state',
		// 	(state: {
		// 		player1: any
		// 		player2: any
		// 	}) => {
		// 	this.player1 = state.player1
        //     this.player2 = state.player2
		// 	}
		// )
		if (!this.socket) {
			console.log('Socket not connected')
		}
		window.addEventListener('keyup', this.keyUp);
		window.addEventListener('keydown', this.keyDown);
		setInterval(this.movePaddle, 1);
		// this.socket.emit('move', this.move)
	}
})

</script>