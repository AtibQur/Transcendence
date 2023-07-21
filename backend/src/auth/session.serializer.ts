// import { PassportSerializer } from '@nestjs/passport';
// import { Player } from 'src/player/entities/player.entity';
// import { PlayerService } from 'src/player/player.service';
// import { Injectable } from '@nestjs/common';
// import { CreatePlayerDto } from 'src/player/dto/create-player.dto';

// @Injectable()
// export class SessionSerializer extends PassportSerializer {
//     constructor(private readonly playerService: PlayerService) {
//         super();
//       }
    
//     async serializeUser(player: Player, done: (err: Error, player: Player) => void) {
//         console.log('serializeUser');
//         done(null, player);
//     }

//     async deserializeUser(player: Player, done: (err, playerDB: Player) => void) {
//         console.log('deserializeUser');
//         const playerDB = await this.playerService.findOnePlayerByUsername(player.id) as Player;
//         return playerDB ? done(null, playerDB) : done(null, null)
//     }
// }3