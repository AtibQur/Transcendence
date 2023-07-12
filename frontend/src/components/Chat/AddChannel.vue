<template>
    <div class="card flex justify-content-center p-fluid">
        <button @click="visible = true" >Create New Channel</button>
        <Toast/>
        <Dialog v-model:visible="visible" modal header="New Channel" :style="{ width: '50vw' }">
            <form @submit.prevent="onSubmit">
                <div class="p-field">
                    <label for="channelName">Channel Name</label>
                    <InputText id="channelName" v-model="newChannelName" />
                </div>
                <div class="flex flex-wrap gap-3">
                    <div v-for="option in securityOptions" :key="option.type" class="flex align-items-center">
                        <RadioButton @click="selectedSecurityType = option.type" v-model="securityType" :inputId="option.type.toString()" :value="option.name" />
                        <label :for="option.type" class="ml-2">{{ option.name }}</label>
                    </div>
                </div>
                <div class="p-field">
                    <label for="password">Password</label>
                    <Password id="password" v-if="selectedSecurityType === SecurityLevel.PUBLIC" disabled placeholder="Disabled" />
                    <Password id="password" v-else v-model="password" toggleMask :feedback="false" />
                </div>
                <small id="text-error" class="p-error">{{ errorMessage }}</small>
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
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

enum SecurityLevel {
    PUBLIC,
    PRIVATE,
    PROTECTED
}

const toast = useToast();
const visible = ref<boolean>(false);
const playerId = parseInt(sessionStorage.getItem('playerId') || '0');
const newChannelName = ref<string>('');

const securityType = ref<number>(-1);
const selectedSecurityType = ref<number>(-1);
const securityOptions = ref([
    { name: 'Public', type: SecurityLevel.PUBLIC },
    { name: 'Private', type: SecurityLevel.PRIVATE },
    { name: 'Protected', type: SecurityLevel.PROTECTED }
]);

const password = ref<string>('');
const errorMessage = ref<string>('');
const isPrivate = ref<boolean>(false);


function validateFields() {
    if (!newChannelName.value)
    {
        errorMessage.value = 'Channel name required.';
        return false;
    }
    if (selectedSecurityType.value == -1)
    {
        errorMessage.value = 'Security type required.';
        return false;
    }
    if (selectedSecurityType.value === SecurityLevel.PROTECTED && !password.value)
    {
        errorMessage.value = 'Password required.';
        return false;
    }
    errorMessage.value = '';
    return true;
}

function resetForm() {
    newChannelName.value = '';
    selectedSecurityType.value = '';
    password.value = '';
    visible.value = false;
}

const onSubmit = () => {
    console.log(selectedSecurityType.value);
    if (validateFields())
    {
        if (selectedSecurityType.value == SecurityLevel.PRIVATE)
            isPrivate.value = true;
        try {
            socket.emit('addChannel', {name: newChannelName.value, is_private: isPrivate.value, owner_id: playerId, password: password.value}, () => {
                resetForm();
                toast.add({ severity: 'info', summary: 'New Channel Created', detail: '', life: 3000 });
            });
        } catch (e) {
            toast.add({ severity: 'error', summary: 'Error Channel not Created', detail: '', life: 3000 });
        }
    }
};

</script>

<style>

</style>