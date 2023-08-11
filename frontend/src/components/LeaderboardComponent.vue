<template>
  <div class="Leaderboard">
    
    <div class="Leaderboard-header">
      <div class="Leaderboard-logo">
        <img src="../assets/images/pongEmoji.png" alt="Pong-logo">
      </div>
      <div class="Leaderboard-text">
        <h1>LEADERBOARD</h1>
      </div>
      <div class="Leaderboard-empty">
        <div class="Leaderboard-emptyspace"></div>
      </div>
    </div>

    <div class="Leaderboard-info">
      <div class="Leaderboard-rank">
        <h2>RANK</h2>
      </div>
      <div class="Leaderboard-name">
        <h2>USERNAME</h2>
      </div>
      <div class="Leaderboard-games">
        <h2>LEVEL</h2>
      </div>
    </div>

    <div class="Leaderboard-player-stats">
      <div class="Leaderboard-row" v-for="(player, index) in leaderboardData" :key="index">
        <div class="Leaderboard-rank">
          <h2>{{ index + 1 }}</h2>
        </div>
        <div class="Leaderboard-name">
          <h2>{{ player.player.username }}</h2>
        </div>
        <div class="Leaderboard-games">
          <h2>{{ player.ladder_level }}</h2>
        </div>
      </div>
    </div>

    <div class="Leaderboard-footer"></div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue';
  import axiosInstance from '../axiosConfig';

  const leaderboardData = ref("");
  const maxPlayersToShow = 15;

  onBeforeMount(async () => {
        await fetchLeaderboardData();
  });

  const fetchLeaderboardData = async () => {
    const response = await axiosInstance.get('player/leaderboard');
    if (response.data)
        leaderboardData.value = response.data.slice(0, maxPlayersToShow);
    else
      console.error('Failed to fetch leaderboard data:');
  }

</script>

 <style scoped>
   .Leaderboard {
   position: relative;
   margin: 100px;
   height: 75vh;
   min-height: 180px;
   min-width: 700px;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   background-color: var(--white-softblue);
   border-radius: 8px;
   }
 
   .Leaderboard-header {
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 10%;
     min-height: 100px;
     background-color: #1D233A;
     border-radius: 8px;
   }
   .Leaderboard-header .Leaderboard-logo {
     position: absolute;
     top: 0;
     left: 0;
     width: 100px;
     height: 100px;
   }
   .Leaderboard-header .Leaderboard-logo img {
     position: absolute;
     top: 50%;
     left: 50%;
     width: 50%;
     height: 50%;
     transform: translate(-50%, -50%);
   }
   .Leaderboard-header .Leaderboard-text {
     position: absolute;
     top: 0;
     left: 20%;
     width: 60%;
     height: 100%;
     display: flex;
     align-items: center;
     justify-content: center;
   }
   .Leaderboard-header .Leaderboard-text h1 {
     font-style: normal;
     line-height: 127px;
     color: var(--white-softblue);
   }
   .Leaderboard-header .Leaderboard-empty {
     position: absolute;
     top: 0;
     left: 80%;
     width: 20%;
     height: 100%;
   }
   .Leaderboard-header .Leaderboard-emptyspace {
     position: absolute;
     top: 50%;
     left: 50%;
     width: 50%;
     height: 50%;
     transform: translate(-50%, -50%);
   }
 
   .Leaderboard-info {
     position: absolute;
     top: 100px;
     left: 0;
     width: 100%;
     height: 8%;
   }

   .Leaderboard-info h2 {
    font-size: 18px;
    font-family: 'JetBrains Mono';
    font-style: normal;
    line-height: 127px;
    color: var(--gray-medium);
    font-weight: 400;
    margin-top: 40px;
   }
   .Leaderboard-info .Leaderboard-rank {
     position: absolute;
     top: 0;
     left: 0;
     width: 20%;
     height: 100%;
     display: flex;
     align-items: center;
     justify-content: center;
   }

   .Leaderboard-info .Leaderboard-name {
     position: absolute;
     left: 18%;
     display: flex;
     align-items: center;
     width: 60%;
     height: 100%;
     justify-content: left;
   }

 .Leaderboard-info .Leaderboard-games {
     position: absolute;
     top: 0;
     left: 75%;
     width: 20%;
     height: 100%;
     display: flex;
     align-items: center;
     justify-content: center;
  }
   
   .Leaderboard-footer {
     position: absolute;
     top: 95%;
     left: 0;
     width: 100%;
     height: 5%;
     background-color: #1D233A;
     border-radius: 8px;
   }

   .Leaderboard-player-stats {
   position: absolute;
   top: 160px;
   width: 100%;
   height: 72%;
   overflow-y: auto;
   scrollbar-width: thin;
   scrollbar-color: transparent transparent;
 }
 
 .Leaderboard-player-stats::-webkit-scrollbar {
   width: 0;
   height: 0;
 }
 
   .Leaderboard-row {
     display: flex;
     align-items: center;
     justify-content: center;
     height: 80px;
     margin: 15px;
   }
 
   .Leaderboard-row .Leaderboard-rank {
     display: flex;
     align-items: center;
     justify-content: center;
     width: 10%;
     height: 75%;
     background-color: var(--yellow-soft);
     border-radius: 50px;
     margin-right: 30px;
   }
 
   .Leaderboard-row .Leaderboard-name {
     display: flex;
     align-items: center;
     width: 60%;
     height: 100%;
     justify-content: left;
     background-color: var(--blue-lightest);
     border-radius: 18px;
     margin-right: 30px;
   }
 
   .Leaderboard-row .Leaderboard-name h2 {
     font-family: 'JetBrains Mono';
     font-style: normal;
     line-height: 145px;
     color: #595959;
     font-weight: 400;
     font-size: 14px;
     padding-left: 6%;
     padding-top: 3%;
   }
   .Leaderboard-row .Leaderboard-games {
     display: flex;
     align-items: center;
     justify-content: center;
     width: 20%;
     height: 100%;
     border-right: none;
     background-color: var(--yellow-soft);
     border-radius: 50px;
   }
 
   .Leaderboard-row .Leaderboard-rank h2,
   .Leaderboard-row .Leaderboard-name h2,
   .Leaderboard-row .Leaderboard-games h2 {
     font-family: 'JetBrains Mono';
     font-style: normal;
     line-height: 127px;
     color: var(--black-soft);
     font-weight: bold;
     font-size: 24px;
     border-right: none;
     padding: 30px;
   }

   </style>