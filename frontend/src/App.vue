<template>
	<h1>Vue: Hello Nest</h1>
	<h1>Nest: {{ answer }}</h1>
	<HelloWorld msg="Welcome to Your Vue.js App"/>
	<nav>
		<router-link to="/">Home</router-link> |
		<router-link to="/about">About</router-link>
	</nav>
	<router-view/>
  </template>

<script>
		import axios from 'axios'
		export default {
			data() {
				return {
					answer: ''
				}
			},
			mounted () {
				axios.get('http://localhost:3000/')
					.then(response => this.answer = response.data)
			}
		}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
</style>
