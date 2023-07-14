<template>
    <div class="border-container">
      <div class="border">
      <div class="border-text">
        <div v-for="(match, index) in matches" :key="index" class="border-row">
          <div class="border-value">{{ match.player.username }} {{ match.player_points }} </div>
          <div class="border-value">{{ match.opponent_points }} {{ match.opponent.username }} </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue';
  import axiosInstance from '../../../axiosConfig';

  const matches = ref("");
  const playerId = parseInt(localStorage.getItem('playerId') || '0');
  

  onBeforeMount(async () => {
  try {
    matches.value = await fetchMatches(playerId);
    console.log(matches.value);
  } catch (error) {
    console.log("Error occured");
  }
  });

  const fetchMatches = async (player_id: number) => {
    const response = await axiosInstance.get('match/history/' + player_id.toString());
    return response.data;
  }
</script>

<style>
</style>