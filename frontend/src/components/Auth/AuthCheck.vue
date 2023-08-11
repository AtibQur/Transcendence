<template>
	<button class="custom-button-1" @click="StartAuth" width="350" height="270">
		Sign in with 42 School
	</button>
</template>

<script setup lang="ts">
	async function StartAuth() {
		const url:string = 'https://api.intra.42.fr/oauth/authorize?client_id=' 
		+ process.env.VUE_APP_FT_CLIENTID + '&redirect_uri=' + 
		process.env.VUE_APP_FT_REDIRECTURI + '&response_type=code';
		console.log(url);
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