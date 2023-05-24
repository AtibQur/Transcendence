<template>
	<router-view/>
</template>

<script setup lang="ts">
	import axios from 'axios';
	import { onBeforeMount, ref } from 'vue';

	//constants
	const answer = ref("");
	const answerLoaded = ref(false);

	//functions
	async function fetchAnswer() {
		try {
			const response = await axios.get('http://localhost:3000');
			answer.value = response.data;
			answerLoaded.value = true
			return answer.value;
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
}
</style>
