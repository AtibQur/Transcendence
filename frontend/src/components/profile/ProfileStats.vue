<template>
  <div class="border-container">
    <div class="border">
      <div class="border-text">
        <div v-for="(item, index) in stats" :key="index" class="border-row">
          <div class="border-label">{{ item.label }}:</div>
          <div class="border-value">{{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref, computed } from 'vue';
  import axiosInstance from '../../axiosConfig';

  const totalAchievements = ref(0);
  const percentageWon = ref(0);
  const playerStats = ref({})
  const stats = computed(() => [
    { label: "Total Played Games", value: playerStats.value.wins + playerStats.value.losses },
    { label: "Total Wins", value: playerStats.value.wins },
    { label: "Total Losses", value: playerStats.value.losses },
    { label: "Percentage Games Won", value: percentageWon.value },
    { label: "Ladder Level", value: playerStats.value.ladder_level },
    { label: "Total Achievements", value: totalAchievements.value },
  ]);

  const playerId = parseInt(sessionStorage.getItem('playerId') || '0');

  onBeforeMount(async () => {
    try {
      totalAchievements.value = await fetchTotalAchievements(playerId);
      playerStats.value = await fetchPlayerStats(playerId);
      percentageWon.value = await fetchPercentageWon(playerId)
    } catch (error) {
      console.log("Error occured");
    } 
  });

  const fetchTotalAchievements = async (player_id: number) => {
    const response = await axiosInstance.get('player/totalachievements/' + player_id.toString());
    return response.data;
  }

  const fetchPlayerStats = async (player_id: number) => {
    const response = await axiosInstance.get('player/stats/' + player_id.toString());
    return response.data;
  }

  const fetchPercentageWon = async (player_id: number) => {
    const response = await axiosInstance.get('player/percentagewins/' + player_id.toString());
    let percentageWon = parseFloat(response.data).toFixed(1);
    return percentageWon;
  }

</script>

<style scoped>
.border-container {
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: aliceblue;
  border-radius: 8px;
}

.border {
  border: none;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.border-text {
  font-size: 18px;
}

.border-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.border-label {
  font-weight: bold;
}

.border-value {
  margin-left: 10px;
}
</style>