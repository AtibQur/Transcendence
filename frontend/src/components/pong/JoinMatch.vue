<template>
	<div>
		<h1>Finding players...</h1>
	</div>
</template>

<script lang="ts">
import { socket } from '../../socket'
import GameTools from './GameTools.vue'
import { defineComponent } from 'vue'

export default defineComponent({
	name: "JoinMatch",
	components: {  },
// data() {
	// return {
	// },
// },
mounted() {
		socket.on('connect', () => console.log('Socket Connected!'));
		socket.on('state', (data) => {
			console.log(data)
		})
		if (!socket) {
			console.log('Socket not connected')
			return;
		}
		// window.addEventListener('keyup', this.keyUp);
		// window.addEventListener('keydown', this.keyDown);
		// setInterval(this.movePaddle, 1);
		// socket.emit('movement', this.move);
	}
})

</script>