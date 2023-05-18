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
        <li><router-link to="/populatedatabase">Populate Database</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HomeScreen'
  }
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
