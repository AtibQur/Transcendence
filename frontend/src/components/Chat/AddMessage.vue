<template>
    <div class="message-input">
        <!-- <form @submit.prevent="sendMessage"> -->
            <input v-model="content" placeholder='Write a message'/>
            <button type="submit">Send</button>
        <!-- </form> -->
    </div>
</template>