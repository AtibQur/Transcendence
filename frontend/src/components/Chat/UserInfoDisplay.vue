<template>
    <div>
        <img :src="profilePicture" alt="Avatar" style="width:100%">
        <h3> {{ currentChannelmemberUsername }}</h3>
        <h4> {{ ( currentChannelmemberStatus ) }}</h4>
        
        <!-- for testing purposes -->
        <div v-if="currentChannelmemberInfo.memberIsOwner">
            <h5>[OWNER]</h5>
        </div>
        <div v-if="currentChannelmemberInfo.memberIsAdmin">
            <h5>[ADMIN]</h5>
        </div>
        <div v-if="currentChannelmemberInfo.memberIsMuted">
            <h5>[MUTED]</h5>
        </div>
        <div v-if="currentChannelmemberInfo.memberIsBanned">
            <h5>[BANNED]</h5>
        </div>

    </div>
    <div v-if="currentChannelmemberUsername != playerUsername">
        <div>
            <button>View Profile</button>
        </div>
        <div v-if="currentChannelmemberInfo.memberIsFriend">
            <div v-if="isDm">
                <button>Send Message</button>
            </div>
            <button>Invite To Play Pong</button>
        </div>
        <div v-else>
            <button @click="addFriend()">Add Friend</button>
        </div>
        
        <div v-if="!isDm">
            <div v-if="currentChannelmemberInfo.showMute">
                <button @click="openConfirmDialog(Actions.MUTE)">Mute</button>
            </div>
            <div v-if="!currentChannelmemberInfo.showMute && !currentChannelmemberInfo.memberIsOwner">
                <button @click="unmuteChannelmember()">Unmute</button>
            </div>
            <div v-if="currentChannelmemberInfo.showMakeAdmin">
                <button @click="makeAdmin()">Make Admin</button>
            </div>
            <div v-if="currentChannelmemberInfo.showBan">
                <button @click="openConfirmDialog(Actions.BAN)">Ban</button>
            </div>
            <div v-if="currentChannelmemberInfo.showDelete">
                <button @click="openConfirmDialog(Actions.REMOVE);">Remove from Channel</button>
            </div>
        </div>
    </div>
    <div v-else>
        <button>Edit Profile</button>
    </div>
</template>

<script setup lang="ts">
import axiosInstance from '../../axiosConfig';
import { onBeforeMount, ref, watch } from 'vue'
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
const profilePicture = ref('');
const isDm = ref(false);

onBeforeMount(async () => {

    currentChannelmemberInfo.value = await fetchChannelmemberInfo(currentChannelmemberId.value);
    profilePicture.value = await fetchAvatar(currentChannelmemberId.value);
    isDm.value = await checkIfDm(currentChannelId.value);

    //TRACK WHETHER CHANNELMEMBER_ID CHANGES
    watch(() => props.channelmember, async (newChannelmember: {username: string, id: number}) => {
        currentChannelmemberId.value = newChannelmember.id;
        currentChannelmemberUsername.value = newChannelmember.username;
        currentChannelmemberInfo.value = await fetchChannelmemberInfo(currentChannelmemberId.value);
        profilePicture.value = await fetchAvatar(currentChannelmemberId.value);
    });

    //TRACK WHETHER CHANNELMEMBERS BECOME OFFLINE/ONLINE??

})

// FIND ALL MEMBERS OF CHANNEL
const fetchChannelmemberInfo = async (channelmemberId: number) => {
    const channelmemberQuery = 'member_id=' + channelmemberId.toString();
    const channelQuery = 'channel_id=' + currentChannelId.value.toString();
    const responseRights = await axiosInstance.get('channelmember/rights/' + playerId + `?${channelmemberQuery}&${channelQuery}`);
    const responseStatus = await axiosInstance.get('player/status/' + channelmemberId.toString());
    currentChannelmemberStatus.value = responseStatus.data;
    return responseRights.data;
}

const fetchAvatar = async (channelmemberId: number) => {
    const response = await axiosInstance.get('player/avatar/' + channelmemberId.toString());
    
    if (response.data) {
        const imageBytes: Uint8Array = new Uint8Array(response.data.data);
        const imageUrl = ref<string | null>(null);
        imageUrl.value = URL.createObjectURL(new Blob([imageBytes]));
        return imageUrl.value;
    }
    else
        console.log("Error could not fetch avatar");
  };

const checkIfDm = async (channelId: number) => {
    const response = await axiosInstance.get('channel/dm/' + channelId.toString());

    if (response.data != null) {
        return response.data;
    }
    else
        console.log('Error could not check if channel is dm');
}

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
        currentChannelmemberInfo.value.memberIsMuted = true;
    }
    else
        toast.add({ severity: 'error', summary: 'Error Channelmember not Muted', detail: '', life: 3000 });
}

// MUTE CHANNELMEMBER
const unmuteChannelmember = async () => {
    const response = await axiosInstance.patch(`channelmember/unmute/${playerId}`, {
        channel_id: currentChannelId.value,
        member_id: currentChannelmemberId.value,
        is_muted: false
    });

    if (response.data) {
        toast.add({ severity: 'info', summary: 'Unmuted Channelmember Successfully', detail: '', life: 3000 });
        currentChannelmemberInfo.value.showMute = true;
        currentChannelmemberInfo.value.memberIsMuted = false;
    }
    else
        toast.add({ severity: 'error', summary: 'Error Channelmember not unMuted', detail: '', life: 3000 });
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