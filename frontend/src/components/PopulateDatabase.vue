<template>
  <div>
    <h1>Populate Database</h1>
    <input type="text" v-model="username" placeholder="Enter username" />
    <button @click="setUsername">Set Username</button>
  
    <button @click="incrementWins">+1 Wins</button>
    <button @click="incrementLosses">+1 Losses</button>
    <button @click="incrementLadderLevel">+1 Ladder Level</button>
  </div>
  </template>
  
<script setup lang="ts">
    import axios from 'axios';
    import { ref } from 'vue';

    //constants
    const username = ref("");

    //functions
    async function setUsername() {
      try {
        await axios.post('http://localhost:3000', { username: username.value });
        console.log(`New user has been created: ${username.value}`);
      } catch (error) {
        console.log("Error occured");
      }
    }
  </script>
