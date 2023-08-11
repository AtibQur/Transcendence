<template>
        <Sidebar v-model:visible="visible" position="right" class="custom-sidebar">
            <ChannelmemberDisplay @changeChannel="changeChannel" :channelId="currentChannelId" />
            <div v-if="!isDm">
                <div v-if="isAdmin">
                    <AddChannelmember :channelId="currentChannelId"/>
                </div>
                <button class="custom-button-1" @click="openConfirmLeaveDialog">Leave Chat</button>
                <div v-if="isOwner">
                    <PasswordSettings :channelId="currentChannelId"/>
                    <button class="custom-button-1" @click="openConfirmRemoveDialog">Remove Chat</button>
                </div>
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
const isAdmin = ref<boolean>(false);
const isOwner = ref<boolean>(false);
const playerId = parseInt(localStorage.getItem('playerId') || '0');
const currentChannelId = ref<number>(props.channelId);
const visible = ref<boolean>(props.isVisible);
const isDm = ref<boolean>(false);

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

    await fetchChannelType();
}

const fetchChannelType = async () => {
    const response = await axiosInstance.get('channel/dm/' + currentChannelId.value.toString());
    if (response.data != null)
        isDm.value = response.data;
    else
        console.log("Error could not fetch channel type");

}

//CONFIRM DIALOG FOR LEAVE BUTTON
const openConfirmLeaveDialog = () => {
    confirm.require({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        accept: () => {
            leaveChannel();
        }
    });
};

//CONFIRM DIALOG FOR REMOVE BUTTON
const openConfirmRemoveDialog = () => {
    confirm.require({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        accept: () => {
            removeChannel();
        }
    });
};

//LEAVE CHAT
const leaveChannel = async () => {

    await socket.emit('leaveRoom', {player_id: playerId,
                                    member_id: playerId,
                                    channel_id: currentChannelId.value},
                                    (response) =>
    {
        if (response)
        {
            toast.add({ severity: 'info',
                        summary: 'Left Channel Succesfully',
                        detail: '',
                        life: 3000 });
            emit('changeChannel', 0, false, false);
        }
        else 
            toast.add({ severity: 'error', summary: 'Error you did not leave the Channel', detail: '', life: 3000 });
    })
}

//REMOVE CHANNEL
// can only be done by the owner
const removeChannel = async () => {

    await socket.emit('deleteRoom', { player_id: playerId,
                                      channel_id: currentChannelId.value},
                                      (response) => 
    {
        if (response)
        {
            toast.add({ severity: 'info',
                        summary: 'Removed Channel Succesfully',
                        detail: '',
                        life: 3000 });
            emit('changeChannel', 0, false, false);
        }
        else 
            toast.add({ severity: 'error', summary: 'Error removing Channel', detail: '', life: 3000 });
    })
}

// COMMUNNICATE CHANNEL CHANGE TO CHATVIEW COMPONENT
const changeChannel = async (channel_id: number, isChannel: boolean, isDm: boolean) => {
    emit('changeChannel', channel_id, isChannel, isDm);
}

</script>

<style>

.custom-sidebar {
  font-family: 'JetBrains Mono';
  background-color: var(--blue-light);
  border-left: 1px solid var(--gray-medium);
}
</style>