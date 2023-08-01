<template>
    <h4 class="custom-h4">Channel Members</h4>
    <ul id="channelmemberList">
        <div class="card flex justify-content-center">
            <Sidebar v-model:visible="visible" position="right" class="custom-sidebar">
                <UserInfoDisplay @changeChannel="changeChannel"
                                @removeChannelmember="removeChannelmember"
                                :channelId="currentChannelId"
                                :channelmember="selectedChannelmember"/>
            </Sidebar>
        </div>
        <li v-for="(channelmember, index) in channelmembers" :key="index">
            <button class="channelmember-button" @click="showOptionPanel(channelmember)">
                {{ channelmember.username === playerUsername ? 'You' : channelmember.username }}
            </button>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import axiosInstance from '../../axiosConfig';
import { onBeforeMount, ref, watch } from 'vue'
import Sidebar from 'primevue/sidebar';
import UserInfoDisplay from './UserInfoDisplay.vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const props = defineProps({
    channelId: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['changeChannel']);
const channelmembers = ref([]);
const playerUsername = sessionStorage.getItem('username') || null;
const currentChannelId = ref<number>(props.channelId);
const selectedChannelmember = ref({});
const visible = ref<boolean>(false);

onBeforeMount(async () => {
    
    await fetchChannelmembers(currentChannelId.value);
    
    //ADD NEW CHANNELMEMBER
    socket.on('newChannelmember', (channelmember: {username: string, id: number}) => {
        channelmembers.value.push(channelmember);
    });

    // UPDATE CHANNELMEMBER DISPLAY IF A MEMBER HAS LEFT A CHANNEL
    socket.on('removeChannelmember', (member_id: number, channel_name: string) => {
        const index = channelmembers.value.findIndex((item) => item.id === member_id);

        if (index == -1)
            console.log(`channel not found in channels`);
        else {
            const channelmember = channelmembers.value[index];
            channelmembers.value.splice(index, 1);
        }
    });

    //TRACK WHETHER CHANNEL_ID CHANGES
    watch(() => props.channelId, async (newChannelId: number) => {
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

const changeChannel = async (channel_id: number, isChannel: boolean, isDm: boolean) => {
    emit('changeChannel', channel_id, isChannel, isDm);
}

</script>

<style scoped>
.custom-h4 {
  font-family: 'JetBrains Mono';
  font-weight: bold;
  font-size: larger;
  color: black;
}

.channelmember-button {
  font-family: 'JetBrains Mono';
  background-color: transparent;
  color: var(--black-soft);
  border: none;
  cursor: pointer;
  color: #000;
  transition: color 0.3s;
  min-width: 200px;
  text-align: left;
  font-size: medium;
  padding-bottom: 10px;
  margin: 0;
}

.channelmember-button:hover {
  color: var(--white-softblue);
  transition: 0.3s;
}

</style>