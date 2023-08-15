<template>
    <button class="custom-button-1" @click="showDialog()">Add Channelmember</button>
    <div class="card flex justify-content-center p-fluid">
        <Dialog v-model:visible="isVisible" modal header="New Channelmember" :style="{ width: '50vw' }" :closeButtonProps="handleCloseButton">
            <form @submit.prevent="onSubmit">
                <div class="p-field">
                    <AutoComplete v-model="newChannelmember" :suggestions="filteredFriends" @complete="search" />
                </div>
                <div class="p-field">
                    <Checkbox v-model="isAdmin" inputId="admin" :binary="true" />
                    <label for="admin" > Admin </label>
                </div>
                <small id="text-error" class="p-error">{{ errorMessage }}</small>
                <button type="submit">Add</button>
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
import Checkbox from 'primevue/checkbox';

const props = defineProps({
    channelId: {
        type: Number,
        required: true
    }
});

const toast = useToast();
const isVisible = ref<boolean>(false);
const isAdmin = ref<boolean>(false);
const playerId = localStorage.getItem('playerId') || '0';
const newChannelmember = ref<string>('');
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
    const response = await axiosInstance.get('friend/username/' + playerId);
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

//HANDLE CLOSE BUTTON
//when clicked confirm dialog is shown
const handleCloseButton = {
    'aria-label': 'Close Dialog',
    onClick: () => {
        resetForm();
    },
};

const channelmemberExists = async () => {
    const channelmemberId = await axiosInstance.get('player/profile/' + newChannelmember.value);
    if (channelmemberId.data)
    {
        const isInChannel = await axiosInstance.get('channelmember/channel/'
                                                    + props.channelId.toString()
                                                    + '/' + channelmemberId.data.toString());
        if (isInChannel.data)
            return true
    }
    return false;
}

const channelmemberIsBanned = async () => {
    const channelmemberId = await axiosInstance.get('player/profile/' + newChannelmember.value);
    if (channelmemberId.data)
    {
        const response = await axiosInstance.get('channelmember/info/'
                                                    + channelmemberId.data.toString()
                                                    + '/' + props.channelId.toString());
        if (response.data && response.data.is_banned)
            return true
    }
    return false;
}

//VALIDATE FIELDS
const validateFields = async () => {
    if (!newChannelmember.value)
    {
        errorMessage.value = 'Channelmember name required.';
        return false;
    }
    if (!friends.value.includes(newChannelmember.value))
    {
        errorMessage.value = 'Invalid name of friend';
        return false;
    }
    if (await channelmemberIsBanned())
    {
        errorMessage.value = 'Channelmember is banned from this channel!';
        return false;
    }
    if (await channelmemberExists())
    {
        errorMessage.value = 'Channelmember already exists!';
        return false;
    }
    errorMessage.value = '';
    return true;
}

function resetForm() {
    newChannelmember.value = '';
    isAdmin.value = false;
    isVisible.value = false;
    errorMessage.value = '';
}

const onSubmit = async() => {
    if (await validateFields())
    {
        socket.emit('addChannelmember', { channelmember_name: newChannelmember.value, channel_id: props.channelId, is_admin: isAdmin.value }, () => {
            toast.add({ severity: 'info', summary: 'Added Channelmember successfully', detail: '', life: 3000 });
            resetForm();
        })

        if (!newChannelmember.value)
            toast.add({ severity: 'error', summary: 'Error Channelmember not Added', detail: '', life: 3000 });
    }
};

</script>
