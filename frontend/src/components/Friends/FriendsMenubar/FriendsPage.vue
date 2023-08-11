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

    <div class="ProfileOptions">
      <div class="ProfileOptionsContainer">
        <ul>
          <div v-if="!isFriend">
            <li @click="addFriend()">Add Friend</li>
          </div>
          <div v-if="!isBlocked">
            <li @click="blockPlayer()">Block</li>
          </div>
          <div v-if="!isFriend && isBlocked">
            <li @click="unblockPlayer()">Unblock</li>
          </div>
        </ul>
      </div>
    </div>

    <div class="ProfileStats">
      <select v-model="selectedOption">
        <option value="Achievements">Achievements</option>
        <option value="Stats">Stats</option>
        <option value="Match History">Match History</option>
      </select>

      <div v-if="selectedOption === 'Achievements'" class="show">
        <FriendsAchievements :friendId="Number(friendId)" />
      </div>
      <div v-else-if="selectedOption === 'Stats'" class="show">
        <FriendsStats :friendId="Number(friendId)" />
      </div>
      <div v-else-if="selectedOption === 'Match History'" class="show">
        <FriendsHistory :friendId="Number(friendId)" :playerName="playerName" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, watch, ref } from 'vue';
import axiosInstance from '../../../axiosConfig';
import { useRoute, useRouter } from 'vue-router';
import FriendsStats from './FriendsStats.vue';
import FriendsHistory from './FriendsHistory.vue';
import FriendsAchievements from './FriendsAchievements.vue';
import { useToast } from 'primevue/usetoast';

export default {
  components: {
    FriendsAchievements,
    FriendsHistory,
    FriendsStats
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const playerName = ref('');
    const friendId = ref('');
    const friendStatus = ref('');
    const profilePicture = ref('');
    const selectedOption = ref('Achievements');
    const playerId = localStorage.getItem('playerId') || '0';
    const isFriend = ref(false);
    const isBlocked = ref(false);
    const toast = useToast();

    const fetchFriendData = async () => {
      const params = route.params;
      try {
        const idResponse = await axiosInstance.get(`player/profile/${params.playerName}`);
        const avatarResponse = await axiosInstance.get(`player/avatar/${idResponse.data}`);
        const statusResponse = await axiosInstance.get(`player/status/${idResponse.data}`);
        
        playerName.value = params.playerName;
        friendId.value = idResponse.data;
        profilePicture.value = URL.createObjectURL(new Blob([new Uint8Array(avatarResponse.data.data)]));
        friendStatus.value = statusResponse.data;
        selectedOption.value = 'Achievements'; // Set selectedOption to 'Achievements' whenever a new profile is loaded
        
        const isFriendResponse = await axiosInstance.get(`friend/exists/${playerId}/${friendId.value.toString()}`);
        isFriend.value = isFriendResponse.data;

        const isBlockedResponse = await axiosInstance.get(`blockedplayer/player/${playerId}?username=${playerName.value}`);
        isBlocked.value = isBlockedResponse.data;
      } catch (error) {
        console.log('Error occurred:', error);
      }
    };

    const addFriend = async () => {
        const friendResponse = await axiosInstance.post(`friend/add/${playerId}`, {friendUsername: playerName.value});
        if (friendResponse.data)
        {
            toast.add({ severity: 'success', summary: 'Added friend successfully', detail: '', life: 3000 });
            isFriend.value = true;
            isBlocked.value = false;
        }
        else
            toast.add({ severity: 'error', summary: 'Error adding friend', detail: '', life: 3000 });
    }

    const blockPlayer = async () => {
        const blockPlayerResponse = await axiosInstance.post(`blockedplayer/add/${playerId}`, {blockedUsername: playerName.value});
        if (blockPlayerResponse.data)
        {
            if (isFriend.value == true)
            {
              const deleteFriendship = await axiosInstance.delete(`friend/${playerId}`, { data: {friendUsername: playerName.value}});
              if (deleteFriendship.data)
                isFriend.value = false;
            }
            isBlocked.value = true;
            toast.add({ severity: 'success', summary: 'Blocked player successfully', detail: '', life: 3000 });
        }
        else
            toast.add({ severity: 'error', summary: 'Error blocking player', detail: '', life: 3000 });
    }

    const unblockPlayer = async () => {
        const unblockPlayerResponse = await axiosInstance.delete(`blockedplayer/delete/${playerId}`, { data: {blockedUsername: playerName.value}});
        if (unblockPlayerResponse.data)
        {
            toast.add({ severity: 'success', summary: 'Unblocked player successfully', detail: '', life: 3000 });
            isBlocked.value = false;
        }
        else
            toast.add({ severity: 'error', summary: 'Error unblocking player', detail: '', life: 3000 });
    }

    // Watch for changes in route params and fetch friend data
    watch(route, () => {
      fetchFriendData();
    });

    // Watch for changes in playerName and navigate to the current profile page
    watch(playerName, () => {
      router.push({
        name: 'friends',
        params: {
          playerName: playerName.value,
          profilePicture: profilePicture.value,
          status: friendStatus.value
        }
      });
    });

    onMounted(() => {
      fetchFriendData();
    });

    return {
      playerName,
      playerId,
      friendId,
      profilePicture,
      friendStatus,
      selectedOption,
      FriendsAchievements,
      FriendsHistory,
      FriendsStats,
      isFriend,
      isBlocked,
      addFriend,
      blockPlayer,
      unblockPlayer
    };
  },
};
</script>


<style scoped>
.ProfileContainer {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 1500px;
  width: calc(100% - 800px);
  height: 75vh;
  min-height: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
    left: 10%;
    top: 55%;
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

  .custom-dropdown {
    font-family: 'JetBrains Mono';
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
  border-radius: 8px;
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
  margin: 5 5px;
}
.ModalContent button:hover {
  color: #fefefe; /* Change color on hover */
  background-color: #697b8e;
}

.message-input {
  font-family: 'JetBrains mono';
  border-radius:10px;
  border: none;
  padding: 10px;
  margin-bottom: 50px;
}
  </style>