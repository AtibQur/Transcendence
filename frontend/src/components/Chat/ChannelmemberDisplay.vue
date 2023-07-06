<template>
    <h4>Channel Members</h4>
    <ul id="channelmemberList">
        <li v-for="(channelmember, index) in channelmembers" :key="index">
            <button class="channelmember-button"> {{ channelmember }} </button>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import axiosInstance from '../../axiosConfig';
import { onBeforeMount, ref, watch } from 'vue'

const props = defineProps({
    channelId: {
        type: Number,
        required: true
    }
});

const channelmembers = ref([]);
const currentChannelId = ref(props.channelId);
const showPopup = ref(false);

onBeforeMount(async () => {

    // FIND ALL MEMBERS OF CHANNEL
    const fetchChannelmembers = async (channelId: number) => {
        const response = await axiosInstance.get('channelmember/allmembers/' + channelId.toString());
        channelmembers.value = response.data.map((item) => item.member.username);
    }

    await fetchChannelmembers(currentChannelId.value);

    //ADD NEW CHANNELMEMBER
    socket.on('newChannelmember', (channelmember_name: string) => {
        console.log("new channel member");
        channelmembers.value.push(channelmember_name);
    });

    //TRACK WHETHER CHANNEL_ID CHANGES
    watch(() => props.channelId, async (newChannelId) => {
        currentChannelId.value = newChannelId;
        await fetchChannelmembers(currentChannelId.value);
    });
})

const openUserOptionsPopup = async () => {
    showPopup.value = true;
    setTimeout(() => {
        showPopup.value = false;
    }, 5000); 
}


</script>

<style>

.channelmember-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #000;
  text-decoration: underline;
  transition: color 0.3s;
  padding: 0;
  margin: 0;
}

.channelmember-button:hover {
  color: rgb(79, 76, 76);
}

</style>