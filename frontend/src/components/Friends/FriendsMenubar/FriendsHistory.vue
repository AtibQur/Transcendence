<template>
  <div class="border-container">
    <div class="border">
      <div class="border-text">
        <div
          v-for="(match, index) in matches"
          :key="index"
          class="border-row"
          :class="['border-value', { 
            'green-bg': playerName === match.player.username && match.player_points > match.opponent_points,
            'red-bg': playerName === match.player.username && match.player_points < match.opponent_points,
            'green-bg1': playerName != match.player.username && match.player_points < match.opponent_points,
            'red-bg1': playerName != match.player.username && match.player_points > match.opponent_points,
          }]"
        >
          <div class="border-value blue-text player-username">
            <div v-if="match.player.username === playerUsername">You</div>
            <div v-else-if="playerName === match.player.username">{{ playerName }}</div>
            <div v-else-if="playerName != match.player.username">{{ match.player.username }}</div>
          </div>
          <div class="border-value black-text"  style="font-weight: bold">{{ match.player_points }}</div>
          <div class="border-value black-text"> VS </div>
          <div class="border-value black-text" style="font-weight: bold">{{ match.opponent_points }}</div>
          <div class="border-value blue-text enemy-username">
            <div v-if="match.opponent.username === playerUsername ">You</div>
            <div v-else-if="playerName === match.player.username">{{ match.opponent.username }}</div>
            <div v-else-if="playerName != match.player.username">{{ playerName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onBeforeMount } from 'vue';
import axiosInstance from '@/utils/axiosConfig'

export default {
  props: {
    friendId: {
      type: Number,
      required: true
    },
    playerName: {
      type: String
    },
  },
  setup(props) {
    const { matches, playerUsername} = useFriendsHistory(props.friendId);

    return {
      matches,
      playerUsername,
    };
  }
};

const useFriendsHistory = (friendId) => {
  const matches = ref('');
  const player = ref("");
  const playerId = parseInt(localStorage.getItem('playerId') || '0');
  const playerUsername = ref(""); // name that you use to log in

  onBeforeMount(async () => {
  try {
    matches.value = await fetchMatches(friendId);
    player.value = await fetchPlayerName(friendId);
    playerUsername.value = await fetchUserName(playerId);
  } catch (error) {
    console.error("Error occurred:", error);
  }
});

  const fetchMatches = async (friendId) => {
    const response = await axiosInstance.get(`match/history/` + friendId.toString());
    const reversedMatches = response.data.reverse();
    return reversedMatches;
  };

  const fetchPlayerName = async (playerId: string) => {
  try {
    const response = await axiosInstance.get('player/username/' + playerId.toString());
    const name = response.data;
    return name;
  } catch (error) {
    console.error("Error fetching player name:", error);
    throw error;
  }
};

  const fetchUserName = async (playerId: number) => {
  try {
    const response = await axiosInstance.get('player/username/' + playerId.toString());
    const name = response.data;
    return name;
  } catch (error) {
    console.error("Error fetching player name:", error);
    throw error;
  }

  };

  return {
    matches,
    player,
    playerUsername,
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
