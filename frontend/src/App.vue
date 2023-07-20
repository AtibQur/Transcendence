<template>
	<div>
		<Menubar/>
	</div>
	<div>
		<router-view/>
	</div>
	<div>
		<FriendsMenubar/>
	</div>
  </template>

<script setup lang="ts">
	import axios from 'axios';
	import { onBeforeMount, ref } from 'vue';
	import Menubar from './components/Menubar/Menubar.vue';
	import FriendsMenubar from './components/Friends/FriendsMenubar/FriendsMenubar.vue';

	//constants
	const answer = ref("");
	const answerLoaded = ref(false);

	//functions
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
}
</style>
