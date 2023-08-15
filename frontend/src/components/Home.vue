<template>
  <div class="PongContainer">
    <div class="PongLogo">
      <h1>PONG</h1>
    </div>
    <div class="PongTable">
      <ul>
        <li><router-link to="/play">Play</router-link></li>
        <li><router-link to="/leaderboard">Leaderboard</router-link></li>
        <li><router-link to="/chat">Chat</router-link></li>
        <li><router-link to="/profile">Profile</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineComponent } from 'vue';

  defineComponent({
    name: 'HomeScreen'
  });

</script>

<style>
  .PongContainer {
    background-color: var(--blue-light);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
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

  .custom-button-1 {
    font-family: 'JetBrains Mono';
    font-weight: bolder;
    position: relative;
    margin: 5px;
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
