<template>
    <div class="card flex justify-content-center p-fluid">
        <button class="custom-button-1" @click="showDialog()">Join Channel</button>
        <Dialog v-model:visible="showPasswordDialog"
                modal header="Enter Password"
                :style="{ width: '80wv' }"
                :closeButtonProps="handleCloseButtonPassword"
                >
            <form @submit.prevent="checkPassword()">
                <div class="p-field password-dialog">
                    <label for="password" >New Password </label>
                    <Password id="password" inputId="add" v-model="password" toggleMask :feedback="false" />
                    <small id="text-error" class="p-error">{{ errorMessage }}</small>
                    <button class="custom-button-1" type="submit" style="background-color: var(--blue-lightest)">Join</button>
                </div>
            </form>
        </Dialog>
        <Dialog v-model:visible="showJoinDialog"
                modal header="Join Channel"
                :style="{ width: '50vw' }"
                >
            <VirtualScroller :items="allChannels" :itemSize="50" class="border-1 surface-border border-round" style="width: 40vw; height: 20vw">
                <template v-slot:item="{ item, options }">
                    <div :class="['flex align-items-center p-2 channel', { 'surface-hover': options.odd } ]" style="height: 50px">
                        <div>
                            {{ item.name }}
                        </div>
                        <div class="join-button">
                            <div v-if="!item.joined">
                                <button @click="checkPermission(item)" class="custom-button-1" style="background-color: var(--blue-lightest)">Join</button>
                            </div>
                            <div v-else>
                                <button class="custom-button-1" style="background-color: var(--blue-lightest)">Joined!</button>
                            </div>
                        </div>
                    </div>
                </template>
            </VirtualScroller>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { socket } from '@/socket';
import axiosInstance from '../../axiosConfig';
import { ref } from 'vue';
import Password from 'primevue/password'
import Dialog from 'primevue/dialog';
import VirtualScroller from 'primevue/virtualscroller';
import { useToast } from 'primevue/usetoast';

const allChannels = ref(null);
const toast = useToast();
const showJoinDialog = ref<boolean>(false);
const showPasswordDialog = ref<boolean>(false);
const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
const playerUsername = sessionStorage.getItem('username') || '';
const password = ref<string>('');
const errorMessage = ref<string>('');
const protectedChannel = ref(null);

const showDialog = async () => {
    showJoinDialog.value = true
    await fetchAllJoinableChannels();
}

const handleCloseButtonPassword = {
    'aria-label': 'Close Dialog',
    onClick: () => {
        password.value = '';
        errorMessage.value = '';
    },
};

const fetchAllJoinableChannels = async () => {
    const response = await axiosInstance.get('channel/all/' + playerId.toString());
    if (response.data)
        allChannels.value = response.data.map((item) => ({ ...item, joined: false }));
    else
        console.log('Error fetching all channels');
}

const isProtected = async (channel: {id: number, name: string, joined: boolean}) => {
    const response = await axiosInstance.get('channel/protect/' + channel.id.toString());
    if (response.data != null)
        return response.data;
    return null;
}

const checkPassword = async () => {
    if (!password.value)
    {
        errorMessage.value = 'Password required.';
        return false;
    }
    
    const isValidated = await axiosInstance.get('channel/protect/valid/'
                                                + protectedChannel.value.id.toString()
                                                + '?password=' + password.value);

    if (!isValidated.data)
    {
        errorMessage.value = 'Password not correct.';
        return false;
    }

    errorMessage.value = '';
    joinChannel(protectedChannel.value);
    return true;
}

const checkPermission = async (channel: {id: number, name: string, joined: boolean}) => {
    const hasProtection = await isProtected(channel);
    if (hasProtection) {
        showPasswordDialog.value = true;
        protectedChannel.value = channel;
    }
    else if (hasProtection == false)
        await joinChannel(channel);
    else
        console.log('Error checking protection of channel');
}

const joinChannel = async (channel: {id: number, name: string, joined: boolean}) => {
    socket.emit('addChannelmember', { channelmember_name: playerUsername,
                                    channel_id: channel.id,
                                    is_admin: false}, (channel_id) => {
        if (!channel_id)
            toast.add({ severity: 'error', summary: 'You cannot join this channel', detail: '', life: 3000 });
        else {
            showPasswordDialog.value = false;
            password.value = '';
            channel.joined = true;
            toast.add({ severity: 'success', summary: 'You joined this channel successfully', detail: '', life: 3000 });
        }
    });
}

</script>

<style scoped>

.password-dialog {
    font-family: 'JetBrains Mono';
    font-size: small;
}
.channel {
    font-family: 'JetBrains Mono';
    font-size: small;
}
.join-button {
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
    margin-right: 0;
}
</style>