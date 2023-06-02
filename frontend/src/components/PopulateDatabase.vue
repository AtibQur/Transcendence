<template>
  <div>
    <h1>Populate Database</h1>
    <input type="text" v-model="playerId" placeholder="Enter Player ID">
    <p></p>
    <input type="text" v-model="username" placeholder="Enter username" />
    <button @click="setUsername">Change Username</button>
    <button @click="incrementWins">+1 Wins</button>
    <button @click="incrementLosses">+1 Losses</button>
    <button @click="incrementLadderLevel">+1 Ladder Level</button>
    <button @click="deletePlayer">Delete Player</button>

  </div>
  </template>
  
<script setup lang="ts">
    import { ref } from 'vue';
    import axiosInstance from '../axiosConfig';

    //constants
    const username = ref("");
    const playerId = ref("");

    //functions
    async function setUsername() {
      try {
        await axiosInstance.post('/changeusername', { id: playerId.value, username: username.value });
        console.log(`Username changed: ${username.value}`);
      } catch (error) {
        console.log("Error occured");
      }
    }

    async function incrementWins() {
      try {
        await axiosInstance.post('/incrementwins', {  id: playerId.value });
        console.log(`Incremented wins for player:  ${ playerId.value}`);
      } catch (error) {
        console.log("Error occured");
      }
    }

      async function incrementLosses() {
      try {
        await axiosInstance.post('/incrementlosses', {  id: playerId.value });
        console.log(`Incremented losses for player:  ${ playerId.value}`);
      } catch (error) {
        console.log("Error occured");
      }
    }

      async function incrementLadderLevel() {
      try {
        await axiosInstance.post('/incrementlevel', {  id: playerId.value });
        console.log(`Incremented level for player:  ${ playerId.value}`);
      } catch (error) {
        console.log("Error occured");
      }
    }

    async function deletePlayer() {
      try {
        const response = await axiosInstance.delete(`/deleteplayer/${playerId.value}`);
        console.log('Player deleted:', response.data);
      } catch (error) {
        console.error('Error deleting player:', error);
      }
    } 

  </script>
