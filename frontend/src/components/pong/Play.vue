<template>
	<div class="PongLogo">
		<h1>PONG</h1>
	</div>
	<div class="btns">
		<button class="custom-button-1" v-if="!showDifficulty && !startMatch" @click="showDifficulty = true">Solo Game</button>
		<div v-if="!showDifficulty">
			<div class="login" v-if="!playerId">
				<h3> Please log in to play online </h3>
			</div>
			<div class="login" v-if="playerId">
					<button class="custom-button-1" v-if="!startMatch" @click="joinGame">Join Queue</button>
			</div>
		</div>
		<div v-if="showDifficulty">
			<button class="custom-button-1" v-if="!startSolo" @click="selectDifficulty('easy')">Easy</button>
			<button class="custom-button-1" v-if="!startSolo" @click="selectDifficulty('medium')">Medium</button>
			<button class="custom-button-1" v-if="!startSolo" @click="selectDifficulty('hard')">Hard</button>
		</div>
	</div>
	<MatchMaking v-if="startMatch" />
	<SoloMatch v-if="startSolo" :selectedDifficulty="selectedDifficulty"/>
</template>

<script lang="ts">
import SoloMatch from './SoloMatch.vue'
import MatchMaking from './MatchMaking.vue'
import { socket } from '../../socket'
import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'
import { useToast } from 'primevue/usetoast';

export default defineComponent({
	name: "PlayGame",
	components: {SoloMatch, MatchMaking},
data() {
	return {
			playerId: 0,
			showDifficulty: false,
			selectedDifficulty: 'easy',
			startSolo: false,
			startMatch: false,
			router: useRouter(1),
			toast: useToast(),
		};
	},
methods: {
	joinGame(){
		this.playerId = parseInt(sessionStorage.getItem('playerId') || '0');
		sessionStorage.setItem('socketID', socket.id);
		console.log(socket.id)
		socket.emit('joinMatchmaking', {player_id: this.playerId, socket_id: socket.id}, 
		(response) => {
			if (response === 1){
				this.$toast.add({ severity: 'error', summary: "You can't start a match when you've send out an invite", detail: '', life: 3000 });
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
	selectDifficulty(difficulty){

		socket.emit('soloMatchStarted', socket.id)
		console.log("Solo match started");
		this.selectedDifficulty = difficulty;
		console.log('difficulty:', difficulty);
		this.startSolo = true;
	}
},
mounted() {
	this.playerId = parseInt(sessionStorage.getItem('playerId') || '0');
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