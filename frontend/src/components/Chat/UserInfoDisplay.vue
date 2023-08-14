<template>
    <div>
        <div class="profile-container">
            <div class="ProfilePicture">
              <img :src="profilePicture" alt="Avatar" style="width:100%">
            </div>
        </div>
        <div class="name-container">
            <div>
                <h4 class="name"> {{ currentChannelmemberUsername }}</h4>
            </div>
            <div class="status-circle" :class="{ 'online': currentChannelmemberStatus === 'online', 'offline': currentChannelmemberStatus !== 'online' }"></div>
        </div>
        <!-- for testing purposes -->
        <div v-if="!isDm">
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
    </div>

    <div v-if="currentChannelmemberUsername != playerUsername">
        <div>
            <router-link :to="{
                name: 'friends',
                params: { playerName: currentChannelmemberUsername, profilePicture: profilePicture, status: currentChannelmemberStatus }}" >
                <button class="custom-button-1">View Profile</button>
            </router-link>
        </div>
        <div v-if="currentChannelmemberInfo.memberIsFriend">
            <div v-if="!isDm">
                <button @click="sendDm()" class="custom-button-1">Send Message</button>
            </div>
            <button @click="invite()" class="custom-button-1">Invite To Play Pong</button>
        </div>
        <div v-else>
            <button class="custom-button-1" @click="addFriend()">Add Friend</button>
        </div>
        
        <div v-if="!isDm && isAdmin">
            <div v-if="currentChannelmemberInfo.showMute">
                <button  class="custom-button-1" @click="openConfirmDialog(Actions.MUTE)">Mute</button>
            </div>
            <div v-if="!currentChannelmemberInfo.showMute && !currentChannelmemberInfo.memberIsOwner">
                <button  class="custom-button-1" @click="unmuteChannelmember()">Unmute</button>
            </div>
            <div v-if="currentChannelmemberInfo.showMakeAdmin">
                <button  class="custom-button-1" @click="makeAdmin()">Make Admin</button>
            </div>
            <div v-if="currentChannelmemberInfo.showBan">
                <button  class="custom-button-1" @click="openConfirmDialog(Actions.BAN)">Ban</button>
            </div>
            <div v-if="!currentChannelmemberInfo.showBan && !currentChannelmemberInfo.memberIsOwner">
                <button  class="custom-button-1" @click="unbanChannelmember()">Unban</button>
            </div>
            <div v-if="currentChannelmemberInfo.showDelete">
                <button  class="custom-button-1" @click="openConfirmDialog(Actions.REMOVE);">Remove from Channel</button>
            </div>
        </div>
    </div>
    <div v-else>
        <router-link to="/profile">
                <button class="custom-button-1">Edit Profile</button>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import axiosInstance from '@/utils/axiosConfig';
import { socket } from '@/utils/socket';
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

const emit = defineEmits(['changeChannel', 'removeChannelmember']);

const toast = useToast();
const confirm = useConfirm();
const playerUsername = localStorage.getItem('username') || '0';
const playerId = parseInt(localStorage.getItem('playerId') || '0');
const currentChannelmemberInfo = ref({});
const currentChannelmemberId = ref<number>(props.channelmember.id);
const currentChannelmemberStatus = ref<string>('');
const currentChannelmemberUsername  = ref<string>(props.channelmember.username);
const currentChannelId = ref<number>(props.channelId);
const profilePicture = ref('');
const isDm = ref(false);
const isAdmin = ref(false);

onBeforeMount(async () => {

    currentChannelmemberInfo.value = await fetchChannelmemberInfo(currentChannelmemberId.value);
    profilePicture.value = await fetchAvatar(currentChannelmemberId.value);
    isDm.value = await checkIfDm(currentChannelId.value);
    isAdmin.value = await checkIfAdmin(currentChannelId.value);

    //TRACK WHETHER CHANNELMEMBER_ID CHANGES
    watch(() => props.channelmember, async (newChannelmember: {username: string, id: number}) => {
        currentChannelmemberId.value = newChannelmember.id;
        currentChannelmemberUsername.value = newChannelmember.username;
        currentChannelmemberInfo.value = await fetchChannelmemberInfo(currentChannelmemberId.value);
        profilePicture.value = await fetchAvatar(currentChannelmemberId.value);
    });

})

// FIND ALL MEMBERS OF CHANNEL
const fetchChannelmemberInfo = async (channelmemberId: number) => {
    const channelmemberQuery = 'member_id=' + channelmemberId.toString();
    const channelQuery = 'channel_id=' + currentChannelId.value.toString();
    const responseRights = await axiosInstance.get('channelmember/rights/' + playerId.toString() + `?${channelmemberQuery}&${channelQuery}`);
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

const checkIfAdmin = async (channelId: number) => {
    const response = await axiosInstance.get('channelmember/admin/' + playerId.toString() + '/' + channelId.toString());

    if (response.data != null) {
        return response.data;
    }
    else
        console.log('Error could not check if player is admin');
}

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
    const response = await axiosInstance.post(`friend/add/${playerId.toString()}`, { friendUsername: currentChannelmemberUsername.value });
    if (response.data) {
        toast.add({ severity: 'info', summary: 'Added Friend Successfully', detail: '', life: 3000 });
        currentChannelmemberInfo.value.memberIsFriend = true;
    }
    else
        toast.add({ severity: 'error', summary: 'Error Friend not Added', detail: '', life: 3000 });
}

// SEND DM
// if dm conversation does not already exist, create dm
const sendDm = async () => {
    const response = await axiosInstance.get('channel/dm/info/' + playerId.toString() + '/' + currentChannelmemberId.value.toString());
    if (response)
    {
        if (response.data)
            emit('changeChannel', response.data.id, false, true);
        else {
            socket.emit('addDm', { player_id: playerId, friend_id: currentChannelmemberId.value }, (response) => {
                if (response)
                    emit('changeChannel', response, false, true);
            })
        }
    }
}

// INVITE TO PLAY PONG
const invite = async() => {
	console.log("invite send to", currentChannelmemberId);
	socket.emit('sendInvite', {player_id: playerId, opponent_id: currentChannelmemberId.value, socket_id: socket.id}, 
    (response) => {
        console.log("RESPONSE", response)
        if (!response)   
            toast.add({ severity: 'success', summary: 'Invitation send', detail: '', life: 3000 });
        else if (response === 1)
            toast.add({ severity: 'error', summary: "You can't send an invite, you are in a match", detail: '', life: 3000 });
        else if (response === 2)
            toast.add({ severity: 'error', summary: "That player already received an invite", detail: '', life: 3000 });
    })
}

// MUTE CHANNELMEMBER
const muteChannelmember = async () => {
    const response = await axiosInstance.patch(`channelmember/mute/${playerId.toString()}`, {
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
    const response = await axiosInstance.patch(`channelmember/unmute/${playerId.toString()}`, {
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
        toast.add({ severity: 'error', summary: 'Error Channelmember not Unmuted', detail: '', life: 3000 });
}

// MAKE CHANNELMEMBER ADMIN
const makeAdmin = async () => {
    const response = await axiosInstance.patch(`channelmember/makeadmin/${playerId.toString()}`, {
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
    await socket.emit('banMember', { player_id: playerId,
                                     member_id: currentChannelmemberId.value,
                                     channel_id: currentChannelId.value,
                                     toBan: true }, (response) => {
        if (response)
        {
            toast.add({ severity: 'info', summary: 'Banned Channelmember Successfully', detail: '', life: 3000 });
            currentChannelmemberInfo.value.showBan = false;
            currentChannelmemberInfo.value.memberIsBanned = true;
        }
        else 
            toast.add({ severity: 'error', summary: 'Error Channelmember not Banned', detail: '', life: 3000 });
    })
}

// BAN CHANNELMEMBER
const unbanChannelmember = async () => {
    await socket.emit('banMember', { player_id: playerId,
                                     member_id: currentChannelmemberId.value,
                                     channel_id: currentChannelId.value,
                                     toBan: false }, (response) => {
        if (response)
        {
            toast.add({ severity: 'info', summary: 'Unbanned Channelmember successfully', detail: '', life: 3000 });
            currentChannelmemberInfo.value.showBan = true;
            currentChannelmemberInfo.value.memberIsBanned = false;
        }
        else 
        toast.add({ severity: 'error', summary: 'Error Channelmember not Unbanned', detail: '', life: 3000 });
    })
}

// DELETE CHANNELMEMBER
const removeChannelmember = async () => {
    
    await socket.emit('leaveRoom', {player_id: playerId, member_id: currentChannelmemberId.value, channel_id: currentChannelId.value}, (response) => {
        if (response)
        {
            toast.add({ severity: 'success', summary: 'Removed Channelmember successfully', detail: '', life: 3000 });
            emit('removeChannelmember', currentChannelmemberId.value);
        }
        else 
            toast.add({ severity: 'error', summary: 'Error Channelmember not removed', detail: '', life: 3000 });
    })
}


</script>

<style scoped>

.profile-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ProfilePicture {
  width: 250px;
  height: 250px;
  overflow: hidden;
  border-radius: 50%;
}

.ProfilePicture img {
  height: 100%;
  width: auto;
}

  .name-container {
  margin: 10px;
  padding: 5px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.name {
    font-family: 'JetBrains Mono';
    font-weight: bolder;
    font-size: x-large;
    color: black;
    text-align: center;
    margin-right: 10px;
}
  .status-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.online {
  background-color: var(--green-soft);
}

.offline {
  background-color: var(--red-soft);
}
</style>