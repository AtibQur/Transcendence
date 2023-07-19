<template>
  <div class="border-container">
    <div class="border">
      <div class="border-match-info">
        <div class="user-info">
          <div class="player-infoRow">
            <div class="user-infoName blue-text">player</div>
            <div class="user-infoScore black-text">score</div>
            <div class="enemy-infoScore black-text">score</div>
            <div class="enemy-infoName blue-text">enemy</div>
          </div>
        </div>
      </div>

      <div class="border-text">
        <div
          v-for="(match, index) in matches"
          :key="index"
          class="border-row"
          :class="['border-value', { 'green-bg': match.player_points === 5, 'red-bg': match.player_points !== 5 }]"
        >
          <div class="border-value blue-text player-username">{{ match.player.username }}</div>
          <div class="border-value black-text">{{ match.player_points }}</div>
          <div class="border-value black-text">{{ match.opponent_points }}</div>
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
    const latestMatches = reversedMatches.slice(0, 14); // Fetch the latest 13 matches
    return latestMatches;
  };

  return {
    matches
  };
};

</script>

<style>
.border-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  background-color: aliceblue;
}

.border-match-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.user-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.player-infoRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
  margin-left: 50px;
  text-align: center;

}

.player-infoRow > *:not(:last-child) {
  margin-right: 100px;
}

.border .border-row {
  display: flex;
  justify-content: space-between;
  /* border: 1px solid black; */
  border: none;
  margin-bottom: 8px;
  padding: 10px;
  transition: background-color 0.3s ease;
}

.border .border-value {
  margin-bottom: 5px;
  flex-basis: 25%;
}

.green-bg {
  background-color: rgba(39, 168, 39, 0.900);
}
.green-bg:hover {
  background-color: rgb(34, 194, 34);
}

.red-bg {
  background-color: rgba(197, 49, 49, 0.900);
}
.red-bg:hover {
  background-color: rgb(195, 45, 45);
}

.blue-text {
  color: #134279;
  font-weight: bold;
}

.black-text {
  color: black;
  font-weight: bold;
}

.user-infoName {
  /* margin-right: 50px; */
}
.enemy-username {
  margin-right: 10px;
}
</style>
