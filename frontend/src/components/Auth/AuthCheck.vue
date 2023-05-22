<template>
	<div>
		<h1>Auth</h1>
	</div>
	<button @click="StartAuth">
		<img src="./assets/login_button.png" width="350" height="270">
	</button>
</template>
  
<script setup lang="ts">

	async function StartAuth() {
	try {
		console.log('hoi');
		window.location.href = 'http://localhost:3000/auth/42';
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