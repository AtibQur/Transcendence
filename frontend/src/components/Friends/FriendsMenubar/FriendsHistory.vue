<template>
  <div class="border-container">
    <div class="border">
      <div class="border-match-info">
        <div class="user-info">
          <div class="player-infoRow">
            <div class="user-infoName">player</div>
            <div class="user-infoScore">score</div>
            <div class="enemy-infoScore">score</div>
            <div class="enemy-infoName">enemy</div>
          </div>
        </div>
      </div>

      <div class="border-text">
        <div v-for="(match, index) in matches" :key="index" class="border-row">
          <div class="border-value">{{ match.player.username }}</div>
          <div class="border-value">{{ match.player_points }}</div>
          <div class="border-value">{{ match.opponent_points }}</div>
          <div class="border-value">{{ match.opponent.username }}</div>
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
    const latestMatches = reversedMatches.slice(0, 13); // Fetch the latest 12 matches
    return latestMatches;
  };

  return {
    matches
  };
};

</script>

<style>
.border-match-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px; /* Add margin-bottom to match the spacing between matches */
}

.user-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px; /* Add margin-bottom to match the spacing between matches */
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
  border: 1px solid black;
  margin-bottom: 8px; /* Adjust the spacing between matches if needed */
  padding: 10px; /* Adjust the padding within each match border if needed */
}

.border .border-value {
  margin-bottom: 5px;
  flex-basis: 25%; /* Adjust the width of each value as needed */
}

</style>
