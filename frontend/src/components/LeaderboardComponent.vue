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
        <h2>Rank</h2>
      </div>
      <div class="Leaderboard-name">
        <h2>Name</h2>
      </div>
      <div class="Leaderboard-games">
        <h2>Games won</h2>
      </div>
    </div>

    <div class="Leaderboard-player-stats">
      <div class="Leaderboard-row" v-for="(player, index) in limitedLeaderboardData" :key="index">
        <div class="Leaderboard-rank">
          <h2>{{ index + 1 }}</h2>
        </div>
        <div class="Leaderboard-name">
          <h2>{{ player.player.username }}</h2>
        </div>
        <div class="Leaderboard-games">
          <h2>{{ player.wins }}</h2>
        </div>
        <div style="display: none;">{{ playerRankIndex = index + 1 }}</div>
      </div>
    </div>

    <div class="Leaderboard-footer"></div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import axiosInstance from '../axiosConfig';

  const leaderboardData = ref("");
  const playerId = parseInt(localStorage.getItem('playerId') || '0');
  const playerName = ref("");
  const playerWins = ref("");
  const playerRank = ref("");
  const maxPlayersToShow = 15;

  onMounted(async () => {
    try {
      leaderboardData.value = await fetchLeaderboardData();
    } catch (error) {
      console.error('Failed to fetch leaderboard data:', error);
    }
  });

  const fetchPlayerWins = async (player_id: number) => {
    const response = await axiosInstance.get('player/stats/' + player_id.toString());
    console.log(response.data);
    return response.data;
  }

  const fetchPlayerName = async (player_id: number) => {
    const response = await axiosInstance.get('player/username/' + player_id.toString());
    console.log(response.data);
    return response.data;
  }

  const fetchLeaderboardData = async () => {
    const response = await axiosInstance.get('player/leaderboard');
    return response.data
  }

  const limitedLeaderboardData = computed(() => {
    if (!leaderboardData.value) {
      return [];
    }
    return leaderboardData.value.slice(0, maxPlayersToShow);
  });

  const playerRankIndex = computed(() => {
    if (!leaderboardData.value || leaderboardData.value.length === 0) {
      console.log("No leaderboard data");
      return -1;
    }

    const playerIndex = leaderboardData.value.findIndex(
      (player) => player.player.id === playerId
    );

    return playerIndex >= 0 ? playerIndex + 1 : -1; // Return the rank/index if found, otherwise -1
  });

  onMounted(async () => {
    try {
      playerWins.value = await fetchPlayerWins(playerId);
      playerName.value = await fetchPlayerName(playerId);
      playerRank.value = playerRankIndex.value;
    } catch (error) {
      console.error('Failed to fetch player data:', error);
    }
  });

</script>

 <style>
   .Leaderboard {
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
 
   .Leaderboard-header {
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 10%;
     background-color: #1D233A;
     border-bottom: 2px solid black;
   }
   .Leaderboard-header .Leaderboard-logo {
     position: absolute;
     top: 0;
     left: 0;
     width: 100px;
     height: 100px;
     border-right: 2px solid black;
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
     font-family: 'JetBrains Mono';
     font-style: normal;
     line-height: 127px;
     color: #FAFAFA;
   }
   .Leaderboard-header .Leaderboard-empty {
     position: absolute;
     top: 0;
     left: 80%;
     width: 20%;
     height: 100%;
     border-left: 2px solid black;
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
     top: 10%;
     left: 0;
     width: 100%;
     height: 8%;
     border-bottom: 2px solid black;
   }
   .Leaderboard-info .Leaderboard-rank {
     position: absolute;
     top: 0;
     left: 0;
     width: 20%;
     height: 100%;
     border-right: 2px solid black;
     display: flex;
     align-items: center;
     justify-content: center;
   }
   .Leaderboard-info .Leaderboard-rank h2 {
     font-family: 'JetBrains Mono';
     font-style: normal;
     line-height: 127px;
     color: #595959;
     font-weight: 400;
     font-size: 14px;
     padding-top: 6%;
   }
   .Leaderboard-info .Leaderboard-name {
     position: absolute;
     top: 0;
     left: 20%;
     width: 60%;
     height: 100%;
     display: flex;
     align-items: center;
     justify-content: left;
   }
   .Leaderboard-info .Leaderboard-name h2 {
     font-family: 'JetBrains Mono';
     font-style: normal;
     line-height: 127px;
     color: #595959;
     font-weight: 400;
     font-size: 14px;
     padding-left: 6%;
     padding-top: 3%;
   }
 .Leaderboard-info .Leaderboard-games {
     position: absolute;
     top: 0;
     left: 80%;
     width: 20%;
     height: 100%;
     border-left: 2px solid black;
     display: flex;
     align-items: center;
     justify-content: center;
   }
   .Leaderboard-info .Leaderboard-games h2 {
     font-family: 'JetBrains Mono';
     font-style: normal;
     color: #595959;
     font-weight: 400;
     font-size: 14px;
     padding-top: 6%;
   }
   
   .Leaderboard-footer {
     position: absolute;
     top: 90%;
     left: 0;
     width: 100%;
     height: 10%;
     background-color: #1D233A;
     border-top: 2px solid black;
   }

   .Leaderboard-player-stats {
   /* Add styles to match Leaderboard-header */
   position: absolute;
   top: 18%; /* Adjust as needed */
   left: 0;
   width: 100%;
   height: 72%; /* Adjust as needed */
   overflow-y: auto; /* Add scrollbars if needed */
 
   /* Hide the scrollbar */
   scrollbar-width: thin;
   scrollbar-color: transparent transparent; /* Adjust color if needed */
 }
 
 /* Hide the scrollbar track and thumb */
 .Leaderboard-player-stats::-webkit-scrollbar {
   width: 0;
   height: 0;
 }
 
   .Leaderboard-row {
     /* Styles to match Leaderboard-header */
     display: flex;
     align-items: center;
     justify-content: center;
     border-bottom: 2px solid black;
     height: 65px; /* Adjust as needed */
   }
 
   .Leaderboard-row .Leaderboard-rank {
     /* Styles to match Leaderboard-info */
     display: flex;
     align-items: center;
     justify-content: center;
     width: 20%;
     height: 100%;
     border-right: 2px solid black;
   }
 
   .Leaderboard-row .Leaderboard-name {
     /* Styles to match Leaderboard-info */
     display: flex;
     align-items: center;
     justify-content: center;
     width: 60%;
     height: 100%;
     border-right: 2px solid black;
     justify-content: left;
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
     border-right: none; /* Remove border on the last column */
   }
   .Leaderboard-row .Leaderboard-games {
     /* Styles to match Leaderboard-info */
     display: flex;
     align-items: center;
     justify-content: center;
     width: 20%;
     height: 100%;
     border-right: 2px solid black;
     border-right: none; /* Remove border on the last column */
   }
 
   .Leaderboard-row .Leaderboard-rank h2,
   .Leaderboard-row .Leaderboard-name h2,
   .Leaderboard-row .Leaderboard-games h2 {
     /* Styles to match Leaderboard-info */
     font-family: 'JetBrains Mono';
     font-style: normal;
     line-height: 127px;
     color: #595959;
     font-weight: 400;
     font-size: 14px;
     border-right: none; /* Remove border on the last column */
   }
 
   </style>