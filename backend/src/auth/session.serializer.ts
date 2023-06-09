
import { PassportSerializer } from '@nestjs/passport';
import { Player } from 'src/player/entities/player.entity';
import { PlayerService } from 'src/player/player.service';

export class SessionSerializer extends PassportSerializer {
    constructor(private readonly playerService: PlayerService) {
        super();
      }
    
    serializeUser(player: Player, done: (err: Error, player: Player) => void) {
        console.log('serializeUser');
        done(null, player);
    }
    async deserializeUser(player: Player, done: (err, playerDB: string) => void) {
        console.log('deserializeUser');
        const playerDB = await this.playerService.findOneUsername(player.id);
        return playerDB ? done(null, playerDB) : done(null, null)
    }
}