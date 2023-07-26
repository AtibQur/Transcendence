<template>
	<div>
		<h1>Auth</h1>
	</div>
	<button @click="StartAuth">
		<img src="./assets/login_button.png" width="350" height="270">
	</button>
	<h1>
		Click here to login with 42 :)
	</h1>
</template>
  
<script setup lang="ts">
	import axiosInstance from '../../axiosConfig';

	async function StartAuth() {
		// const url:string = axiosInstance.get('/auth/loginUrl');
		const url:string = 'https://api.intra.42.fr/oauth/authorize?client_id=' 
		+ 'u-s4t2ud-1f5d67cb202d54f32ab27a0d8d47faa94081df9fc3e7da31b097a09fb7707578' + '&redirect_uri=' + 
		'http://localhost:3000/auth/42/callback' + '&response_type=code';
	try {
		window.location.assign(url);
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