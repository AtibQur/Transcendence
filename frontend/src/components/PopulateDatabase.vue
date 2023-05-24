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
    import { ref } from 'vue';
    import axiosInstance from '../axiosConfig';

    //constants
    const username = ref("");

    //functions
    async function setUsername() {
      try {
        await axiosInstance.post('/createplayer', { username: username.value });
        console.log(`New user has been created: ${username.value}`);
      } catch (error) {
        console.log("Error occured");
      }
    }

    async function incrementWins() {
      try {
        // TODO: hoe weet je welke id?
        const id = 1;
        await axiosInstance.post('/incrementwins', { id });
        console.log(`Incremented wins for player:  ${id}`);
      } catch (error) {
        console.log("Error occured");
      }
    }

      async function incrementLosses() {
      try {
        // TODO: hoe weet je welke id?
        const id = 1;
        await axiosInstance.post('/incrementlosses', { id });
        console.log(`Incremented losses for player:  ${id}`);
      } catch (error) {
        console.log("Error occured");
      }
    }

      async function incrementLadderLevel() {
      try {
        // TODO: hoe weet je welke id?
        const id = 1;
        await axiosInstance.post('/incrementlevel', { id });
        console.log(`Incremented level for player:  ${id}`);
      } catch (error) {
        console.log("Error occured");
      }
    }
  </script>
