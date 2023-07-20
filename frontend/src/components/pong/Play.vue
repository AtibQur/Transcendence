<template>
	<div class>
		<div class="PongLogo">
			<h1>PONG</h1>
		</div>
		<div class="btns">
			<button class="start-button" v-if="!showDifficulty && !startMatch" @click="showDifficulty = true">Solo Game</button>
			<div v-if="!showDifficulty">
				<button class="start-button" v-if="!startMatch" @click="joinGame">Join Game</button>
			</div>
			<div v-if="showDifficulty">
				<button class="start-button" v-if="!startSolo" @click="selectDifficulty('easy')">Easy</button>
				<button class="start-button" v-if="!startSolo" @click="selectDifficulty('medium')">Medium</button>
				<button class="start-button" v-if="!startSolo" @click="selectDifficulty('hard')">Hard</button>
			</div>
		</div>
	</div>
	<MatchMaking v-if="startMatch" />
	<SoloMatch v-if="startSolo" :selectedDifficulty="selectedDifficulty"/>
</template>

<script lang="ts">
import SoloMatch from './SoloMatch.vue'
import MatchMaking from './MatchMaking.vue'
import { socket } from '../../socket'
import { Socket } from 'socket.io';
import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'

export default defineComponent({
	name: "PlayGame",
	components: {SoloMatch, MatchMaking},
data() {
	return {
			showDifficulty: false,
			selectedDifficulty: 'easy',
			startSolo: false,
			startMatch: false,
			router: useRouter(1),
		};
	},
methods: {
	joinGame(){
		this.startMatch = true;
	},
	selectDifficulty(difficulty){

		socket.emit('soloMatchStarted', socket.id)

		socket.on('alreadyInMatch', () => {
			console.log("you are already in a match, redirecting...")
			this.router.push('/play/multiplayer');
			this.startSolo = false;
			return ;
		});

		console.log("Solo match started");
		this.selectedDifficulty = difficulty;
		console.log('difficulty:', difficulty);
		this.startSolo = true;
	}
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