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
	import Menubar from './components/Menubar/Menubar.vue';
	import FriendsMenubar from './components/Friends/FriendsMenubar/FriendsMenubar.vue';

</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
}
</style>
