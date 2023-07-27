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
@import url('https://fonts.googleapis.com/css?family=JetBrains+Mono');
#app {
	font-family: 'JetBrains Mono';
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
}
</style>
