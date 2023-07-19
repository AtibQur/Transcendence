<template>
    <div class="card flex justify-content-center p-fluid">
        <button @click="isVisible = true">Add Channelmember</button>
        <Toast/>
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
import { socket } from '../../socket';
import axiosInstance from '../../axiosConfig';
import { ref, onMounted } from 'vue';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import AutoComplete from 'primevue/autocomplete';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";
import Checkbox from 'primevue/checkbox';

const props = defineProps({
    channelId: {
        type: Number,
        required: true
    }
});

const toast = useToast();
const confirm = useConfirm();
const isVisible = ref<boolean>(false);
const isAdmin = ref<boolean>(false);
const playerId = sessionStorage.getItem('playerId') || '0';
const newChannelmember = ref<string>('');
const errorMessage = ref<string>('');
const friends = ref<string[]>([]);
const filteredFriends = ref<string[]>([]);

onMounted(async () => {
    await fetchFriends();
})

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

//CONFIRM DIALOG BUTTON
const openConfirmDialog = () => {
    confirm.require({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        accept: () => {
            resetForm();
        },
        onShow: () => {
            isVisible.value = true;
        }
    });
};

//HANDLE CLOSE BUTTON
//when clicked confirm dialog is shown
const handleCloseButton = {
    'aria-label': 'Close Dialog',
    onClick: () => {
        openConfirmDialog()
    },
};

//VALIDATE FIELDS
function validateFields() {
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
    errorMessage.value = '';
    return true;
}

//RESET FORM
function resetForm() {
    newChannelmember.value = '';
    isAdmin.value = false;
    isVisible.value = false;
}

//SUMBIT FORM
const onSubmit = () => {
    if (validateFields())
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
