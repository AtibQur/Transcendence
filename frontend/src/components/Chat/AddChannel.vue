<template>
    <div class="card flex justify-content-center p-fluid">
        <button @click="visible = true" >Create New Channel</button>
        <Dialog v-model:visible="visible" modal header="New Channel" :style="{ width: '50vw' }">
            <form @submit.prevent="onSubmit">
                <div class="p-field">
                    <label for="channelName">Channel Name</label>
                    <InputText id="channelName" v-model="newChannelName" />
                </div>
                <div class="flex flex-wrap gap-3">
                    <div v-for="option in securityOptions" :key="option.type" class="flex align-items-center">
                        <RadioButton @click="log()" v-model="securityType" :inputId="option.type" :value="option.name" />
                        <label :for="option.type" class="ml-2">{{ option.name }}</label>
                    </div>
                </div>
                <div class="p-field">
                    <Password v-if="selectedSecurityType === SecurityLevel.PUBLIC" disabled placeholder="Disabled" />
                    <Password v-else v-model="password" toggleMask :feedback="false" />
                </div>
                <!-- <small id="text-error" class="p-error">{{ errorMessage || '&nbsp;' }}</small> -->
                <button type="submit">Create</button>
            </form>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import { ref, reactive } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import PrimeButton from 'primevue/button'
import RadioButton from 'primevue/radiobutton'
import { useToast } from 'primevue/usetoast';

enum SecurityLevel {
    PUBLIC = '0',
    PRIVATE = '1',
    PROTECTED = '2'
}

const toast = useToast();
const visible = ref(false);
const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
const newChannelName = ref('');

const securityType = ref('');
const selectedSecurityType = ref('');
const securityOptions = ref([
    { name: 'Public', type: SecurityLevel.PUBLIC },
    { name: 'Private', type: SecurityLevel.PRIVATE },
    { name: 'Protected', type: SecurityLevel.PROTECTED }
]);
const password = ref(null);


const createChannel = () => {
    socket.emit('addChannel', {name: newChannelName.value, is_private: false, owner_id: playerId}, () => {
        newChannelName.value = '';
    });
}

function validateField(value) {
    if (!value) {
        return 'Value is required.';
    }

    return true;
}

function log() {
    console.log('clicked: ', securityType.value);
}

const onSubmit = () => {
    console.log(selectedSecurityType.value);
    toast.add({ severity: 'info', summary: 'Form Submitted', detail: '', life: 3000 });
    // console.log('values: ', values);
    // console.log('values.value: ', values.value);
    // if (values.value && values.value.length > 0) {
    // }
    visible.value = false;
};

</script>

<style>

</style>