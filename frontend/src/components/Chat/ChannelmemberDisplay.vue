<template>
    <h4>Channel Members</h4>
    <ul id="channelmemberList">
        <div class="card flex justify-content-center">
            <Sidebar v-model:visible="visible" position="right">
                <UserOptionsMenu :channelId="currentChannelId" :channelmemberId="selectedChannelmember"/>
            </Sidebar>
        </div>
        <li v-for="(channelmember, index) in channelmembers" :key="index">
            <button class="channelmember-button" @click="showOptionPanel(channelmember)"> {{ channelmember }} </button>
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

const channelmembers = ref(new Map<number, string>());
const currentChannelId = ref<number>(props.channelId);
const selectedChannelmember = ref<string>('');
const visible = ref<boolean>(false);

onBeforeMount(async () => {

    // FIND ALL MEMBERS OF CHANNEL
    const fetchChannelmembers = async (channelId: number) => {
        const response = await axiosInstance.get('channelmember/allmembers/' + channelId.toString());
        // console.log('channelmembers', response.data);
        // channelmembers.value = response.data.map(member => member.member.username);
        response.data.forEach((member) => {
            channelmembers.value.set(member.member_id, member.member.username);
        });
        console.log(channelmembers.value);
    }

    await fetchChannelmembers(currentChannelId.value);

    //ADD NEW CHANNELMEMBER
    socket.on('newChannelmember', (channelmember_name: string) => {
        channelmembers.value.push(channelmember_name);
    });

    //TRACK WHETHER CHANNEL_ID CHANGES
    watch(() => props.channelId, async (newChannelId) => {
        currentChannelId.value = newChannelId;
        await fetchChannelmembers(currentChannelId.value);
    });

})

function showOptionPanel(channelmember: string) {
    selectedChannelmember.value = channelmember;
    visible.value = true;
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