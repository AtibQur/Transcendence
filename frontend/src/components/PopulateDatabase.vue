<template>
  <div>
    <h1>Populate Database</h1>
    <input type="text" v-model="new_username" placeholder="Enter new username" />
    <button @click="createPlayer">Create player</button>
    <p></p>

  </div>
  </template>
  
<script setup lang="ts">
    import { ref } from 'vue';
    import axiosInstance from '../axiosConfig';

    //constants
    const new_username = ref("");

    //functions
    async function createPlayer() {
      try {
        await axiosInstance.post('/player/create', { username: new_username.value });
        console.log(`Created player: ${new_username.value}`);
      } catch (error) {
        console.log("Error occured");
      }
    }


  </script>
