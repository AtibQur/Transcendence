<template>
    <div class="card flex justify-content-center p-fluid">
        <button @click="visible = true" >Create New Channel</button>
        <Dialog v-model:visible="visible" modal header="New Channel" :style="{ width: '50vw' }">
            <form @submit.prevent="createChannel">
                <div class="p-field">
                    <label for="channelName">Channel Name</label>
                    <InputText id="channelName" v-model="newChannelName" />
                </div>
                <div class="p-field">
                    <SelectButton v-model="securityType" :options="securityOptions" optionLabel="name" aria-labelledby="basic" />
                </div>
                <div class="p-field">
                    <Password v-if="securityType == securityOptions.PUBLIC" disabled placeholder="Disabled" />
                    <Password v-else v-model="password" toggleMask :feedback="false" />
                </div>
                <!-- <div v-else class="p-field">
                    <Password v-model="password" toggleMask :feedback="false" />
                </div> -->
                <button type="submit">Create</button>
            </form>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import { onBeforeMount, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import PrimeButton from 'primevue/button'
import SelectButton from 'primevue/selectbutton'

enum SecurityLevel {
    PUBLIC,
    PRIVATE,
    PROTECTED
}

const visible = ref(false);
const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
const newChannelName = ref('');
const securityType = ref(SecurityLevel.PUBLIC);
const currentSecurityType = ref(securityType);
const securityOptions = ref([
    { name: 'Public', value: SecurityLevel.PUBLIC },
    { name: 'Private', value: SecurityLevel.PRIVATE },
    { name: 'Protected', value: SecurityLevel.PROTECTED },
])
const password = ref(null);

const createChannel = () => {
    socket.emit('addChannel', {name: newChannelName.value, is_private: false, owner_id: playerId}, () => {
        newChannelName.value = '';
    });
}

onBeforeMount(async () => {

    //TRACK WHETHER CHANNEL_ID CHANGES
    watch(() => securityType, async (newSecurityType) => {
        currentSecurityType.value = newSecurityType;
        console.log("change");
});
})

</script>

<style>

</style>