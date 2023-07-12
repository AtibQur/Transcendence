<template>
  <div class="ProfileContainer">
    <div class="ProfileData">
      <div class="ProfilePicture">
        <img :src="profilePicture" alt="Avatar" style="width:100%">
      </div>
      <div class="ProfileInfo">
        <div class="ProfileName">
          <h1> {{ playerName }} </h1>
        </div>
        <div class="ProfileStatus">
          <h3>status: {{ friendStatus }}</h3>
        </div>
      </div>
    </div>
  </div>

  <div class="ProfileStats">
      <select v-model="selectedOption">
        <option value="Achievements">{{ playerName }}'s Achievements</option>
        <option value="Stats">Stats</option>
        <option value="Match History">Match History</option>
      </select>

      <div v-if="selectedOption === 'Achievements'" class="show">
        <FriendsAchievements />
      </div>
      <div v-else-if="selectedOption === 'Stats'" class="show">
        <ProfileStats />
      </div>
      <div v-else-if="selectedOption === 'Match History'" class="show">
        <ProfileHistory />
      </div>
    </div>

</template>

<script lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
import axiosInstance from '../../../axiosConfig';
import { useRoute } from 'vue-router';
import FriendsAchievements from './FriendsAchievements.vue';

export default {
  setup() {
    
    const route = useRoute();
    const playerName = computed(() => route.params.playerName || ''); // recieve the player name from router redirect
    const friendId = ref("");
    const profilePicture = ref("");
    const friendStatus = ref("");
    
    const fetchFriendId = async () => {
      const response = await axiosInstance.get(`player/profile/${playerName.value}`);
      friendId.value = response.data;
      return friendId.value;
    };
    
    const fetchProfilePicture = async () => {
      const response = await axiosInstance.get(`player/avatar/${friendId.value}`);
      const imageBytes: Uint8Array = new Uint8Array(response.data.data);
      const imageUrl = ref<string | null>(null);
      imageUrl.value = URL.createObjectURL(new Blob([imageBytes]));
      return imageUrl.value;
    };
    
    const fetchFriendStatus = async () => {
      const response = await axiosInstance.get(`player/status/${friendId.value}`);
      return response.data;
    };
    
    onBeforeMount(async () => {
      try {
        friendId.value = await fetchFriendId();
        profilePicture.value = await fetchProfilePicture();
        friendStatus.value = await fetchFriendStatus();
      } catch (error) {
        console.log("Error occurred:", error);
      }
    });
  
    return {
      profilePicture,
      friendStatus,
      playerName,
      FriendsAchievements,
    };
  }
};

</script>


<style scoped>
.ProfileContainer {
  position: absolute;
  left: 400px;
  top: 50%;
  transform: translateY(-50%);
  width: calc(100% - 800px);
  min-width: 1500px;
  height: 75vh;
  min-height: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid black;
}
  
  .ProfileData {
    position: absolute;
    left: 12%;
    top: 10%;
    width: 20%;
    height: 50%;
    margin-top: 10px;
    /* border: 1px solid black; */
  }
  .ProfileData .ProfilePicture {
    position: absolute;
    left: 50%;
    top: 0%;
    transform: translateX(-50%);
    width: 100%;
    height: 60%;
    /* border: 1px solid black; */
  }
  .ProfileData .ProfilePicture img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .ProfileData .ProfileInfo {
    position: absolute;
    left: 0%;
    top: 60%;
    width: 100%;
    height: 40%;
    /* border: 1px solid black; */
  }

  
</style>