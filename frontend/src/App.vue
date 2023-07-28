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

:root {
	--white-softblue: #f9fbfc;
	--white-softgray: #f0f0f0;
	--white-transparent: rgba(255, 255, 255, 0.6);
	--white-moretransparent: rgba(255, 255, 255, 0.3);
	--black-soft: #30333d;
	--blue-dark: #134279;
	--blue-dark-transparent: rgba(31, 96, 145, 0.5);;
	--blue-dark-hover: rgb(31, 96, 145);
	--blue-medium: #1f6091;
	--blue-mediumlight: #76aabc;
	--blue-light: #B2DAE7;
	--blue-lighter: #c9e9f4;
	--blue-lightest: #d7eff7;
	--gray-blue-medium: #7b99a3;
	--gray-shadow: #a29e9e;
	--gray-dark: #525151;
	--gray-medium: #777777;
	--gray-light: #e4e4e4;
	--red-soft: #e74545;
	--green-soft: #74c23c;
	--red-light: #f0a1a1;
	--green-light: #b7ef94;
	--yellow-soft: #ffec8c9e;
	}
</style>
