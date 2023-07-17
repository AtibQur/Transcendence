<template>
  <div class="border-container">
    <div class="border">
      <div class="border-text">
        <div v-for="(match, index) in matches" :key="index" class="border-row">
          <div class="border-value">{{ match.player.username }} {{ match.player_points }}</div>
          <div class="border-value">{{ match.opponent_points }} {{ match.opponent.username }}</div>
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
      type: String,
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
    const response = await axiosInstance.get(`match/history/${friendId}`);
    return response.data;
  };

  return {
    matches
  };
};

</script>

<style>
</style>