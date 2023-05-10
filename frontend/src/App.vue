<template>
  <AppHome />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Home from './components/views/Home.vue';

export default defineComponent({
  name: 'app',
  components: {
    AppHome: Home,
  }
});
</script>

<style>
#app {
  background-color: #60b2c4;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #27425c;
}
</style>
