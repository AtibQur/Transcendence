<template>
	<div>
		<h1>Auth</h1>
	</div>
	<button @click="StartAuth">
		<img src="./assets/login_button.png" width="350" height="270">
	</button>
</template>
  
<script setup lang="ts">

	import axios from 'axios';

	// async function login() {
	// 	try {
	// 		const response = await axios.get('http://localhost:3000/auth/login');
	// 		// name.value = (response.data);
	// 		// console.log(name);
	// 		// return name.value;
	// 		console.log(response);
	// 	} catch (error) {
	// 		console.log("Error: Could not fetch user");
	// 	}
	// }
	async function StartAuth() {
	try {
		window.location.assign('http://localhost:3000/auth/login');
	} catch (error) {
		console.log('Error occurred');
	}
}

</script>
  
<style>
	button {
	width: 350;
	height: 270;
	margin-top: 120px;
	background-color: transparent;
	}
</style>