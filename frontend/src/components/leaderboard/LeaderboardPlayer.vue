<template>
    <div>
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
    
    // export { Name, Wins, Rank };
</script>

<style>
</style>