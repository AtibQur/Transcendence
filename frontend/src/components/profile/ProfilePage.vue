<template>
  <div class="ProfileContainer">
    <div class="ProfileData">
      <div class="ProfilePicture">
        <img :src="profilePicture" alt="Avatar" style="width:100%">
      </div>
      <div class="ProfileInfo">
        <div class="ProfileName">
          <h1>{{ username }}</h1>
        </div>
        <div class="ProfileStatus">
          <h3>status: {{ status }}</h3>
        </div>
      </div>
    </div>

    <div class="ProfileOptions">
      <div class="ProfileOptionsContainer">
        <ul>
          <li @click="changeUsernameModal">Name change</li>
          <li @click="changeProfilePicture">Picture change</li>
          <li @click="changeTfaStatus">2FA Authorisation</li>
          <li @click="logOut">Log out</li>
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

    <div v-if="showChangeNameModal" class="Modal" @click="closeModal">
      <div class="ModalContent" @click.stop>
        <h2>Name Change</h2>
        <input
          type="text"
          v-model="newName"
          placeholder="Enter a new name"
          @keydown.enter="changeUsername"
        />
        <div class="ModalButtons">
          <button @click="cancelNameChange">Cancel</button>
          <button @click="changeUsername">Save</button>
        </div>
      </div>
    </div>
    
    <div v-if="showChangePictureModal" class="Modal" @click="closeModal">
      <div class="ModalContent" @click.stop>
        <h2>Profile Picture Change</h2>
        <div v-if="showChangePictureModal" class="show">
          <ProfileAvatar @avatarUploaded="handleAvatarUploaded" />        </div>
        </div>
      </div>
      
      <div v-if="showChangeTfaModal" class="Modal" @click="closeModal">
        <div class="ModalContent" @click.stop>
          <h2>Change 2FA Status</h2>
          <div>
            <p>2FA Status: </p>
            <button @click="enableTFA">Enable</button>
            <button @click="disableTFA">Disable</button>
          </div>
        </div>
      </div>

  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue';
  import ImageComponent from '../Auth/ImageComponent.vue';
  import axiosInstance from '../../axiosConfig';
  import ProfileAchievements from "./ProfileAchievements.vue";
  import ProfileStats from "./ProfileStats.vue";
  import ProfileHistory from "./ProfileHistory.vue";
  import ProfileAvatar from './ProfileAvatar.vue';
  import { removeCookie, getCookie } from '../cookie_utils';
  import { removeDefaultAuthHeader } from '../../axiosConfig';
  import { useRouter } from 'vue-router';

  const username = ref("");
  const router = useRouter();
  const status = ref("");
  const selectedOption = ref("Achievements");
  const showChangeNameModal = ref(false);
  const showQRCode = ref(false);
  const newName = ref('');
  const profilePicture = ref("");
  const showChangePictureModal = ref(false);
  const showChangeTfaModal = ref(false);

  const playerId = parseInt(sessionStorage.getItem('playerId') || '0');

  onBeforeMount(async () => {
    try {
      username.value = await fetchUsername(playerId);
      profilePicture.value = await fetchAvatar(playerId);
      status.value = await fetchStatus(playerId);
      console.log(username.value);
    } catch (error) {
      console.log("Error occurred profpage");
    }
  });

  const fetchUsername = async (player_id: number) => {
    const response = await axiosInstance.get('player/username/' + player_id.toString());
    return response.data;
  }

  const fetchStatus = async (player_id: number) => {
    const response = await axiosInstance.get('player/status/' + player_id.toString());
    return response.data;
  }

  const fetchAvatar = async (player_id: number) => {
    const response = await axiosInstance.get('player/avatar/' + player_id.toString());
    const imageBytes: Uint8Array = new Uint8Array(response.data.data);
    const imageUrl = ref<string | null>(null);
    imageUrl.value = URL.createObjectURL(new Blob([imageBytes]));
    return imageUrl.value;
  };

  const changeUsernameModal = () => {
    showChangeNameModal.value = true;
  };

  const changeTfaStatus = () => {
    showChangeTfaModal.value = true;
  };

  const changeUsername = async () => {
  if (newName.value) {
    try {
      const updatedUsername = await axiosInstance.patch(`player/username/${playerId}`, { username: newName.value });
      username.value = updatedUsername.data; // Update the local username value
      if (newName.value != username.value) {
        throw new Error("Username already exists");
      }
      sessionStorage.setItem('username', username.value); //update sessionstorage
      closeModal();
    } catch (error) {
      alert("Username already exists. Please choose a different username.");
      console.log(error);
    }
  }
};

  async function logOut() {
        removeCookie('auth');
        removeDefaultAuthHeader();
        router.push('http://localhost:8080/')
    }

  const cancelNameChange = () => {
    showChangeNameModal.value = false;
    newName.value = '';
  };

  const changeProfilePicture = () => {
    showChangePictureModal.value = true;
  };

  const enableTFA = async () => {
    showChangeTfaModal.value = false;
    try {
      router.push({ name: '2fa' });
    } catch (error) {
      alert("Two Factor Authorization could not be enabled");
    }
  };

  const disableTFA = async () => {
    showChangeTfaModal.value = false;
    try {
      await axiosInstance.get('user/disable2fa');
      alert("Two Factor Authorization disabled");
    } catch (error) {
      alert("Two Factor Authorization could not be disabled");
    }
  };

  const handleAvatarUploaded = async (avatarBytes: Uint8Array) => {
    showChangePictureModal.value = false;
    profilePicture.value = await fetchAvatar(playerId)
  };

  const closeModal = () => {
    showChangeNameModal.value = false;
    showChangePictureModal.value = false;
    newName.value = '';
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