<template>
  <div class="scrollable-container">
    <div class="content">
      <ul class="item-list">
        <li v-for="(value, key) in achievements" :key="key" class="item">
          <div class="image-container"></div>
          <div :class="['name-container', { 'bold-black': value, 'regular-grey': !value }]">
            <div class="item-name">{{ key }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue';
  import axiosInstance from '../../axiosConfig';
  
  const achievements = ref({});
  const playerId = parseInt(sessionStorage.getItem('playerId') || '0');

  onBeforeMount(async () => {
      try {
        achievements.value = await fetchAchievements(playerId);
      } catch (error) {
        console.log("Error occured");
      }
    });

  const fetchAchievements = async (player_id: number) => {
    const response = await axiosInstance.get('player/achievements/' + player_id.toString());
    return response.data;
  }

</script>


<style scoped>
.scrollable-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;
  height: 700px;
  border-radius: 8px;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: aliceblue;
}

.content {
  width: 100%;
}

.item-list {
  list-style-type: none;
  padding: 0;
}

.item {
  display: flex;
  align-items: center;
  border: 1px solid var(--gray-medium);
  border-radius: 8px;
  margin: 10px;
  padding: 10px;
  flex-basis: 30%;
  transition: background-color 0.3s ease;
}

.item:hover {
  background-color: lightgray;
}

.image-container {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  border: 2px solid #ccc;
  border-radius: 4px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name-container {
  flex: 1;
}

.item-name {
  text-align: center;
}

.bold-black {
  font-weight: bold;
  font-size: medium;
  color: black;
}

.regular-grey {
  font-weight: normal;
  font-size: medium;
  color: grey;
}
</style>
