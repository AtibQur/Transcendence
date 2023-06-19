<template>
    <div class="LoadFriendsContainer">
      <div class="LoadFriendsText">
        <div class="box" @click="$emit('close-menu')" @mouseenter="hover = true" @mouseleave="hover = false">
          <h1 :class="{ 'close': hover }">{{ hover ? 'Exit' : 'Friends' }}</h1>
        </div>
  
        <div class="friend-list">
          <div v-for="player in players" :key="player.name" class="name-container">
            <div class="status-circle" :class="{ 'online': player.online, 'offline': !player.online }"></div>
            <div class="name">{{ player.name }}</div>
            <router-link :to="{ name: 'profile', params: { playerName: player.name } }" class="profile-link">Profile</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script lang="ts">
  export default {
    emits: ['close-menu'],
    data() {
      return {
        players: [
          { name: 'Ster', online: true },
          { name: 'John', online: false },
          { name: 'Emma', online: true },
          { name: 'Michael', online: true },
          { name: 'Sophia', online: true },
          { name: 'Ster', online: true },
          { name: 'John', online: false },
          { name: 'Emma', online: true },
          { name: 'Michael', online: true },
          { name: 'Sophia', online: true },
          { name: 'Ster', online: true },
          { name: 'John', online: false },
          { name: 'Emma', online: true },
          { name: 'Michael', online: true },
          { name: 'Sophia', online: true },
          { name: 'Ster', online: true },
          { name: 'John', online: false },
          { name: 'Emma', online: true },
          { name: 'Michael', online: true },
          { name: 'Sophia', online: true },
          { name: 'Ster', online: true },
          { name: 'John', online: false },
          { name: 'Emma', online: true },
          { name: 'Michael', online: true },
          { name: 'Sophia', online: true },
          // ... add more players and their online status here
        ],
        hover: false
      };
    }
  };
  </script>
  
  <style scoped>
  .LoadFriendsText {
    text-align: center;
    color: #1f6091;
    font-size: 35px;
  }
  
  .box {
    background-color: #abd0dd;
    padding: 5px 50px;
    display: inline-block;
    border-bottom: 1px solid rgb(67, 63, 63);
    border-top: none;
    border-left: none;
    border-right: none;
  }
  
  .LoadFriendsText h1 {
    margin: 0;
    text-transform: uppercase;
    transition: color 0.3s, transform 0.3s;
  }
  
  .box:hover {
    cursor: pointer;
  }
  
  .friend-list {
    max-height: 800px; /* Set a fixed height for the scrollable area */
    overflow-y: auto; /* Enable vertical scrolling */
  }
  
  .name-container {
    border: 1px solid #000;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  
  .name {
    margin-left: 5px;
    font-size: 25px;
  }
  
  .close {
    transform: scale(1.1);
  }
  
  .status-circle {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .online {
    background-color: green;
  }
  .offline {
  background-color: red;
}

.profile-link {
  margin-left: 10px;
  font-size: 15px;
  color: blue;
  text-decoration: underline;
}
  </style>
  