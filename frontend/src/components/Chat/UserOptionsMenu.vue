<template>
    <Toast/>
    <div>
        <h3> {{ currentChannelmemberUsername }}</h3>
        <h4> {{ ( currentChannelmemberStatus ) }}</h4>
        <!-- for testing purposes -->
        <div v-if="!currentChannelmemberInfo.memberIsOwner && !currentChannelmemberInfo.showMute">
            <h5>[MUTED]</h5>
        </div>
        <div v-if="!currentChannelmemberInfo.memberIsOwner && !currentChannelmemberInfo.showBan">
            <h5>[BANNED]</h5>
        </div>
    </div>
    <div v-if="currentChannelmemberUsername != playerUsername">
        <div>
            <button>View Profile</button>
        </div>
        <div v-if="currentChannelmemberInfo.memberIsFriend">
            <button>Send Message</button>
            <button>Invite To Play Pong</button>
        </div>
        <div v-else>
            <button @click="addFriend()">Add Friend</button>
        </div>
        <div v-if="currentChannelmemberInfo.showMute">
            <button @click="muteChannelmember()">Mute</button>
        </div>
        <div v-if="currentChannelmemberInfo.showMakeAdmin">
            <button @click="makeAdmin()">Make Admin</button>
        </div>
        <div v-if="currentChannelmemberInfo.showBan">
            <button @click="banChannelmember()">Ban</button>
        </div>
        <div v-if="currentChannelmemberInfo.showDelete">
            <button @click="openConfirmDialog(Actions.REMOVE);">Remove from Channel</button>
        </div>
    </div>
    <div v-else>
        <button>Edit Profile</button>
    </div>
</template>

<script setup lang="ts">
import axiosInstance from '../../axiosConfig';
import { onBeforeMount, ref, watch } from 'vue'
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";

enum Actions {
    MUTE,
    BAN,
    REMOVE
}

const props = defineProps({
    channelId: {
        type: Number,
        required: true
    },
    channelmember: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['removeChannelmember']);

const toast = useToast();
const confirm = useConfirm();
const playerUsername = sessionStorage.getItem('username') || '0';
const playerId = sessionStorage.getItem('playerId') || '0';
const currentChannelmemberInfo = ref({});
const currentChannelmemberId = ref<number>(props.channelmember.id);
const currentChannelmemberStatus = ref<string>('');
const currentChannelmemberUsername  = ref<string>(props.channelmember.username);
const currentChannelId = ref<number>(props.channelId);

onBeforeMount(async () => {

    // FIND ALL MEMBERS OF CHANNEL
    const fetchChannelmemberInfo = async (channelmemberId: number) => {
        const channelmemberQuery = 'member_id=' + channelmemberId.toString();
        const channelQuery = 'channel_id=' + currentChannelId.value.toString();
        const responseRights = await axiosInstance.get('channelmember/rights/' + playerId + `?${channelmemberQuery}&${channelQuery}`);
        const responseStatus = await axiosInstance.get('player/status/' + channelmemberId.toString());
        currentChannelmemberStatus.value = responseStatus.data;
        return responseRights.data;
    }

    currentChannelmemberInfo.value = await fetchChannelmemberInfo(currentChannelmemberId.value);

    //TRACK WHETHER CHANNELMEMBER_ID CHANGES
    watch(() => props.channelmember, async (newChannelmember: {username: string, id: number}) => {
        currentChannelmemberId.value = newChannelmember.id;
        currentChannelmemberUsername.value = newChannelmember.username;
        currentChannelmemberInfo.value = await fetchChannelmemberInfo(currentChannelmemberId.value);
    });

    //TRACK WHETHER CHANNELMEMBERS BECOME OFFLINE/ONLINE??

})

//CONFIRM DIALOG BUTTON
const openConfirmDialog = (selectedAction: Actions) => {
    confirm.require({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        accept: () => {
            if (selectedAction == Actions.BAN)
                banChannelmember();
            else if (selectedAction == Actions.MUTE)
                muteChannelmember();
            else if (selectedAction == Actions.REMOVE) {
                removeChannelmember();
            }
        }
    });
};

// ADD FRIEND (http post or socket?)
const addFriend = async () => {
    const response = await axiosInstance.post(`friend/add/${playerId}`, { friendUsername: currentChannelmemberUsername.value });
    if (response.data) {
        toast.add({ severity: 'info', summary: 'Added Friend Successfully', detail: '', life: 3000 });
        currentChannelmemberInfo.value.memberIsFriend = true;
    }
    else
        toast.add({ severity: 'error', summary: 'Error Friend not Added', detail: '', life: 3000 });
}

// MUTE CHANNELMEMBER
const muteChannelmember = async () => {
    const response = await axiosInstance.patch(`channelmember/mute/${playerId}`, {
        channel_id: currentChannelId.value,
        member_id: currentChannelmemberId.value,
        is_muted: true
    });

    if (response.data) {
        toast.add({ severity: 'info', summary: 'Muted Channelmember Successfully', detail: '', life: 3000 });
        currentChannelmemberInfo.value.showMute = false;
    }
    else
        toast.add({ severity: 'error', summary: 'Error Channelmember not Muted', detail: '', life: 3000 });
}

// MAKE CHANNELMEMBER ADMIN
const makeAdmin = async () => {
    const response = await axiosInstance.patch(`channelmember/makeadmin/${playerId}`, {
        channel_id: currentChannelId.value,
        member_id: currentChannelmemberId.value,
        is_admin: true
    });

    if (response.data) {
        toast.add({ severity: 'info', summary: 'Channelmember is Admin', detail: '', life: 3000 });
        currentChannelmemberInfo.value.memberIsAdmin = true;
        currentChannelmemberInfo.value.showMakeAdmin = false;
    }
    else
        toast.add({ severity: 'error', summary: 'Error Channelmember not made Admin', detail: '', life: 3000 });
}

// BAN CHANNELMEMBER
const banChannelmember = async () => {
    const response = await axiosInstance.patch(`channelmember/ban/${playerId}`, {
        channel_id: currentChannelId.value,
        member_id: currentChannelmemberId.value,
        is_banned: true
    });

    if (response.data) {
        toast.add({ severity: 'info', summary: 'Banned Channelmember successfully', detail: '', life: 3000 });
        currentChannelmemberInfo.value.showBan = false;
    }
    else
        toast.add({ severity: 'error', summary: 'Error Channelmember not Banned', detail: '', life: 3000 });
}

// DELETE CHANNELMEMBER
const removeChannelmember = async () => {
    const response = await axiosInstance.delete(`channelmember/${playerId}`, { data: {
        channel_id: currentChannelId.value,
        member_id: currentChannelmemberId.value
    }})

    if (response.data) {
        toast.add({ severity: 'info', summary: 'Removed Channelmember successfully', detail: '', life: 3000 });
        emit('removeChannelmember', currentChannelmemberId.value);
    }
    else
        toast.add({ severity: 'error', summary: 'Error Channelmember not removed', detail: '', life: 3000 });
}


</script>