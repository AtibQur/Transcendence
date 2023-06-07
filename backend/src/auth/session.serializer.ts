
import { PassportSerializer } from '@nestjs/passport';
import { Player } from 'src/player/entities/player.entity';
import { PlayerService } from 'src/player/player.service';

export class SessionSerializer extends PassportSerializer {
    constructor(private readonly playerService: PlayerService) {
        super();
      }
    
    serializeUser(player: Player, done: (err: Error, player: Player) => void) {
        done(null, player);
    }
    deserializeUser(player: Player, done: (err: Error, player: Player) => void) {
        // const user = this.playerService.findOneUsername(player.id);
        // done(null, player);
    }
}