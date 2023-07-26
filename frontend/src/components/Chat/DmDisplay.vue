<template>
    <h4>Direct Messages</h4>
    <ul id="dmList">
        <li v-for="(dm, index) in dms" :key="index">
            <button class="dm-display-button" @click="changeChannel(dm.channel_id)"> {{ dm.friend_username }} </button>
        </li>
    </ul>
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
            console.log('dm: ', dm);
            dms.value.push(dm);
            console.log(dms.value);
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
        emit('changeChannel', channel_id, false);
    }

</script>

<style>
.dm-display-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: rgb(79, 76, 76);
    text-decoration: underline;
    transition: color 0.3s;
    padding: 0;
    margin: 0;
}

</style>