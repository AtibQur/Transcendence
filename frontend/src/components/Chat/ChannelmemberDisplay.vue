<template>
    <h4>Channel Members</h4>
    <ul id="channelmemberList">
        <div class="card flex justify-content-center">
            <Sidebar v-model:visible="visible" position="right">
                <UserOptionsMenu @removeChannelmember="removeChannelmember" :channelId="currentChannelId" :channelmember="selectedChannelmember"/>
            </Sidebar>
        </div>
        <li v-for="(channelmember, index) in channelmembers" :key="index">
            <button class="channelmember-button" @click="showOptionPanel(channelmember)"> {{ channelmember.username }} </button>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import axiosInstance from '../../axiosConfig';
import { onBeforeMount, ref, watch } from 'vue'
import Sidebar from 'primevue/sidebar';
import UserOptionsMenu from './UserOptionsMenu.vue';

const props = defineProps({
    channelId: {
        type: Number,
        required: true
    }
});

const channelmembers = ref([]);
const currentChannelId = ref<number>(props.channelId);
const selectedChannelmember = ref({});
const visible = ref<boolean>(false);

onBeforeMount(async () => {
k
    
    await fetchChannelmembers(currentChannelId.value);
    
    //ADD NEW CHANNELMEMBER
    socket.on('newChannelmember', (channelmember: {username: string, id: number}) => {
        channelmembers.value.push(channelmember);
    });

    //TRACK WHETHER CHANNEL_ID CHANGES
    watch(() => props.channelId, async (newChannelId) => {
        currentChannelId.value = newChannelId;
        await fetchChannelmembers(currentChannelId.value);
    });

})

// FIND ALL MEMBERS OF CHANNEL
const fetchChannelmembers = async (channelId: number) => {
    const response = await axiosInstance.get('channelmember/allmembers/' + channelId.toString());

    channelmembers.value = response.data.map((item) => ({
        username: item.member.username,
        id: item.member_id,
    }));
}

//ACTIVATE OPTION PANEL
function showOptionPanel(channelmember: {username: string, id: number}) {
    selectedChannelmember.value = channelmember;
    visible.value = true;
}

//LISTENER FUNCTION FOR EVENT FROM OPTIONS MENU COMPONENT
const removeChannelmember = async (member_id: number) => {
    const index = channelmembers.value.findIndex((item) => item.id === member_id);

    if (index == -1)
        console.log(`Member not found in channelmembers`);
    else {
        channelmembers.value.splice(index, 1);
        visible.value = false;
    }
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