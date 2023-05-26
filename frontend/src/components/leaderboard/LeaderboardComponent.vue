<template>
    <div class="Leaderboard">
			<div class="Leaderboard-header">
				<div class="Leaderboard-logo">
					<img src="../../assets/images/pongEmoji.png" alt="Pong-logo">
				</div>
				<div class="Leaderboard-text">
					<h1>LEADERBOARD</h1>
				</div>
				<div class="Leaderboard-empty">
					<div class="Leaderboard-emptyspace"></div>
				</div>
			</div>

			<div class="Leaderboard-info">
				<div class="Leaderboard-rank">
					<h2>Rank</h2>
				</div>
				<div class="Leaderboard-name">
					<h2>Name</h2>
				</div>
				<div class="Leaderboard-games">
					<h2>Games won</h2>
				</div>
			</div>

			<div class="Leaderboard-footer">
				<div class="Leaderboard-player-rank">
					<h2> {{ Name }}</h2>
				</div>
				<div class="Leaderboard-player-name">
					<h2> {{ Rank }}</h2>
				</div>
				<div class="Leaderboard-player-games">
					<h2> {{ Wins }}</h2>
				</div>
			</div>
    </div>
</template>

<script setup lang="ts">

	// Footer player info

	// imports
	import axios from 'axios';
	import { onBeforeMount, onMounted, ref } from 'vue';

	// get the name from the backend
	const Name = ref("");
	const NameLoaded = ref(false);

	//functions
	async function fetchName() {
		try {
			const response = await axios.get('http://localhost:3000/Leaderboard/name');
			Name.value = response.data;
			NameLoaded.value = true
		} catch (error) {
			console.log("Error occured");
		}
	}

	// get the wins from the backend
	const Wins = ref("");
	const WinsLoaded = ref(false);

	//functions
	async function fetchWins() {
		try {
			const response = await axios.get('http://localhost:3000/Leaderboard/wins');
			Wins.value = response.data;
			WinsLoaded.value = true
		} catch (error) {
			console.log("Error occured");
		}
	}

	// get the Rank from the backend
	const Rank = ref("");
	const RankLoaded = ref(false);

	//functions
	async function fetchRank() {
		try {
			const response = await axios.get('http://localhost:3000/Leaderboard/Rank');
			Rank.value = response.data;
			RankLoaded.value = true
		} catch (error) {
			console.log("Error occured");
		}
	}
	
	onBeforeMount(() => {
		fetchName();
		fetchWins();
		fetchRank();
	})

</script>

<style>
  .Leaderboard {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    transform: translate(-50%, -50%);
    padding: 20%;
    border: 2px solid black; /* can remove later */
  }

	.Leaderboard-header {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 10%;
		background-color: #1D233A;
		border-bottom: 2px solid black;
	}
	.Leaderboard-header .Leaderboard-logo {
		position: absolute;
		top: 0;
		left: 0;
		width: 20%;
		height: 100%;
		border-right: 2px solid black;
	}
	.Leaderboard-header .Leaderboard-logo img {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 50%;
		height: 50%;
		transform: translate(-50%, -50%);
	}
	.Leaderboard-header .Leaderboard-text {
		position: absolute;
		top: 0;
		left: 20%;
		width: 60%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.Leaderboard-header .Leaderboard-text h1 {
		font-family: 'JetBrains Mono';
		font-style: normal;
		line-height: 127px;
		color: #FAFAFA;
	}
	.Leaderboard-header .Leaderboard-empty {
		position: absolute;
		top: 0;
		left: 80%;
		width: 20%;
		height: 100%;
		border-left: 2px solid black;
	}
	.Leaderboard-header .Leaderboard-emptyspace {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 50%;
		height: 50%;
		transform: translate(-50%, -50%);
	}

	.Leaderboard-info {
		position: absolute;
		top: 10%;
		left: 0;
		width: 100%;
		height: 8%;
		border-bottom: 2px solid black;
	}
	.Leaderboard-info .Leaderboard-rank {
		position: absolute;
		top: 0;
		left: 0;
		width: 20%;
		height: 100%;
		border-right: 2px solid black;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.Leaderboard-info .Leaderboard-rank h2 {
		font-family: 'JetBrains Mono';
		font-style: normal;
		line-height: 127px;
		color: #595959;
		font-weight: 400;
		font-size: 14px;
		padding-top: 6%;
	}
	.Leaderboard-info .Leaderboard-name {
		position: absolute;
		top: 0;
		left: 20%;
		width: 60%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: left;
	}
	.Leaderboard-info .Leaderboard-name h2 {
		font-family: 'JetBrains Mono';
		font-style: normal;
		line-height: 127px;
		color: #595959;
		font-weight: 400;
		font-size: 14px;
		padding-left: 6%;
		padding-top: 3%;
	}
.Leaderboard-info .Leaderboard-games {
		position: absolute;
		top: 0;
		left: 80%;
		width: 20%;
		height: 100%;
		border-left: 2px solid black;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.Leaderboard-info .Leaderboard-games h2 {
		font-family: 'JetBrains Mono';
		font-style: normal;
		color: #595959;
		font-weight: 400;
		font-size: 14px;
		padding-top: 6%;
	}
	
	.Leaderboard-footer {
		position: absolute;
		top: 90%;
		left: 0;
		width: 100%;
		height: 10%;
		background-color: #1D233A;
		border-top: 2px solid black;
	}
	.Leaderboard-footer .Leaderboard-player-rank {
		position: absolute;
		top: 0;
		left: 0;
		width: 20%;
		height: 100%;
		border-right: 2px solid black;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.Leaderboard-footer .Leaderboard-player-rank h2 {
		font-family: 'JetBrains Mono';
		font-style: normal;
		line-height: 127px;
		color: #FAFAFA;
		font-weight: 400;
		font-size: 14px;
		padding-top: 6%;
	}
	.Leaderboard-footer .Leaderboard-player-name {
		position: absolute;
		top: 0;
		left: 20%;
		width: 60%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.Leaderboard-footer .Leaderboard-player-name h2 {
		font-family: 'JetBrains Mono';
		font-style: normal;
		line-height: 127px;
		color: #FAFAFA;
		font-weight: 400;
		font-size: 14px;
		padding-left: 6%;
		padding-top: 3%;
	}
	.Leaderboard-footer .Leaderboard-player-games {
		position: absolute;
		top: 0;
		left: 80%;
		width: 20%;
		height: 100%;
		border-left: 2px solid black;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.Leaderboard-footer .Leaderboard-player-games h2 {
		font-family: 'JetBrains Mono';
		font-style: normal;
		color: #FAFAFA;
		font-weight: 400;
		font-size: 14px;
		padding-top: 6%;
	}

	</style>
