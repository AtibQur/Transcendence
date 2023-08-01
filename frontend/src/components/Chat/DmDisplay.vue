<template>
    <h4>Direct Messages</h4>
    <ul id="dmList">
        <li v-for="(dm, index) in dms" :key="index">
            <button class="dm-display-button" @click="changeChannel(dm.channel_id)"> {{ dm.friend_username }} </button>
        </li>
    </ul>
    <p></p>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import axiosInstance from '../../axiosConfig';
import { onBeforeMount, ref} from 'vue'

const emit = defineEmits(['changeChannel']);
const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
const dms = ref([]);

onBeforeMount(async () => {
    
    await fetchDms(playerId);
    
    // LISTEN IF A NEW CHANNEL IS ADDED
    socket.on('newDm', (dm) => {
        socket.emit('joinRoom', { playerId: playerId, channelId: dm.channel_id }, () => {
            dms.value.push(dm);
        })
    });
})
    
    // FIND ALL CHANNEL FOR PLAYER
    const fetchDms = async (playerId: number) => {
        const response = await axiosInstance.get('channelmember/alldms/' + playerId.toString());
        if (response.data)
        {
            response.data.forEach((item) => {
                const friend = item.channel.members.find((member) => member.member_id !== playerId);

                const dm = {
                    channel_id: item.channel_id,
                    friend_username: friend ? friend.member.username : null
                };

                dms.value.push(dm);
            });
        }
        else
            console.log('Error fetching dms');
    }

    // EVENT TO CHANGE CURRENT CHANNEL
    const changeChannel = (channel_id: number) => {
        emit('changeChannel', channel_id, false, true);
    }

</script>

<style>
.dm-display-button {
    font-family: 'JetBrains Mono';
    background-color: transparent;
    border: none;
    cursor: pointer;
    background-color: var(--white-moretransparent);
    color: var(--black-soft);
    min-height:30px; 
    min-width: 300px;
    text-align: left;
    transition: color 0.3s;
    padding: 20px;
    margin: 0;
}

.dm-display-button:hover {
    background-color: var(--blue-dark-transparent);
    color: var(--white-softblue);
    transition: 0.3s;
}

</style>