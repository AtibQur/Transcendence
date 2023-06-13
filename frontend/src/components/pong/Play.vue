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
				<!-- <button class="start-button" v-if="!startSolo" @click="startGame">Solo Game</button> -->
				<button class="start-button" v-if="!startSolo" @click="selectDifficulty('easy')">Easy</button>
				<button class="start-button" v-if="!startSolo" @click="selectDifficulty('medium')">Medium</button>
				<button class="start-button" v-if="!startSolo" @click="selectDifficulty('hard')">Hard</button>
			</div>
		</div>
	</div>
	<JoinMatch v-if="startMatch" />
	<SoloMatch v-if="startSolo" :selectedDifficulty="selectedDifficulty"/>
</template>

<script lang="ts">
import SoloMatch from './SoloMatch.vue'
import JoinMatch from './JoinMatch.vue'
import { defineComponent } from 'vue'

export default defineComponent({
	name: "PlayGame",
	components: {SoloMatch, JoinMatch},
data() {
	return {
			showDifficulty: false,
			selectedDifficulty: 'easy',
			startSolo: false,
			startMatch: false,
		};
	},
methods: {
	joinGame(){
		this.startMatch = true;
	},
	selectDifficulty(difficulty){
		console.log("1 Player game started");
		this.selectedDifficulty = difficulty;
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