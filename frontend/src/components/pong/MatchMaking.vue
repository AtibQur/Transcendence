<template>
	<div>
		<h1>Finding players...</h1>
	</div>
</template>

<script lang="ts">
import { socket } from '../../socket'
import { defineComponent } from 'vue'

export default defineComponent({
	name: "MatchMaking",
	components: {},
data() {
	return {
		beginMatch: false,
		showMatch: false,
	};
},
methods: {
	startMatch(){
		console.log('redirecting')
		this.beginMatch = true
		this.$router.push('/play/multiplayer')
	}
},
mounted() {
	// console.log(this.pong)
	socket.on('connect', () => console.log('Socket Connected!'));
	if (!socket) {
		console.log('Socket not connected')
		return;
	}
	socket.emit('joinMatchmaking', 1);
	socket.emit('joinMatchmaking', 2);
	socket.on('startMatch',
		(match: {
			player1: any
			player2: any
		}) => {
			console.log('Match found!')
			this.startMatch()
		}
		)
		// window.addEventListener('keyup', this.keyUp);
		// window.addEventListener('keydown', this.keyDown);
		// setInterval(this.movePaddle, 1);
		// socket.emit('movement', this.move);
	}
})

</script>