<template>
	<h1>Vue: Hello Nest</h1>
	<div>
		<h1 v-if="answerLoaded">Nest: {{ answer }}</h1>
		<h1 v-else>No data loaded yet</h1>
	</div>
	<HelloWorld msg="Welcome to Your Vue.js App"/>
	<nav>
		<router-link to="/">Home</router-link> |
		<router-link to="/about">About</router-link> |
		<router-link to="/game">Game</router-link>
	</nav>
	<router-view/>
  </template>

<script setup lang="ts">
	import axios from 'axios';
	import { onBeforeMount, onMounted, ref } from 'vue';

	//constants
	const answer = ref("");
	const answerLoaded = ref(false);

	//functions
	async function fetchAnswer() {
		try {
			const response = await axios.get('http://localhost:3000');
			answer.value = response.data;
			answerLoaded.value = true
		} catch (error) {
			console.log("Error occured");
		}
	}

	onBeforeMount(() => {
		fetchAnswer();
	})

</script>
<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
</style>
