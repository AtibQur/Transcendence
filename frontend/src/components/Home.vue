<template>
  <div class="PongContainer">
    <div class="PongLogo">
      <h1>PONG</h1>
    </div>
    <div class="PongTable">
      <ul>
        <li><router-link to="/Play">Play</router-link></li>
        <li><router-link to="/Leaderboard">Leaderboard</router-link></li>
        <li><router-link to="/Chat">Chat</router-link></li>
        <li><router-link to="/Test">test</router-link></li>
        <li><router-link to="/Auth">Auth</router-link></li>
      </ul>
    </div>
  </div>
</template>

<style>
  .PongContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh; /* set the height of the container to the full height of the viewport */
  }
  
  .PongLogo {
    font-size: 50px;
    width: fit-content;
    margin: 0;
  }

  .PongTable {
    display: flex;
    justify-content: space-between;
    width: 600px;
    align-items: center;
    flex-direction: column;
  }

  .PongTable ul {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .PongTable li {
    margin-right: 20px;
  }
</style>


<script>
export default {
  name: 'HomeView'
}
</script>