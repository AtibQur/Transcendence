<template>
        <Sidebar v-model:visible="visible" position="right" class="custom-sidebar">
            <ChannelmemberDisplay :channelId="currentChannelId" />
            <div v-if="isAdmin">
                <AddChannelmember :channelId="currentChannelId"/>
            </div>
            <button class="custom-button-1" @click="openConfirmDialog">Leave Chat</button>
            <div v-if="isOwner">
                <PasswordSettings :channelId="currentChannelId"/>
            </div>
        </Sidebar>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue';
import { socket } from '@/socket';
import axiosInstance from '../../axiosConfig';
import ChannelmemberDisplay from './ChannelmemberDisplay.vue';
import AddChannelmember from './AddChannelmember.vue';
import PasswordSettings from './PasswordSettings.vue'
import Sidebar from 'primevue/sidebar';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";

const toast = useToast();
const confirm = useConfirm();

const props = defineProps({
    channelId: {
        type: Number,
        required: true
    },
    isDm: {
        type: Boolean,
        required: true
    },
    isVisible: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['changeChannel', 'showInfo']);
const isAdmin = ref(false);
const isOwner = ref(false);
const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
const currentChannelId = ref<number>(props.channelId);
const visible = ref<boolean>(props.isVisible);

onBeforeMount(async () => {

   await fetchPlayerRights();

    //TRACK WHETHER CHANNEL_ID CHANGES
    watch(() => props.channelId, async (newChannelId: number) => {
        currentChannelId.value = newChannelId;
        await fetchPlayerRights();
    });

    //TRACK WHETHER VISIBILITY CHANGES
    watch(() => props.isVisible, async (newIsVisible: boolean) => {
        visible.value = newIsVisible;
        await fetchPlayerRights();
    });

    //TRACK WHETHER SIDE BAR HAS CLOSED BECAUSE OF OUTSIDE CLICK
    watch(visible, (newValue) => {
        visible.value = newValue;
        if (!visible.value)
            emit('showInfo', false);
    });
});

//FETCH PLAYER'S RIGHTS
const fetchPlayerRights = async () => {
    const response = await axiosInstance.get('channelmember/info/' + playerId.toString() + '/' + currentChannelId.value.toString());
    if (response.data)
    {
        isAdmin.value = response.data.is_admin;
        isOwner.value = response.data.is_owner;
    }
    else {
        console.log("Error could not fetch player info");
    }
}

//CONFIRM DIALOG BUTTON
const openConfirmDialog = () => {
    confirm.require({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        accept: () => {
            leaveChat();
        }
    });
};

//LEAVE CHAT
const leaveChat = async () => {

    await socket.emit('leaveRoom', {player_id: playerId, channel_id: currentChannelId.value}, (response) => {
        if (response)
        {
            toast.add({ severity: 'info', summary: 'Left Channel Succesfully', detail: '', life: 3000 });
            emit('changeChannel', 0, false);
        }
        else 
            toast.add({ severity: 'error', summary: 'Error you did not leave the Channel', detail: '', life: 3000 });
    })
}

</script>

<style>

.custom-sidebar {
  background-color: var(--blue-light);
  border-left: 1px solid var(--gray-medium);
}
</style>