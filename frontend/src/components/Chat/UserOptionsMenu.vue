<template>
    <div>
        <h3> {{ props.channelmemberId }}</h3>
    </div>
    <div v-if="props.channelmemberId != playerUsername">
        <div>
            <button>View Profile</button>
        </div>
        <div>
            <button>Send Message</button>
        </div>
        <div>
            <button>Invite To Play Pong</button>
        </div>
        <div>
            <button>Block</button>
            <button>Mute</button>
            <button>Ban</button>
        </div>
        <div>
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
    channelmemberId: {
        type: Number,
        required: true
    }
});

const playerUsername = sessionStorage.getItem('username') || '0';
const playerId = sessionStorage.getItem('playerId') || '0';
const currentChannelmemberId = ref<number>(props.channelmemberId);
const currentChannelId = ref<number>(props.channelId);

onBeforeMount(async () => {

    // FIND ALL MEMBERS OF CHANNEL
    const fetchChannelmemberInfo = async (channelId: number) => {
        const channelmemberQuery = 'member_id=' + currentChannelmemberId.value.toString;
        const channelQuery = 'channel_id=' + currentChannelId.value.toString;
        const response = await axiosInstance.get('channelmember/rights/' + playerId + `?${channelmemberQuery}&${channelQuery}`);
        console.log(response.data);
        // channelmembers.value = response.data.map(member => member.member.username);
    }

    await fetchChannelmemberInfo(currentChannelmemberId.value);


    //TRACK WHETHER CHANNELMEMBER_ID CHANGES
    watch(() => props.channelmemberId, async (newChannelmemberId: number) => {
        currentChannelmemberId.value = newChannelmemberId;
        await fetchChannelmemberInfo(currentChannelmemberId.value);
    });

})

</script>