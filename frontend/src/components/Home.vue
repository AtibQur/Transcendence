<template>
  <div class="PongContainer">
    <div class="PongLogo">
      <h1>PONG</h1>
    </div>
    <form @submit.prevent="initPlayerData">
            <input v-model="username" placeholder='Enter username'/>
            <button type="submit">Log in</button>
    </form>
    <p></p>
    <div v-if="intraName">
      <label> Intraname logged:   {{ intraName }}</label>
      <p></p>
      <label> Logged for testing: {{ logged_user }}</label>
    </div>
    <p></p>
    <div class="PongTable">
      <ul>
        <li><router-link to="/play">Play</router-link></li>
        <li><router-link to="/leaderboard">Leaderboard</router-link></li>
        <li><router-link to="/chat">Chat</router-link></li>
        <li><router-link to="/profile">Profile</router-link></li>
      </ul>
    </div>
    <button class="custom-button-1" @click="logOut">Log out</button>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineComponent, onMounted } from 'vue';
  import axiosInstance from '../axiosConfig';
  import { setDefaultAuthHeader } from '../axiosConfig';
  import { getCookie } from './cookie_utils';
  import { socket } from '@/socket';
  import { useRouter } from 'vue-router';
  import { useMousePosition } from './cursor'

  const username = ref('');
  const intraName = ref("");
  const router = useRouter();
  const logged_user = sessionStorage.getItem('username') || '';
//   import router from '@/router';

//   const intraName = ref("");
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
    socket.auth = { id: playerId };
    console.log('playerId: ', playerId);
    sessionStorage.setItem('playerId', playerId);
    sessionStorage.setItem('username', username.value);
    sessionStorage.setItem('logged', logged.value.toString());
    if (!playerExists.data) {
        setDefaultAvatar();
    }
    socket.connect();
  };

  const checkLoggedIn = async () =>  {
    const accesstoken = getCookie('auth');
    if (accesstoken === undefined) {
      router.push( { name: 'auth' } )
    } else {
      try {
        setDefaultAuthHeader(accesstoken);
      } catch (error) {
        console.log("Error retrieving auth cookie");
      }
    }
  };

  async function fetchUsername() {
        try {
            const response = await axiosInstance.get('/user/username');
            sessionStorage.setItem('intraUsername', response.data);
            intraName.value = (response.data);
            return intraName.value;
        } catch (error) {
            console.log("Error: Could not fetch username");
        }
    }

    async function fetchPlayerId() {
        try {
            const response = await axiosInstance.get('/user/id');
            // sessionStorage.setItem('playerId', response.data);
        } catch (error) {
            console.log("Error: Could not fetch player id");
        }
    }


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
    socket.disconnect();
    logged.value = false; 
    sessionStorage.removeItem('playerId');
    sessionStorage.removeItem('username');
    sessionStorage.setItem('logged', logged.value.toString());
  }

  defineComponent({
    name: 'HomeScreen'
  });

  onMounted(() => {
      const accesstoken = getCookie('auth');
      if (accesstoken === undefined) {
        checkLoggedIn();
      } else {
        setDefaultAuthHeader(accesstoken);
        fetchUsername();
        fetchPlayerId();
      }
  })
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=JetBrains+Mono');  

  .PongContainer {
    background-color: var(--blue-light);
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
    text-shadow: -3px 3px var(--gray-shadow);
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

  /* great for light blue bg */
  .custom-button-1 {
    font-family: 'JetBrains Mono';
    font-weight: bolder;
    position: absolute;
    border:none; 
    border-radius:10px; 
    padding:15px;
    min-height:30px; 
    min-width: 120px;
    background-color: var(--white-transparent);
    color: var(--black-soft);
    cursor: pointer;
  }
  .custom-button-1:hover {
    background-color: var(--blue-dark-transparent);
    color: var(--white-softblue);
    transition: 0.3s;
  }
</style>
