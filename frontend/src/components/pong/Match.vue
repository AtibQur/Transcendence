<template>
	<div>
		<GameTools :player1="player1" :player2="player2" :ball="ball" />
	</div>
</template>

<script lang="ts">
import { socket } from '../../socket'
import GameTools from './GameTools.vue'
import { defineComponent } from 'vue'

export default defineComponent({
	name: "PlayGame",
	components: { GameTools},
	props: ['settings'],
data() {
	return {
			ball: {
				x: 429,
				y: 262,
			},
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
		};
	},
methods: {
	keyUp(event) {
		if (event.key === 'w' || event.key === 's') {
			this.keysPressed[event.key] = false;
			socket.emit('movement', this.player1);
			console.log('Key Down Pressed');
		}
	},
	keyDown(event) {
		if (event.key === 'w' || event.key === 's') {
			this.keysPressed[event.key] = true;
			socket.emit('movement', this.player1);
			console.log('Key Down Pressed');
		}
	},
	//Paddle Movement
	movePaddle() {
		if (this.keysPressed['w']){
			this.player1.y -= 1;
		}
		if (this.keysPressed['s']){
			this.player1.y += 1;
		}
	},
},
mounted() {
		socket.on('connect', () => console.log('Socket Connected!'));
		socket.on('state', (data) => {
			console.log(data)
			this.player2 = data
		})
		if (!socket) {
			console.log('Socket not connected')
			return;
		}
		window.addEventListener('keyup', this.keyUp);
		window.addEventListener('keydown', this.keyDown);
		setInterval(this.movePaddle, 1);
		// socket.emit('movement', this.move);
	}
})

</script>