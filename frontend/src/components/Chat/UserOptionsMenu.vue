<template>
    <div>
        <h3> {{ currentChannelmemberUsername }}</h3>
    </div>
    <div v-if="currentChannelmemberUsername != playerUsername">
        <div>
            <button>View Profile</button>
        </div>
        <div>
            <button>Send Message</button>
        </div>
        <div>
            <button>Invite To Play Pong</button>
        </div>
        <div v-if="currentChannelmemberInfo.showBlock">
            <!-- if the current player is admin and the current member not owner -->
            <button>Block</button>
        </div>
        <div v-if="currentChannelmemberInfo.showMute">
            <button>Mute</button>
        </div>
        <div v-if="currentChannelmemberInfo.showMakeAdmin">
            <button>Make Admin</button>
        </div>
        <div v-if="currentChannelmemberInfo.showBan">
            <button>Ban</button>
        </div>
        <div>
            <!-- the current player is not friends yet with the current member -->
            <button>Add Friend</button>
        </div>
    </div>
    <div v-else>
        <button>Edit Profile</button>
    </div>
</template>

<script setup lang="ts">
import axiosInstance from '../../axiosConfig';
import { onBeforeMount, ref, watch } from 'vue'

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

const playerUsername = sessionStorage.getItem('username') || '0';
const playerId = sessionStorage.getItem('playerId') || '0';
const currentChannelmemberInfo = ref({});
const currentChannelmemberId = ref<number>(props.channelmember.id);
const currentChannelmemberUsername  = ref<string>(props.channelmember.username);
const currentChannelId = ref<number>(props.channelId);

onBeforeMount(async () => {

    // FIND ALL MEMBERS OF CHANNEL
    const fetchChannelmemberInfo = async (channelmemberId: number) => {
        const channelmemberQuery = 'member_id=' + channelmemberId.toString();
        const channelQuery = 'channel_id=' + currentChannelId.value.toString();
        const response = await axiosInstance.get('channelmember/rights/' + playerId + `?${channelmemberQuery}&${channelQuery}`);
        return response.data;
        // channelmembers.value = response.data.map(member => member.member.username);
    }

    currentChannelmemberInfo.value = await fetchChannelmemberInfo(currentChannelmemberId.value);
    console.log('channelmember info: ', currentChannelmemberInfo.value);


    //TRACK WHETHER CHANNELMEMBER_ID CHANGES
    watch(() => props.channelmember, async (newChannelmember: {username: string, id: number}) => {
        currentChannelmemberId.value = newChannelmember.id;
        currentChannelmemberUsername.value = newChannelmember.username;
        currentChannelmemberInfo.value = await fetchChannelmemberInfo(currentChannelmemberId.value);
    });

})

</script>