<template>
  <div class="PongContainer">
    <div class="PongLogo">
      <h1>PONG</h1>
    </div>
    <label> Dit wordt later vervangen door login proces, maar voor nu: vul hier een username in </label>
      <input v-model="username" placeholder='username'/>
      <button @click="initPlayerData">Log in</button>
    <div class="PongTable">
      <ul>
        <li><router-link to="/Auth">Auth</router-link></li>
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
  import { ref, defineComponent } from 'vue';
  import axiosInstance from '../axiosConfig';
  import { socket } from '@/socket';

  const username = ref('');
  const logged = ref(false);

  const initPlayerData = async () => {
    if (username.value.trim() === '') {
      alert('Username cannot be empty');
      return;
    }
    const playerExists = await axiosInstance.get('/player/exists/' + username.value);
    const playerIdResponse = await axiosInstance.post('/player/create', { username: username.value });
    const playerId = playerIdResponse.data
    logged.value = true;

    localStorage.setItem('playerId', playerId);
    localStorage.setItem('username', username.value);
    localStorage.setItem('logged', logged.value);
    if (!playerExists.data) {
      setDefaultAvatar();
    }
    await socket.emit('joinAllRooms', playerId)
  };

  const setDefaultAvatar = async () => {
    const playerId = parseInt(localStorage.getItem('playerId') || '0');
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
    localStorage.removeItem('playerId');
    localStorage.removeItem('username');
    localStorage.removeItem('logged');
  }

  defineComponent({
    name: 'HomeScreen'
  });
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
