<template>
  <div class="PongContainer">
    <div class="PongLogo">
      <h1>PONG</h1>
    </div>
    <label> Welcome {{ intraName }}!</label>
      <input v-model="username" placeholder='username'/>
      <!-- <button @click="initPlayerData">Log in</button> -->
    <div class="PongTable">
      <ul>
        <li><router-link to="/play">Play</router-link></li>
        <li><router-link to="/leaderboard">Leaderboard</router-link></li>
        <li><router-link to="/chat">Chat</router-link></li>
        <li><router-link to="/populatedatabase">Populate Database</router-link></li>
      </ul>
    </div>
    <button @click="logOut">Log out</button>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineComponent, onMounted } from 'vue';
  import axiosInstance, { setDefaultCorsHeader } from '../axiosConfig';
  import { setDefaultAuthHeader } from '../axiosConfig';
  import { getCookie } from './cookie_utils';
  import { socket } from '@/socket';
  import router from '@/router';

  const username = ref('');
  const intraName = ref("");
  const logged = ref(false);

  const checkLoggedIn = async () =>  {
    const accesstoken = getCookie('auth');
    if (accesstoken === undefined) {
      window.location.replace('http://localhost:8080/auth')
    } else {
      try {
        setDefaultAuthHeader(accesstoken);
      } catch (error) {
        console.log("Error retrieving auth cookie");
      }
    }
  }; 

  const greetPlayer = async () => {
    try {
            const response = await axiosInstance.get('/user/username');
            intraName.value = (response.data);
            return intraName.value;
        } catch (error) {
            console.log("Error: Could not fetch username");
        }
  };

  const setDefaultAvatar = async () => {
    const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
    const defaultAvatarPath = './default_avatar.png';

    // Fetch the default avatar file
    const defaultAvatarFile = await fetch(defaultAvatarPath);
    const defaultAvatarBlob = await defaultAvatarFile.blob();
    const defaultAvatar = new File([defaultAvatarBlob], 'default_avatar.png');

    // Send the default avatar file to the server
    const formData = new FormData();
    formData.append('avatar', defaultAvatar);

    await axiosInstance.post('player/avatar/upload/' + playerId.toString(), formData);
  };

  const logOut = async () => {
    sessionStorage.removeItem('playerId');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('logged');
  }

  defineComponent({
    name: 'HomeScreen'
  });

  onMounted(() => {
    checkLoggedIn();
    greetPlayer();
  })
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=JetBrains+Mono');
  
  .PongContainer {
    background-color: #B2DAE7;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh; /* set the height of the container to the full height of the viewport */
  }
  
  .PongLogo {
    font-family: 'JetBrains Mono';
    font-style: normal;
    font-weight: 400;
    font-size: 96px;
    line-height: 127px;
    color: #134279;
    text-shadow: -3px 3px #a29e9e;
  }

  .PongTable {
    display: flex;
    justify-content: space-between;
    width: 500px;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    font-weight: 400px;
  }
  
  .PongTable ul {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .PongTable li {
    margin: 0px 50px 0px 50px;
    font-size: 16px;
    text-decoration: none;
  }
  .PongTable li a {
    color: #134279;
    text-decoration: none;
  }
</style>
