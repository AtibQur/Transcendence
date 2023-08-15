<template>
	<div class="PongLogo">
		<h1>PONG</h1>
	</div>
	<div class="btns">
		<div class="login" v-if="!playerId">
			<h3> Please log in to play online </h3>
		</div>
		<div class="login" v-if="playerId">
				<button class="custom-button-1" v-if="!startMatch" @click="joinGame">Join Queue</button>
		</div>
	</div>
	<MatchMaking v-if="startMatch" />
</template>

<script lang="ts">
import MatchMaking from './MatchMaking.vue'
import { socket } from '@/utils/socket'
import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'
import { useToast } from 'primevue/usetoast';

export default defineComponent({
	name: "PlayGame",
	components: {MatchMaking},
data() {
	return {
			playerId: 0,
			startMatch: false,
			router: useRouter(1),
			toast: useToast(),
		};
	},
methods: {
	joinGame(){
		this.playerId = parseInt(localStorage.getItem('playerId') || '0');
		localStorage.setItem('socketID', socket.id);
		socket.emit('joinMatchmaking', {player_id: this.playerId, socket_id: socket.id}, 
		(response) => {
			if (response === 1){
				this.$toast.add({ severity: 'error', summary: "You can't start a match when you've send out an invite", detail: '', life: 3000 });
				return ;
			}
			if (response === 2){
				this.$toast.add({ severity: 'info', summary: "You are already in the queue", detail: '', life: 3000 });
			}
			else {
				this.$toast.add({ severity: 'info', summary: "You joined the queue", detail: '', life: 3000 });
				this.startMatch = true;
			}
		});
	},
},
mounted() {
	this.playerId = parseInt(localStorage.getItem('playerId') || '0');
},
})
</script>

<style>
.btns {
	position: absolute;
	top: 40%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.start-button{
	display: block;
	margin-top: 10px;
	width: 200px; 
	height: 60px; 
	font-size: 16px;
	font-weight: 100px;
	color: #134279;
	border: none;
}

.start-button:hover {
	color: #79abe6;
}
</style>