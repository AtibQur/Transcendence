<template>
    <div class="ProfileContainer">
      <div class="ProfileData">
        <div class="ProfilePicture">
          <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" style="width:100%">
        </div>
        <div class="ProfileInfo">
          <div class="ProfileName">
            <h1> {{ username }} </h1>
          </div>
          <div class="ProfileStatus">
            <h3>status: Hardcoded Online</h3>
          </div>
        </div>
      </div>
  
      <div class="ProfileOptions">
        <div class="ProfileOptionsContainer">
          <ul>
            <li @click="changeUsername()">Name change</li>
            <li>Picture change</li>
            <li>2FA Authorisation</li>
            <li></li>
          </ul>
        </div>
      </div>
  
      <div class="ProfileStats">
        <select v-model="selectedOption">
          <option value="Achievements">{{ username }}'s Achievements</option>
          <option value="Stats">Stats</option>
          <option value="Match History">Match History</option>
        </select>
  
        <div v-if="selectedOption === 'Achievements'" class="show">
            <ProfileAchievements />
        </div>
        <div v-else-if="selectedOption === 'Stats'" class="show">
            <ProfileStats />
        </div>
        <div v-else-if="selectedOption === 'Match History'" class="show">
            <ProfileHistory />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onBeforeMount, ref} from 'vue';
  import axiosInstance from '../../axiosConfig';
  import ProfileAchievements from "./ProfileAchievements.vue";
  import ProfileStats from "./ProfileStats.vue";
  import ProfileHistory from "./ProfileHistory.vue";

  const username = ref("");
  const selectedOption = ref("Achievements");

  onBeforeMount(async () => {
  try {
    const playerId = 3;
    username.value = await fetchUsername(playerId);
    console.log(username.value);
  } catch (error) {
    console.log("Error occured");
  }
});

const fetchUsername = async (player_id: number) => {
  const response = await axiosInstance.get('player/username/' + player_id.toString());
  return response.data;
}

const changeUsername = async () => {
  const newUsername = prompt('Enter a new username');
  if (newUsername) {
    try {
      const playerId = 3;
      const updatedUsername = await axiosInstance.patch(`player/username/${playerId}`, { username: newUsername });
      username.value = updatedUsername.data; // Update the local username value
    } catch (error) {
      console.log('Error occurred while updating username:', error);
    }
  }
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
  border: 1px solid black;
}
  
  .ProfileData {
    position: absolute;
    left: 12%;
    top: 10%;
    width: 20%;
    height: 50%;
    margin-top: 10px;
    border: 1px solid black;
  }
  .ProfileData .ProfilePicture {
    position: absolute;
    left: 50%;
    top: 0%;
    transform: translateX(-50%);
    width: 100%;
    height: 60%;
    border: 1px solid black;
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
    border: 1px solid black;
  }
  
  .ProfileOptions {
    position: absolute;
    left: 5%;
    top: 65%;
    width: 25%;
    height: 30%;
    border: 1px solid black;
  }
  .ProfileOptions .ProfileOptionsContainer {
    position: absolute;
    left: 0%;
    top: 15%;
    width: 100%;
    height: 70%;
    border: 1px solid black;
  }
  .ProfileOptions .ProfileOptionsContainer ul {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 75%;
    border: 1px solid black;
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
  </style>

