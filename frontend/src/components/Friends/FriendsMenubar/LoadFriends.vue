<template>
  <div class="LoadFriendsContainer">
    <div class="LoadFriendsText">
      <div class="box" @click="$emit('close-menu')" @mouseenter="hover = true" @mouseleave="hover = false">
        <h1 :class="{ 'close': hover }">{{ hover ? 'Exitoss' : 'Friends' }}</h1>
      </div>
      <input type="text" v-model="newFriendName" class="friend-input" placeholder="Enter friend's name" @keydown="handleKeyPress">
      <div class="buttonContainer">
        <button class="add-friend-button" @click="addFriend">Add Friend</button>
        <button class="block-player-button" @click="blockPlayer">Delete Friend</button>
      </div>
      <div class="friend-list">
        <div v-for="friend in friends" :key="friend.username" class="name-container aliceblue-bg">
          <div class="status-circle" :class="{ 'online': friend.status === 'online', 'offline': friend.status !== 'online' }"></div>
          <div class="name">{{ friend.username }}</div>
          <div class="profile-box">
            <router-link v-if="friend.username" :to="{
              name: 'friends', params: { playerName: friend.username, profilePicture: friend.profilePicture, status: friend.status } }" class="profile-link">Profile</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axiosInstance from '../../../axiosConfig';

const playerId = parseInt(localStorage.getItem('playerId') || '0');

interface Friend {
  username: string;
  status: string;
}

export default defineComponent({
  emits: ['close-menu'],
  data() {
    return {
      playerId: parseInt(sessionStorage.getItem('playerId') || '0'),
      friends: [] as Friend[], // Specify the type for the friends property
      hover: false,
      newFriendName: ''
    };
  },

  mounted() {
    this.loadFriends();
  },

  methods: {
    async loadFriends() {
      try {
        const response = await axiosInstance.get(`friend/username/${this.playerId}`);
        this.friends = response.data;
      } catch (error) {
        console.error('Error occurred while loading friends:', error);
      }
    },

    async addFriend() {
      try {
        const response = await axiosInstance.post(`friend/add/${this.playerId}`, {
          friendUsername: this.newFriendName
        });

        const existingFriend = this.friends.find(friend => friend.username === this.newFriendName);
        if (existingFriend) {
          this.newFriendName = '';
          return;
        }

        const newFriend = {
          username: this.newFriendName,
          status: 'online' // NEEDS TO BE CHANGED WITH ACTUAL STATUS
        };

        this.friends.push(newFriend);
        this.newFriendName = '';
      } catch (error) {
        console.error('Error occurred while adding friend:', error);
      }
    },

    async blockPlayer() {
      try {
        await axiosInstance.delete(`friend/${this.playerId}`, {
          data: {
            friendUsername: this.newFriendName
          }
        });
        this.friends = this.friends.filter(friend => friend.username !== this.newFriendName); // Update the friends array
        this.newFriendName = '';
      } catch (error) {
        console.error('Error occurred while blocking player:', error);
      }
    },

    handleKeyPress(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        this.addFriend();
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

.friend-input {
  margin-top: 20px;
  padding: 7px 25px;
  font-size: 18px;
}

.name-container {
  /* border: 1px solid #000; */
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.name-container:hover {
    background-color: #abd0dd;
  }

.name-container:hover .profile-box {
  background-color: #abd0dd;
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
  margin-left: 5px;
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
  transition: background-color 0.3s, border-color 0.3s;
  background-color: aliceblue;
  border: none;
  color: #1f6091;
}
.profile-box:hover {
  background-color: red;
  border-color: #abd0dd;
}

.profile-box:hover .profile-link {
  color: #204a6b;
}

.profile-link {
  font-size: 15px;
  color: #1f6091;
  transition: color 0.3s;
  text-decoration: none;
  margin-left: 5px;
}

.profile-link:hover {
    color: #abd0dd;
  }
.buttonContainer {
  display: flex;
  justify-content: space-between;
  margin-top: -50px;
}

.add-friend-button,
.block-player-button {
  width: 50%;
  padding: 5px;
  font-size: 18px;
  transition: background-color 0.3s;
  margin-top: 70px;
  background-color: aliceblue;
  color: #1f6091;
  border: none;
}

.add-friend-button:hover,
.block-player-button:hover {
  background-color: #abd0dd;;
  cursor: pointer;
}

.aliceblue-bg {
    background-color: aliceblue;
  }

</style>
