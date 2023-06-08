<template>
  <div class="border-container">
    <div class="border">
      <div class="border-text">
        <div class="border-row">
          <div class="border-label">Total Achievements:</div>
          <div class="border-value">{{ totalAchievements }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue';
  import axiosInstance from '../../axiosConfig';

  const totalAchievements = ref("");

  //functions
  onBeforeMount(async () => {
    try {
      totalAchievements.value = await fetchAchievements(43); // hardcoded
      console.log(totalAchievements.value)
    } catch (error) {
      console.log("Error occured");
    }
  });

  const fetchAchievements = async (player_id: number) => {
    const response = await axiosInstance.get('player/totalachievements/43');
    console.log(response)
    return response.data;
  }

</script>

<style>
.border-container {
  height: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.border {
  border: 1px solid black;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.border-text {
  font-family: Arial, sans-serif;
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