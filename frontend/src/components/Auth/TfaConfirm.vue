<template>
	<h1>
		Please hang on as we are collecting your data
	</h1>
</template>

<script setup lang="ts">
	import { onMounted } from 'vue';
	import { loginPlayer } from '../..//utils/initPlayer';
	import { useRouter } from 'vue-router';

	const router = useRouter();

	onMounted( async () => {
		await loginPlayer();
		router.push(process.env.VUE_APP_HOST_COMPUTER + ":8080/");
	})
</script>