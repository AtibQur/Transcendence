<template>
  <div class="LoadFriendsContainer">
    <div class="LoadFriendsText">
      <div class="box" @click="$emit('close-menu')" @mouseenter="hover = true" @mouseleave="hover = false">
        <h1 :class="{ 'close': hover }">{{ hover ? 'Exit' : 'Friends' }}</h1>
      </div>
      <input type="text" v-model="newFriendName" class="friend-input" placeholder="Enter friend's name">
      <div class="buttonContainer">
        <button class="add-friend-button" @click="addFriend">Add Friend</button>
        <button class="block-player-button" @click="blockPlayer">Block Player</button>
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

interface Friend {
  username: string;
  status: string;
}

export default defineComponent({
  emits: ['close-menu'],
  data() {
    return {
      friends: [] as Friend[], // Specify the type for the friends property
      hover: false,
      newFriendName: '' // Store the new friend's name entered by the user
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
        console.log('Friends:', response.data);
        this.friends = response.data;
      } catch (error) {
        console.error('Error occurred while loading friends:', error);
      }
    },

    async addFriend() {
      try {
        const playerId = 4;
        const response = await axiosInstance.post(`friend/add/${playerId}`, {
          friendUsername: this.newFriendName
        });

        if (typeof response.data === 'string') {
          console.log('Add friend response:', response.data);
        } else {
          console.log('Friend added:', response.data);
          this.friends = response.data.friends; // Update the friends array

          this.newFriendName = ''; // Clear the input field after adding a friend
        }
      } catch (error) {
        console.error('Error occurred while adding friend:', error);
      }
    },

    async blockPlayer() {
      try {
        const playerId = 4;
        await axiosInstance.delete(`friend/${playerId}`, {
          data: {
            friendUsername: this.newFriendName
          }
        });

        console.log('Player blocked:', this.newFriendName);
        this.friends = this.friends.filter(friend => friend.username !== this.newFriendName); // Update the friends array

        this.newFriendName = ''; // Clear the input field after blocking a player
      } catch (error) {
        console.error('Error occurred while blocking player:', error);
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
  margin-bottom: 0;
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
.buttonContainer {
  display: flex;
  justify-content: space-between;  
}

.add-friend-button,
.block-player-button {
  width: 50%;
  padding: 5px;
  font-size: 18px;
  transition: background-color 0.3s;
  margin-top: 70px;
}

.add-friend-button:hover,
.block-player-button:hover {
  background-color: #1f6091;
  color: white;
  cursor: pointer;
}
</style>
