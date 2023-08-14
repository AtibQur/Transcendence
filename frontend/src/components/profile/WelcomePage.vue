<template>
  <div class="PongLogo">
    PONG
  </div>
  <div class="welcome-container">
    <div class="welcome-box">
  <h3> Welcome to the coolest place to play PONG! </h3>
  <div class="welcome-text">
    This platform is more than just a place where you can <router-link class="custom-link" to="/play">play PONG</router-link>. 
    <router-link class="custom-link" to="/chat">Chat</router-link> your friends, have a look at the <router-link class="custom-link" to="/leaderboard">leaderboard</router-link> or check at your stats and achievements on your <router-link class="custom-link" to="/profile">profile</router-link>.
    <br><br>
    Get ready to bounce, chat, and conquer the virtual ping-pong arena with your pals! 🏓
    <br><br>
    Love,
    <br>
    Haseeb, Maria, Raav, Ster and Tessa
  </div>

  <div class="avatar-container">
    <div v-for="avatar in avatars" :key="avatar">
      <button title="Add Me!" @click="addFriend(avatar)" class="avatar-button">
        <img :src="`/trance_avatars/${avatar}`" alt="Avatar" class="avatar" />
      </button>
    </div>
  </div>
  <br>
  <div style="color: var(--blue-dark);">
    Click our avatars to become friends :)
  </div>
</div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axiosInstance from '@/utils/axiosConfig'
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';


const avatars = ref<string[]>(['haseeb.png', 'maria.png', 'raav.png', 'ster.png', 'tessa.png']);
const playerId = localStorage.getItem('playerId');
const toast = useToast();
const router = useRouter();


const addFriend = async (avatarPath: string) => {
  const username = avatarPath.replace('.png', '');
  console.log(`Added ${username} as a friend`);
  const response = await axiosInstance.post(`friend/add/${playerId}`, {
              friendUsername: username
            });
  if (response.data) {
    toast.add({ severity: 'success', summary: 'Successfully added friend', detail: '', life: 3000 });
  }
  else {
    router.push({ name: 'friends', params: { playerName: username }});
  }
};
</script>

<style scoped>
.PongLogo {
  font-size: 128px;
  font-weight: bold;
  padding: 4%;
}

.welcome-container {
  display: flex;
  justify-content: center;
}

.welcome-box {
  background-color: var(--white-softgray);
  border-radius: 20px;
  padding: 4%;
  max-width: 50%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.welcome-text {
  padding-top: 2%;
  padding-bottom: 5%;
  padding-left: 5%;
  padding-right: 5%;
  line-height: 2;
}

.custom-link {
  font-weight: bold;
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px;
  width: 100%
}

.avatar-button {
  border: none;
}

.avatar-button:hover {
  cursor: pointer;
}

.avatar {
  width: 100%;
  height: 18%;
  border-radius: 50%;
}

</style>
