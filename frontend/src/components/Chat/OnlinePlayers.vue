<template>
    <div class="users-container">
        <h4>Online Users</h4>
        <ul id="userList">
            <li v-for="(player, index) in onlinePlayers" :key="index">
                {{ player.username === name ? player.username + ' (You)' : player.username }}
            </li>
        </ul>
    </div>
</template>