<template>
    <div class="channel-container">
                    <h4>Available Channels</h4>
                    <ul id="channelList">
                        <button v-for="(channel, index) in channels" :key="index" @click="changeChannel(channel.name)">
                            {{ channel.name }}
                        </button>
                    </ul>
                </div>
</template>