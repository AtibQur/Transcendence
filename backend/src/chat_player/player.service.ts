import { Injectable } from '@nestjs/common';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayerService {
    players: Player[] = []

    create(userName: string) {
        const player = {
            username: userName,
        };
        if (this.players.some(player => player.username === userName)) {
            console.log('Player already exists');
        } else {
            this.players.push(player);
            console.log('added player: ', player.username);
        }
        console.log(this.players);
        return player;
    }

    findAll() {
        return this.players; //here should come a query to select all from message table
    }

    // delete(clientId: string) {
    //     const index = this.players.findIndex(player => player.id === clientId);

    //     if (index !== -1) {
    //         this.players.splice(index, 1);
    //     }
    // }

    // getPlayerName(clientId: string) {
    //     const index = this.players.findIndex(player => player.id === clientId);

    //     if (index !== -1) {
    //         return this.players[index].username;
    //     }
    //     return ('Error: player not found');
    // }
}
