<template>
  <div class="border-container">
    <div class="border">
      <div class="border-text">
        <div class="border-row">
          <div class="border-label">Total Games:</div>
          <div class="border-value">{{ totalGames }}</div>
        </div>
        <div class="border-row">
          <div class="border-label">Wins:</div>
          <div class="border-value">{{ wins }}</div>
        </div>
        <div class="border-row">
          <div class="border-label">Loses:</div>
          <div class="border-value">{{ loses }}</div>
        </div>
        <div class="border-row">
          <div class="border-label">Win/Lose Ratio:</div>
          <div class="border-value">{{ winLoseRatio }}</div>
        </div>
        <div class="border-row">
          <div class="border-label">Current Win Streak:</div>
          <div class="border-value">{{ currentWinStreak }}</div>
        </div>
        <div class="border-row">
          <div class="border-label">Highest Win Streak:</div>
          <div class="border-value">{{ highestWinStreak }}</div>
        </div>
        <div class="border-row">
          <div class="border-label">Current Ladder Level:</div>
          <div class="border-value">{{ currentLadderLevel }}</div>
        </div>
        <div class="border-row">
          <div class="border-label">All-time High:</div>
          <div class="border-value">{{ allTimeHigh }}</div>
        </div>
        <div class="border-row">
          <div class="border-label">Total Achievements:</div>
          <div class="border-value">{{ totalAchievements }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalGames: 0,
      wins: 0,
      loses: 0,
      winLoseRatio: 0,
      currentWinStreak: 0,
      highestWinStreak: 0,
      currentLadderLevel: '',
      allTimeHigh: '',
      totalAchievements: 0
    };
  }
};
</script>

<style>
.border-container {
  height: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.border {
  border: 1px solid black;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.border-text {
  font-family: Arial, sans-serif;
  font-size: 18px;
}

.border-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.border-label {
  font-weight: bold;
}

.border-value {
  margin-left: 10px;
}
</style>