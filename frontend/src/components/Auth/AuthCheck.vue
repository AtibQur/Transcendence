<template>
	<button class="custom-button-1" @click="StartAuth" width="350" height="270">
		Sign in with 42 School
	</button>
</template>

<script setup lang="ts">
	// import dotenv from 'dotenv';
	// import * as path from 'path';
	// 
	async function StartAuth() {
		// const envPath = path.resolve(__dirname, '../../../.env');
		// dotenv.config({ path: envPath });
		
		const url:string = 'https://api.intra.42.fr/oauth/authorize?client_id=' 
		+ 'u-s4t2ud-2242a91faab9b153180b4629bf62a41aaead8152fbaff4bbd48301fc0fa4cbcf' + '&redirect_uri=' + 
		'http://localhost:3000/auth/42/callback' + '&response_type=code';
	try {
		window.location.assign(url);
	} catch (error) {
		console.log('Error occurred');
	}
}

</script>

<style scoped>
.custom-button-1 {
	margin: 400px;
}
</style>