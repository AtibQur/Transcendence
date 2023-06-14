<template>
  <div>
    <button @click="toggleButton" :class="{ 'expanded': isExpanded }"></button>
  </div>
</template>

<script lang="ts">
// import { Vue, Component } from 'vue';

// @Component
// export default class MyButton extends Vue {
//   isExpanded = false;

//   toggleButton(): void {
//     this.isExpanded = !this.isExpanded;
//   }
// }
</script>

<style scoped>
button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: #f1f1f1;
  border: 1px solid #000000;
  border-radius: 5px;
  transition: width 0.5s;
  cursor: pointer;
}

button.expanded {
  width: 20%;
}
</style>