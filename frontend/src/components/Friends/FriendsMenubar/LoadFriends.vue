<template>
  <div class="LoadFriendsContainer">
    <div class="LoadFriendsText">
      <div class="box" @click="$emit('close-menu')" @mouseenter="hover = true" @mouseleave="hover = false">
        <div class="hover-wrapper" :class="{ 'close': hover }">
          <h1>{{ hover ? 'Exit' : 'Friends' }}</h1>
        </div>
      </div>
      <input type="text" v-model="newFriendName" class="friend-input" placeholder="Enter friend's name" @keydown="handleKeyPress">
      <div class="buttonContainer">
        <button class="add-del-block-button" @click="addFriend">ADD</button>
        <button class="add-del-block-button" @click="deleteFriend">DELETE</button>
        <Toast />
        <ConfirmPopup></ConfirmPopup>
        <button class="add-del-block-button" @click="confirmBlock($event)">BLOCK</button>
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
import ConfirmPopup from 'primevue/confirmpopup';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";
import axiosInstance from '../../../axiosConfig';

interface Friend {
  username: string;
  status: string;
}

export default defineComponent({
  components: {
    ConfirmPopup,
    Toast,
  },
  emits: ['close-menu'],
  data() {
    return {
      playerId: parseInt(sessionStorage.getItem('playerId') || '0'),
      friends: [] as Friend[], // Specify the type for the friends property
      hover: false,
      newFriendName: '',
      toast: useToast(),
      confirm: useConfirm(),
    };
  },

  mounted() {
    this.loadFriends();
  },

  methods: {
    async confirmBlock(event) {
      this.$confirm.require({
        target: event.currentTarget,
        message: 'Blocking this player will also remove the friendship. Are you sure you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.deleteFriend();
            this.blockFriend();
        },
        reject: () => {
            this.$toast.add({ severity: 'error', summary: 'Rejected', detail: 'Nobody is blocked.', life: 3000 });
        }
      });
    },

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
        if (response.data) {
          const newFriend = {
            username: this.newFriendName,
            status: 'online' // NEEDS TO BE CHANGED WITH ACTUAL STATUS
          };
          this.friends.push(newFriend);
          this.newFriendName = '';
          this.$toast.add({ severity: 'success', summary: 'Successfully added friend', detail: '', life: 3000 });
        }
        else {
          this.$toast.add({ severity: 'error', summary: 'Error adding friend', detail: '', life: 3000 });
        }
      } catch (error) {
        console.error('Error occurred while adding friend:', error);
      }
    },

    async deleteFriend() {
      try {
        const response = await axiosInstance.delete(`friend/${this.playerId}`, {
          data: {
            friendUsername: this.newFriendName
          }
        });
        if (response.data) {
          this.$toast.add({ severity: 'success', summary: 'Successfully deleted friend', detail: '', life: 3000 });
          this.friends = this.friends.filter(friend => friend.username !== this.newFriendName); // Update the friends array
          this.newFriendName = '';
        }
        else {
          this.$toast.add({ severity: 'error', summary: 'Error deleting friend', detail: '', life: 3000 });
        }
      } catch (error) {
        console.error('Error occurred while deleting friend:', error);
      }
    },

    async blockFriend() {
      try {
        const response = await axiosInstance.post(`blockedplayer/add/${this.playerId}`, {
            blockedUsername: this.newFriendName
        });
        if (response.data) {
          this.$toast.add({ severity: 'success', summary: 'Successfully blocked player', detail: '', life: 3000 });
        }
        else {
          this.$toast.add({ severity: 'error', summary: 'Error blocking player', detail: '', life: 3000 });
        }
      }
      catch (error) {
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

.LoadFriendsContainer {
    padding: 5px;
}
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
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 10px;
  margin-left: 5px;
}

.online {
  background-color: var(--green-soft);
}

.offline {
  background-color: var(--red-soft);
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

.add-del-block-button {
  width: 50%;
  padding: 5px;
  font-size: 18px;
  transition: background-color 0.3s;
  margin-top: 70px;
  background-color: rgb(251, 253, 255);
  color: #3172a4;
  border: none;
  font-family: 'JetBrains Mono';
  font-weight: bold;
}

.add-del-block-button:hover {
  background-color: #abd0dd;;
  cursor: pointer;
}

.aliceblue-bg {
    background-color: aliceblue;
  }

</style>
