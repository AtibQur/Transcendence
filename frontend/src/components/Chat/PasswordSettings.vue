<template>
    <div v-if="!isProtected">
        <button class="custom-button-1" @click="showDialog(PasswordAction.ADD)">Add Password</button>
    </div>
    <div v-else>
        <button class="custom-button-1" @click="showDialog(PasswordAction.CHANGE)">Change Password</button>
        <button class="custom-button-1" @click="openConfirmDialog()">Remove Password</button>
    </div>
    <div class="card flex justify-content-center p-fluid">
        <Dialog v-model:visible="isVisible" modal header="New Password" :style="{ width: '50vw' }">
            <form @submit.prevent="setPassword()">
                <div class="p-field">
                    <label for="password" >New Password </label>
                    <Password id="password" inputId="add" v-model="password" toggleMask :feedback="false" />
                </div>
                <small id="text-error" class="p-error">{{ errorMessage }}</small>
                <button type="submit">Submit</button>
            </form>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import {ref, onBeforeMount, watch } from 'vue'
import axiosInstance from '../../axiosConfig';
import Password from 'primevue/password'
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";

enum PasswordAction {
    ADD,
    CHANGE
}

const props = defineProps({
    channelId: {
        type: Number,
        required: true
    }
});

const toast = useToast();
const confirm = useConfirm();
const playerId = sessionStorage.getItem('playerId') || '0';
const selectedAction = ref<number>(-1);
const isProtected = ref<boolean>(false);
const isVisible = ref<boolean>(false);
const currentChannelId = ref<number>(props.channelId);
const password = ref<string>('');
const errorMessage = ref<string>('');

onBeforeMount(async () => {

    await isPasswordSet();

    //TRACK WHETHER CHANNEL_ID CHANGES
    watch(() => props.channelId, async (newChannelId: number) => {
        currentChannelId.value = newChannelId;
        await isPasswordSet();
    });
})

// CHECK WHETHER CHANNEL IS PROTECTED
const isPasswordSet = async () => {
    const response = await axiosInstance.get('channel/protect/' + currentChannelId.value.toString());
    if (response.data != null) {
        isProtected.value = response.data;
    } else {
        console.log("error checking if channel is protected");
    }
}

//CONFIRM DIALOG BUTTON
const openConfirmDialog = () => {
    confirm.require({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        accept: () => {
            removePassword();
        }
    });
};

//VALIDATE FIELDS
function validateFields() {
    if (!password.value)
    {
        errorMessage.value = 'Password required.';
        return false;
    }
    errorMessage.value = '';
    return true;
}

//ACTIVATE SET PASSWORD DIALOG
const showDialog = (action: PasswordAction) => {
    isVisible.value = true;
    selectedAction.value = action;
}

//RESET FORM
function resetForm() {
    password.value = '';
    isVisible.value = false;
    errorMessage.value = '';
    selectedAction.value = -1;
}

//SUBMIT PASSWORD
const setPassword = async () => {
    if (validateFields())
    {
        if (selectedAction.value == PasswordAction.ADD) {
            const response = await axiosInstance.post('channel/protect/add/' + currentChannelId.value.toString() + `/${playerId}`, {password: password.value});

            if (response.data)
            {
                toast.add({ severity: 'info', summary: 'Added Password successfully', detail: '', life: 3000 });
                resetForm();
                isProtected.value = true;
            }
            else
                toast.add({ severity: 'error', summary: 'Error Password not added', detail: '', life: 3000 });
                
            }
        else {
            const response = await axiosInstance.patch('channel/protect/change/' + currentChannelId.value.toString() + `/${playerId}`, {password: password.value});
            
            if (response.data)
            {
                toast.add({ severity: 'info', summary: 'Changed Password successfully', detail: '', life: 3000 });
                resetForm();
            }
            else
                toast.add({ severity: 'error', summary: 'Error Password not changed', detail: '', life: 3000 });
            }
        }
    }
    
//REMOVE PASSWORD
const removePassword = async () => {
    const response = await axiosInstance.patch('channel/protect/remove/' + currentChannelId.value.toString() + `/${playerId}`, {password: null});
    if (response.data)
    {
        toast.add({ severity: 'info', summary: 'Removed Password successfully', detail: '', life: 3000 });
        isProtected.value = false;
    }
    else
        toast.add({ severity: 'error', summary: 'Error Password not removed', detail: '', life: 3000 });

}

</script>