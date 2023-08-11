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
        <button class="add-del-block-button" @click="confirmDelete($event)">DELETE</button>
        <button class="add-del-block-button" @click="confirmBlock($event)">BLOCK</button>
      </div>
      <div class="friend-list">
        <router-link v-for="friend in friends" :key="friend.username" :to="{
          name: 'friends',
          params: { playerName: friend.username, profilePicture: friend.profilePicture, status: friend.status }
        }" class="name-container" style="text-decoration: none; color: inherit;">
          <div class="status-circle" :class="{ 'online': friend.status === 'online', 'offline': friend.status !== 'online' }"></div>
          <div class="name">{{ friend.username }}</div>
        </router-link>
      </div>
      
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";
import axiosInstance from '../../../utils/axiosConfig'

interface Friend {
  username: string;
  status: string;
}

enum Action {
    ADD,
    BLOCK,
    DELETE
}

export default defineComponent({
  emits: ['close-menu'],
  data() {
    return {
      playerId: parseInt(localStorage.getItem('playerId') || '0'),
      friends: [] as Friend[],
      hover: false,
      newFriendName: '',
      toast: useToast(),
      confirm: useConfirm()
    };
  },

  mounted() {
    this.loadFriends();
  },

  methods: {
    async confirmBlock() {
      if (await this.validateInput(this.newFriendName, Action.BLOCK)) {
        this.$confirm.require({
        header: 'Confirmation',
        message: 'Blocking this player will also remove the friendship. Are you sure you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.deleteFriend();
            this.blockFriend();
        }
        });
      }
    },

    async confirmDelete() {
      if (await this.validateInput(this.newFriendName, Action.DELETE)) {
        this.$confirm.require({
        header: 'Confirmation',
        message: 'Are you sure you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.deleteFriend();
        }
        });
      }
    },

    async loadFriends() {
      try {
        const response = await axiosInstance.get(`friend/username/${this.playerId}`);
        this.friends = response.data;
      } catch (error) {
        console.error('Error occurred while loading friends:', error);
      }
    },

    async validateInput(name: string, action: Action) {
        if (!name)
        {
            this.$toast.add({ severity: 'error', summary: 'Name required', detail: '', life: 3000 });
            return false
        }
        if (action == Action.ADD && this.friends.some((friend) => friend.username === name))
        {
            this.$toast.add({ severity: 'info', summary: 'You are already friends!', detail: '', life: 3000 });
            return false;
        }
        
        if ((action == Action.DELETE || action === Action.BLOCK) && !this.friends.some((friend) => friend.username === name))
        {
            this.$toast.add({ severity: 'error', summary: 'You are not friends with this player', detail: '', life: 3000 });
            return false;
        }
        
        const player = await axiosInstance.get('player/profile/' + name);
        if (!player.data)
        {
            this.$toast.add({ severity: 'error', summary: 'Player does not exist', detail: '', life: 3000 });
            return false;
        }
        if (player.data == this.playerId)
        {
            if (action == Action.ADD)
                this.$toast.add({ severity: 'error', summary: 'You cannot add yourself', detail: '', life: 3000 });
            else if (action == Action.DELETE)
                this.$toast.add({ severity: 'error', summary: 'You cannot delete yourself', detail: '', life: 3000 });
            else
                this.$toast.add({ severity: 'error', summary: 'You cannot block yourself', detail: '', life: 3000 });
            return false;
        }
        return true;
    },

    async addFriend() {
      try {
        if (await this.validateInput(this.newFriendName, Action.ADD))
        {
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
            this.friends = this.friends.filter(friend => friend.username !== this.newFriendName);
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

#text-error {
    font-size: 10px;
}
.LoadFriendsContainer {
    padding: 5px;
}
.LoadFriendsText {
  text-align: center;
  color: var(--blue-medium);
  font-size: 35px;
}

.box {
  padding: 5px 50px;
  display: inline-block;
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
  max-height: 820px;
  overflow-y: auto;
}

.friend-input {
  font-family: 'JetBrains Mono';
  border: none;
  border-radius: 8px;
  margin-top: 20px;
  padding: 7px 25px;
  font-size: 18px;
}

.name-container {
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
  background-color: var(--blue-lightest);
}

.name-container:hover {
    background-color: var(--white-softblue);
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

.buttonContainer {
  display: flex;
  justify-content: space-between;
  margin-top: -50px;
}

.add-del-block-button {
  width: 50%;
  padding: 10px;
  font-size: 18px;
  transition: background-color 0.3s;
  margin-top: 70px;
  margin-bottom: 18px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 8px;
  border: none;
  font-family: 'JetBrains Mono';
  font-weight: bold;
  background-color: var(--white-transparent);
  color: var(--blue-dark);
  cursor: pointer;
}

.add-del-block-button:hover {
  background-color: var(--blue-dark-transparent);
  color: var(--white-softblue);
  transition: 0.3s;
}

</style>
