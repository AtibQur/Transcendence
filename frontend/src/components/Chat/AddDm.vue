<template>
    <button class="custom-button-1" @click="showDialog()">Create new Dm</button>
    <div class="card flex justify-content-center p-fluid">
        <Dialog v-model:visible="isVisible" modal header="New Dm" :style="{ width: '50vw' }">
            <form @submit.prevent="onSubmit">
                <div class="p-field">
                    <AutoComplete v-model="selectedFriend" :suggestions="filteredFriends" @complete="search" />
                </div>
                <small id="text-error" class="p-error">{{ errorMessage }}</small>
                <button class="custom-button-1" type="submit" style="background-color: var(--blue-lightest); margin-top: 20px;">Create</button>
            </form>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { socket } from '@/utils/socket';
import axiosInstance from '@/utils/axiosConfig';
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import AutoComplete from 'primevue/autocomplete';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const isVisible = ref<boolean>(false);
const playerId = parseInt(localStorage.getItem('playerId') || '0');
const selectedFriend = ref<string>('');
const errorMessage = ref<string>('');
const friends = ref<string[]>([]);
const filteredFriends = ref<string[]>([]);

//ACTIVATE ADD CHANNELMEMBER DIALOG
const showDialog = async () => {
    isVisible.value = true;
    await fetchFriends();
}

//FETCH FRIENDS OF PLAYER
const fetchFriends = async () => {
    const response = await axiosInstance.get('friend/username/' + playerId.toString());
    if (response.data)
        friends.value = response.data.map(item => item.username);
}

//AUTO COMPLETE SEARCH FOR CHANNELMEMBER NAME INPUT
const search = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            filteredFriends.value = [...friends.value];
        } else {
            filteredFriends.value = friends.value.filter((friend) => {
                return friend.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
}

const dmExists = async (friend_id: number) => {
    const dm = await axiosInstance.get('channel/dm/' + playerId.toString() + '/' + friend_id.toString());
    if (!dm.data)
        return false
    return true;
}

//VALIDATE FIELDS
const validateFields = async (friend_id: number) => {
    if (!selectedFriend.value) // if nothing is entered
    {
        errorMessage.value = 'Friend name required.';
        return false;
    }
    if (!friends.value.includes(selectedFriend.value)) // if the entered name is not a friend
    {
        errorMessage.value = 'Invalid name of friend';
        return false;
    }
    if (await dmExists(friend_id)) // if the dm already exists
    {
        errorMessage.value = 'Dm already exists!';
        return false;
    }
    errorMessage.value = '';
    return true;
}

// //RESET FORM
function resetForm() {
    selectedFriend.value = '';
    isVisible.value = false;
    errorMessage.value = '';
}

//SUMBIT FORM
const onSubmit = async () => {
    const friend_id = await axiosInstance.get('player/profile/' + selectedFriend.value);
    if (friend_id.data && await validateFields(friend_id.data))
    {
        socket.emit('addDm', { player_id: playerId, friend_id: friend_id.data }, () => {
            toast.add({ severity: 'info', summary: 'Create Dm successfully', detail: '', life: 3000 });
            resetForm();
        })

        if (!selectedFriend.value)
            toast.add({ severity: 'error', summary: 'Error Dm is not created', detail: '', life: 3000 });
    }
};

</script>

<style scoped>
  .custom-button-1 {
    font-family: 'JetBrains Mono';
    font-weight: bolder;
    border:none; 
    border-radius:10px;
    position: relative;
    min-height:30px; 
    min-width: 120px;
    margin: 5px;
    background-color: var(--white-transparent);
    color: var(--black-soft);
    cursor: pointer;
  }
  .custom-button-1:hover {
    background-color: var(--blue-dark-transparent);
    color: var(--white-softblue);
    transition: 0.3s;
  }
</style>