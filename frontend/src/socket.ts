import { io } from 'socket.io-client';
import * as dotenv from 'dotenv';

export const socket = io(process.env.VUE_APP_HOST_COMPUTER + ':3000', { 
    auth: {
        id: sessionStorage.getItem('playerId') || '0'
    }
});
