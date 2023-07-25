<template>
    <!-- <div v-on-click-outside="closeChannelInfo"> -->
        <Sidebar ref="sidebarRef" v-model:visible="visible" position="right">
            <ChannelmemberDisplay :channelId="currentChannelId" />
            <div v-if="isAdmin">
                <AddChannelmember :channelId="currentChannelId"/>
            </div>
            <button @click="openConfirmDialog">Leave Chat</button>
            <div v-if="isOwner">
                <PasswordSettings :channelId="currentChannelId"/>
            </div>
        </Sidebar>
    <!-- </div> -->
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
const sidebarRef = ref(null);

const props = defineProps({
    channelId: {
        type: Number,
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

    watch(visible, (newValue) => {
        visible.value = newValue;
        if (!visible.value) // if side bar is closed
            emit('showInfo', false);
    });
});

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