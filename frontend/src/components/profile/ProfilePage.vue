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
    <div class="ProfileScrollContainer">
      <div class="ProfileStats">
        <select v-model="selectedOption" class="custom-dropdown">
          <option value="Achievements">Achievements</option>
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
          <ProfileHistory :username="username" />
        </div>
      </div>

      <div class="ProfileOptions">
        <div class="ProfileOptionsContainer">
          <ul>
            <button class="custom-button-1" @click="changeUsernameModal">Change username</button>
            <button class="custom-button-1" @click="changeProfilePicture">Change picture</button>
            <button class="custom-button-1" @click="changeTfaStatus">2FA Authorisation</button>
            <button class="custom-button-1" @click="logOut">Log out</button>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="showChangeNameModal" class="Modal" @click="closeModal">
      <div class="ModalContent" @click.stop>
        <h2>Username Change</h2>
        <input
          type="text"
          v-model="newName"
          placeholder="Enter a new username"
          class="message-input"
          @keydown.enter="changeUsername"
        />
        <div class="ModalButtons">
          <button class="custom-button-1" @click="cancelNameChange">Cancel</button>
          <button class="custom-button-1" @click="changeUsername">Save</button>
        </div>
      </div>
    </div>
    
    <div v-if="showChangePictureModal" class="Modal" @click="closeModal">
      <div class="ModalContent" @click.stop>
        <h2>Profile Picture Change</h2>
        <button class="custom-button-2" onclick="window.open('https://getavataaars.com/', '_blank');">Design your own avatar!</button>
        <div v-if="showChangePictureModal" class="show">
          <ProfileAvatar @avatarUploaded="handleAvatarUploaded" />
        </div>
      </div>
    </div>
      
    <div v-if="showChangeTfaModal" class="Modal" @click="closeModal">
      <div class="ModalContent" @click.stop>
        <h2>Change 2FA Status</h2>
        <div>
          <p>Two-factor authentication is currently <strong>{{ twofastatus }}</strong></p>
          <button v-if="twofastatus === 'disabled'" class="custom-button-1" @click="enableTFA">Enable</button>
          <button v-else-if="twofastatus === 'enabled'" class="custom-button-1" @click="disableTFA">Disable</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue';
  import ProfileAchievements from "./ProfileAchievements.vue";
  import ProfileStats from "./ProfileStats.vue";
  import ProfileHistory from "./ProfileHistory.vue";
  import ProfileAvatar from './ProfileAvatar.vue';
  import { removeCookie } from '@/utils/cookie_utils';
  import axiosInstance, { removeDefaultAuthHeader } from '@/utils/axiosConfig';
  import { useRouter } from 'vue-router';
  import { useToast } from 'primevue/usetoast';

  const username = ref("");
  const router = useRouter();
  const status = ref("");
  const selectedOption = ref("Achievements");
  const showChangeNameModal = ref(false);
  const newName = ref('');
  const profilePicture = ref("");
  const showChangePictureModal = ref(false);
  const showChangeTfaModal = ref(false);
  const toast = useToast();

  const playerId = parseInt(localStorage.getItem('playerId') || '0');

  const twofastatus = ref('');

  onBeforeMount(async () => {
    try {
      username.value = await fetchUsername(playerId);
      profilePicture.value = await fetchAvatar(playerId);
      status.value = await fetchStatus(playerId);
      twofastatus.value = await fetchTwoFAStatus(playerId);
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

  const fetchTwoFAStatus = async (player_id: number) => {
    const response = await axiosInstance.get('player/twofastatus/' + player_id.toString());
    if (response.data) {
      return 'enabled';
    }
    else {
      return 'disabled';
    }
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
    var message = "";
    try {
      if (newName.value.length > 20) {
        message = "Username too long. Max 20 characters please!";
        throw new Error(message);
      }
      else if (newName.value.length < 3) {
        message = "Username too short. Min 3 characters please!";
        throw new Error(message);
      }
      const updatedUsername = await axiosInstance.patch(`player/username/${playerId}`, { username: newName.value });
      username.value = updatedUsername.data;
      if (newName.value !== username.value) {
        message = "Username already exists";
        throw new Error(message);
      }
      localStorage.setItem('username', username.value);
      closeModal();
    }
    catch (error) {
      toast.add({ severity: 'error', summary: message, detail: '', life: 3000 });
      console.log(error);
    }
  }
};

  async function logOut() {
        removeCookie('auth');
        removeDefaultAuthHeader();
        localStorage.removeItem('playerId')
        localStorage.removeItem('intraUsername')
        localStorage.removeItem('username')
        localStorage.removeItem('logged')
        toast.add({ severity: 'info', summary: 'Successfully logged out', detail: 'Log out on profile.intra.42.fr to fully log out', life: 6000 });
        router.push(process.env.VUE_APP_HOST_COMPUTER + ':8080/auth')
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
    toast.add({ severity: 'success', summary: "Two Factor Authorization enabled", detail: '', life: 3000 });
    try {
      router.push({ name: '2fa' });
      twofastatus.value = 'enabled';
    } catch (error) {
      toast.add({ severity: 'error', summary: "Two Factor Authorization could not be enabled", detail: '', life: 3000 });

    }
  };

  const disableTFA = async () => {
    showChangeTfaModal.value = false;
    try {
        await axiosInstance.patch('user/disable2fa', {two_factor_enabled: false});
        toast.add({ severity: 'success', summary: "Two Factor Authorization disabled", detail: '', life: 3000 });
        showChangeTfaModal.value = false;
        twofastatus.value = 'disabled';
    } catch (error) {
      toast.add({ severity: 'error', summary: "Two Factor Authorization could not be disabled", detail: '', life: 3000 });
    }
  };

  const handleAvatarUploaded = async () => {
    showChangePictureModal.value = false;
    profilePicture.value = await fetchAvatar(playerId)
  };

  const closeModal = () => {
    showChangeNameModal.value = false;
    showChangePictureModal.value = false;
    showChangeTfaModal.value = false;
    newName.value = '';
  };

</script>
  
<style scoped>
.ProfileContainer {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 1500px;
  width: 100%;
  height: 100%;
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
  }

  .ProfileData .ProfileInfo {
    position: absolute;
    left: 0%;
    top: 60%;
    width: 100%;
    height: 40%;
  }
  
  .ProfileOptions {
    position: absolute;
    left: 10%;
    top: 55%;
    width: 25%;
    height: 30%;
  }

  .ProfileData .ProfilePicture {
    position: absolute;
    left: 50%;
    top: 0%;
    transform: translateX(-50%);
    width: 300px;
    height: 300px;
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

  .ProfileOptions .ProfileOptionsContainer {
    position: absolute;
    left: 0%;
    top: 15%;
    width: 100%;
    height: 70%;
  }
  .ProfileOptions .ProfileOptionsContainer ul {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 75%;
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
  cursor: pointer;
  transition: color 0.3s, background-color 0.3s;
}

.ProfileOptions .ProfileOptionsContainer ul li:hover {
  color: #1f6091;
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
  width: 30%;
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
  color: #fefefe;
  background-color: #697b8e;
}

.message-input {
  font-family: 'JetBrains mono';
  border-radius:10px;
  border: none;
  padding: 10px;
  margin-bottom: 50px;
}
@media screen and (max-width: 1040px) {
  .ProfileContainer {
    flex-direction: row;
    height: auto;
    padding: 20px;
  }

  .ProfileData {
    order: 1;
  }

  .ProfileOptions {
    order: 3;
  }

  .ProfileStats {
    order: 2;
  }

  .ProfileScrollContainer {
    overflow-y: auto;
    max-height: 75vh;
  }
}

  .custom-button-2 {
    font-family: 'JetBrains Mono';
    font-weight: bolder;
    position: relative;
    border:none; 
    border-radius:20px; 
    padding:25px;
    margin: 25px;
    min-height:30px; 
    min-width: 120px;
    background-color: var(--yellow-soft);
    color: var(--black-soft);
    cursor: pointer;
  }
  .custom-button-2:hover {
    transition: 0.3s;
  }

</style>
