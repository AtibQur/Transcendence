<template>
  <div class="ProfileContainer">
    <div class="ProfileData">
      <div class="ProfilePicture">
        <img :src="profilePicture" alt="Avatar" style="width:100%">
      </div>
      <div class="ProfileInfo">
        <div class="ProfileName">
          <h1>{{ playerName }}</h1>
        </div>
        <div class="ProfileStatus">
          <h3>status: {{ friendStatus }}</h3>
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
        <FriendsAchievements :friendId="Number(friendId)" />
      </div>
      <div v-else-if="selectedOption === 'Stats'" class="show">
        <FriendsStats :friendId="friendId" />
      </div>
      <div v-else-if="selectedOption === 'Match History'" class="show">
        <FriendsHistory :friendId="friendId" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
import axiosInstance from '../../../axiosConfig';
import { useRoute } from 'vue-router';
import FriendsStats from './FriendsStats.vue';
import FriendsHistory from './FriendsHistory.vue';
import FriendsAchievements from './FriendsAchievements.vue';

export default {
  components: {
    FriendsAchievements,
    FriendsHistory,
    FriendsStats,
  },
  setup() {
    const route = useRoute();
    const playerName = computed(() => route.params.playerName || '');
    const friendId = ref('');
    const friendStatus = ref('');
    const profilePicture = ref('');
    const selectedOption = ref('Achievements');

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
      friendId,
      profilePicture,
      friendStatus,
      playerName,
      selectedOption,
      FriendsAchievements,
      FriendsHistory,
      FriendsStats,
    };
  },
};
</script>

<style>
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
  
  .ProfileOptions {
    position: absolute;
    left: 5%;
    top: 65%;
    width: 25%;
    height: 30%;
    /* border: 1px solid black; */
  }
  .ProfileOptions .ProfileOptionsContainer {
    position: absolute;
    left: 0%;
    top: 15%;
    width: 100%;
    height: 70%;
    /* border: 1px solid black; */
  }
  .ProfileOptions .ProfileOptionsContainer ul {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 75%;
    /* border: 1px solid black; */
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  .ProfileOptions .ProfileOptionsContainer ul li {
  width: 100%;
  height: 25%;
  font-size: 22px;
  font-weight: 400;
  text-align: left;
  cursor: pointer; /* Add cursor style to indicate interactivity */
  transition: color 0.3s, background-color 0.3s; /* Add transition for smooth effect */
}

.ProfileOptions .ProfileOptionsContainer ul li:hover {
  color: #1f6091; /* Change color on hover */
}

  .ProfileOptions .ProfileOptionsContainer ul li a {
    color: #134279;
    font-family: JetBrains Mono;
    text-decoration: none;
    line-height: 20px;
  }
  .ProfileOptions .ProfileOptionsContainer ul li a:hover {
    color: #1f6091;
    font-weight: bold;
  }
  
  .ProfileStats {
    position: absolute;
    left: 40%;
    top: 10%;
    width: 35%;
    height: 3%;
    border: 1px round black;
    border-radius: 8px;
    background-color: aliceblue;
  }
  
  .ProfileStats select {
    width: 100%;
    padding: 5px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  
  .ProfileStats > div {
    display: none;
  }
  
  .ProfileStats > div.show {
    display: block;
  }
  .Modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ModalContent {
  background-color: aliceblue; 
  padding: 20px;
  border: 1px solid #888;
  border-radius: 4px;
  text-align: center;
  width: 30%; /* Adjust the width as desired */
}

.ModalContent h2 {
  margin-top: 0;
}

.ModalContent input {
  width: 50%;
  padding: 10px;
  margin-bottom: 10px;
}

.ModalButtons {
  display: flex;
  justify-content: center;
}

.ModalButtons button {
  margin: 0 5px;
}
.ModalContent button:hover {
  color: #fefefe; /* Change color on hover */
  background-color: #697b8e;
}
  </style>