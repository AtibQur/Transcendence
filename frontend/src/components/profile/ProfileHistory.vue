<template>
  <div class="border-container">
    <div class="border">
      <div class="border-text">
        <div
          v-for="(match, index) in matches"
          :key="index"
          class="border-row"
          :class="['border-value', { 
            'green-bg': props.username === match.player.username && match.player_points > match.opponent_points,
            'red-bg': props.username === match.player.username && match.player_points < match.opponent_points,
            'green-bg1': props.username !== match.player.username && match.player_points < match.opponent_points,
            'red-bg1': props.username != match.player.username && match.player_points > match.opponent_points,
          }]"
        >
        <div class="border-value blue-text player-username">
            {{ match.player.username == props.username ? 'You' : match.player.username}}
          </div>
          <div class="border-value black-text"  style="font-weight: bold">{{ match.player_points }}</div>
          <div class="border-value black-text"> VS </div>
          <div class="border-value black-text" style="font-weight: bold">{{ match.opponent_points }}</div>
          <div class="border-value blue-text enemy-username">
            {{ match.opponent.username == props.username ? 'You' : match.opponent.username}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, onBeforeMount, ref } from 'vue';
import axiosInstance from '../../axiosConfig';

const matches = ref([]);
const playerId = parseInt(localStorage.getItem('playerId') || '0');
const playerName = ref("");

const props = defineProps({
  username: String as PropType<string>,
});

onBeforeMount(async () => {
  try {
    matches.value = await fetchMatches(playerId);
    playerName.value = await fetchPlayerName(playerId);
  } catch (error) {
    console.log("Error occurred:", error);
  }
});

const fetchMatches = async (playerId: number) => {
  const response = await axiosInstance.get('match/history/' + playerId.toString());
  const reversedMatches = response.data.reverse();
  return reversedMatches;
};

const fetchPlayerName = async (playerId: number) => {
  const name = await axiosInstance.get('player/username/' + playerId.toString());
  return name;
}
</script>

<style scoped>
.border-container {
  min-height: 300px;
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
  max-height: 700px;
  overflow-y: auto;
}

.border .border-row {
  font-family: 'JetBrains Mono';
  font-size: 18px;
  display: flex;
  border: none;
  border-radius: 18px;
  padding: 15px;
}

.border .border-value {
  margin: 10px;
  flex-basis: 25%;
}

.green-bg {
  background-color: var(--green-light);
}

.red-bg {
  background-color: var(--red-light);
}
.green-bg1 {
  background-color: var(--green-light);
}

.red-bg1 {
  background-color: var(--red-light);
}

.yellow-bg {
  background-color: var(--yellow-soft);
}

.blue-text {
  color: rgb(43, 43, 43);
}

.black-text {
  color: black;
  font-weight: regular;
}
</style>
