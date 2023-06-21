<template>
  <div class="LoadFriendsContainer">
    <div class="LoadFriendsText">
      <div class="box" @click="$emit('close-menu')" @mouseenter="hover = true" @mouseleave="hover = false">
        <h1 :class="{ 'close': hover }">{{ hover ? 'Exit' : 'Friends' }}</h1>
      </div>

      <div class="friend-list">
        <div v-for="friend in friends" :key="friend.username" class="name-container">
          <div class="status-circle" :class="{ 'online': friend.status === 'online', 'offline': friend.status !== 'online' }"></div>
          <div class="name">{{ friend.username }}</div>
          <div class="profile-box">
            <router-link v-if="friend.username" :to="{ name: 'profile', params: { playerName: friend.username } }" class="profile-link">Profile</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axiosInstance from '../../../axiosConfig';

export default defineComponent({
  emits: ['close-menu'],
  data() {
    return {
      friends: [],
      hover: false
    };
  },
  mounted() {
    this.loadFriends();
  },
  methods: {
    async loadFriends() {
      try {
        const playerId = 4;
        const response = await axiosInstance.get(`friend/username/${playerId}`);
        console.log('Friends: ', response.data);
        this.friends = response.data;
      } catch (error) {
        console.error('Error occurred while loading friends: ', error);
      }
    }
  }
});
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

.profile-box {
  display: flex;
  align-items: center;
  margin-left: auto;
  padding: 5px;
  background-color: #abd0dd;
  border-radius: 5px;
  border: 1px solid #1f6091;
  transition: background-color 0.3s, border-color 0.3s;
}

.profile-box:hover {
  background-color: #1f6091;
  border-color: #abd0dd;
}

.profile-link {
  font-size: 15px;
  color: blue;
  text-decoration: none;
  margin-left: 5px;
}
</style>
