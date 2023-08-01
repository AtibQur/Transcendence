<template>
  <div class="border-container">
    <div class="border">
      <div class="border-text">
        <div
          v-for="(match, index) in matches"
          :key="index"
          class="border-row"
          :class="['border-value', { 'green-bg': match.player_points > match.opponent_points, 'red-bg': match.player_points < match.opponent_points, 'yellow-bg': match.player_points === match.opponent_points }]"
        >
          <div class="border-value blue-text player-username">{{ match.player.username }}</div>
          <div class="border-value black-text"  style="font-weight: bold">{{ match.player_points }}</div>
          <div class="border-value black-text"> VS </div>
          <div class="border-value black-text" style="font-weight: bold">{{ match.opponent_points }}</div>
          <div class="border-value blue-text enemy-username">{{ match.opponent.username }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onBeforeMount } from 'vue';
import axiosInstance from '../../../axiosConfig';

export default {
  props: {
    friendId: {
      type: Number,
      required: true
    },
  },
  setup(props) {
    const { matches } = useFriendsHistory(props.friendId);

    return {
      matches
    };
  }
};

const useFriendsHistory = (friendId) => {
  const matches = ref('');

  onBeforeMount(async () => {
    try {
      matches.value = await fetchMatches(friendId);
    } catch (error) {
      console.log("Error occurred");
    }
  });

  const fetchMatches = async (friendId) => {
    const response = await axiosInstance.get(`match/history/` + friendId.toString());
    const reversedMatches = response.data.reverse(); // Reverse the order of matches
    return reversedMatches;
  };

  return {
    matches
  };
};

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
