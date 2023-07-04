<template>
	<div>
		<h1>Finding players...</h1>
	</div>
</template>

<script lang="ts">
// import { socket } from '../../socket'
import GameTools from './GameTools.vue'
import { defineComponent } from 'vue'

export default defineComponent({
	name: "JoinMatch",
	components: {  },
data() {
	return {
		id: 1,
	};
},
mounted() {
	console.log('hoi');
	// socket.on('connect', () => console.log('Socket Connected!'));
	// if (!socket) {
	// 	console.log('Socket not connected')
	// 	return;
	// }
	// socket.emit('joinMatchmaking', 1);
	// 	// window.addEventListener('keyup', this.keyUp);
	// 	// window.addEventListener('keydown', this.keyDown);
	// 	// setInterval(this.movePaddle, 1);
	// 	// socket.emit('movement', this.move);
	// }
})

</script>