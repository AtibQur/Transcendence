<template>
    <Toast/>
    <div>
        <h3> {{ currentChannelmemberUsername }}</h3>
        <h6> {{ ( currentChannelmemberStatus ) }}</h6>
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
        <div v-if="currentChannelmemberInfo.showBlock">
            <!-- this func is probably reused in friends page? maybe make reusable component? -->
            <button @click="blockPlayer()">Block</button>
        </div>
        <div v-if="currentChannelmemberInfo.showMute">
            <button>Mute</button>
            <!-- <button @click="muteChannelmember()">Mute</button> -->
        </div>
        <div v-if="currentChannelmemberInfo.showMakeAdmin">
            <button>Make Admin</button>
            <!-- <button @click="makeAdmin()">Make Admin</button> -->
        </div>
        <div v-if="currentChannelmemberInfo.showBan">
            <button>Ban</button>
            <!-- <button @click="banChannelmember()">Ban</button> -->
        </div>
    </div>
    <div v-else>
        <button>Edit Profile</button>
    </div>
</template>

<script setup lang="ts">
import { socket } from '@/socket';
import axiosInstance from '../../axiosConfig';
import { onBeforeMount, ref, watch } from 'vue'
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

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

const toast = useToast();
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

// BLOCK PLAYER
const blockPlayer = async () => {
    const response = await axiosInstance.post(`blockedplayer/add/${playerId}`, { blockedUsername: currentChannelmemberUsername.value });
    if (response.data) {
        toast.add({ severity: 'info', summary: 'Blocked Player Successfully', detail: '', life: 3000 });
        currentChannelmemberInfo.value.showBlock = false;
    }
    else
        toast.add({ severity: 'error', summary: 'Error Player not Blocked', detail: '', life: 3000 });
}

// // MUTE CHANNELMEMBER
// const muteChannelmember = async () => {

// }

// // MAKE CHANNELMEMBER ADMIN
// const makeAdmin = async () => {
    
// }

// // BAN CHANNELMEMBER
// const banChannelmember = async () => {

// }


</script>