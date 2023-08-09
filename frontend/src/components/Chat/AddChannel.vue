<template>
    <div class="card flex justify-content-center p-fluid">
        <button class="custom-button-1" @click="isVisible = true">Create New Channel</button>
        <Dialog v-model:visible="isVisible" modal header="New Channel" :style="{ width: '50vw' }">
            <form @submit.prevent="onSubmit">
                <p class="p-field">
                    <label for="channelName">Channel Name  </label>
                    <InputText id="channelName" v-model="newChannelName" />
                </p>
                <div class="flex flex-wrap gap-3">
                    <div v-for="option in securityOptions" :key="option.type" class="flex align-items-center">
                        <RadioButton @click="selectedSecurityType = option.type" v-model="securityType" :inputId="option.type.toString()" :value="option.name" />
                        <label :for="option.type.toString" class="ml-2">{{ option.name }}</label>
                    </div>
                </div>
                <p class="p-field">
                    <label for="password">Password  </label>
                    <Password id="password" v-if="selectedSecurityType === SecurityLevel.PUBLIC" disabled placeholder="Disabled" />
                    <Password id="password" v-else v-model="password" toggleMask :feedback="false" />
                </p>
                <small id="text-error" class="p-error">{{ errorMessage }}</small>
                <button class="custom-button-1" type="submit" style="background-color: var(--blue-lightest); margin-top: 20px;">Create</button>
            </form>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { socket } from '../../socket';
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import RadioButton from 'primevue/radiobutton'
import { useToast } from 'primevue/usetoast';

enum SecurityLevel {
    PUBLIC,
    PRIVATE,
    PROTECTED
}

const toast = useToast();
const isVisible = ref<boolean>(false);
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

//VALIDATE FIELDS
function validateFields() {
    if (!newChannelName.value)
    {
        errorMessage.value = 'Channel name required.';
        return false;
    }
    if (newChannelName.value.length > 30)
    {
        errorMessage.value = 'Channel name too long.';
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

//RESET FORM
function resetForm() {
    newChannelName.value = '';
    securityType.value = -1;
    selectedSecurityType.value = -1;
    password.value = '';
    isVisible.value = false;
    errorMessage.value = '';
}

//SUMBIT FORM
const onSubmit = () => {
    if (validateFields())
    {
        if (selectedSecurityType.value == SecurityLevel.PRIVATE)
            isPrivate.value = true;
        
        socket.emit('addChannel', {name: newChannelName.value, is_private: isPrivate.value, owner_id: playerId, password: password.value}, (channel_id: number) => {
            resetForm();
            toast.add({ severity: 'info', summary: 'New Channel Created Successfully!', detail: '', life: 3000 });
        });

        if (!newChannelName.value)
            toast.add({ severity: 'error', summary: 'Error Channel not Created', detail: '', life: 3000 });
    }
};
</script>