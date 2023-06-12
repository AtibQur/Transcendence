import { PassportSerializer } from '@nestjs/passport';
import { Player } from 'src/player/entities/player.entity';
import { PlayerService } from 'src/player/player.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly playerService: PlayerService) {
        super();
      }
    
    serializeUser(player: Player, done: (err: Error, player: Player) => void) {
        console.log('serializeUser');
        player.id = 1;
        done(null, player);
    }

    async deserializeUser(player: Player, done: (err, playerDB: Player) => void) {
        console.log('deserializeUser')
        console.log(player.id);
        const playerDB = await this.playerService.findOnePlayerByUsername(player.id) as Player;
        return playerDB ? done(null, playerDB) : done(null, null)
    }
}