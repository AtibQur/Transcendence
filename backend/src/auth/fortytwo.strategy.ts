// import { Strategy } from 'passport-42';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';
// import * as dotenv from 'dotenv';
// import * as path from 'path';
// import { CreatePlayerDto } from 'src/player/dto/create-player.dto';
// import { PlayerService } from 'src/player/player.service';
// import { AuthService } from './auth.service';

// const envPath = path.resolve(__dirname, '../../.env');
// dotenv.config({ path: envPath });

// @Injectable()
// export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
//     constructor(
//         private readonly playerService: PlayerService,
//         private readonly authService: AuthService,
//         ) {
//         super({
//             clientID : process.env.FT_CLIENTID,
//             clientSecret : process.env.FT_CLIENTSCT,
//             callbackURL : process.env.FT_REDIRECTURI,
//             scope: 'public',
//         });  
//     }

//     async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
//         const { username } = profile;
//         const user = { username, accessToken, refreshToken };

//         if (!user) {
//             return null;
//         }
//         const createPlayerDto = new CreatePlayerDto();
//         createPlayerDto.username = user.username;
//         const playerId = await this.playerService.createPlayer(createPlayerDto);
//         const player = {
//             id: playerId,
//             intra_username: user.username,
//             status: 'online',
//             accessToken: user.accessToken,
//             refreshToken: user.refreshToken,
//         }
//         done(null, player);
//       }
// }
