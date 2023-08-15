import { Module } from '@nestjs/common';
import { Server } from 'socket.io';
import { PongController } from './pong.controller';
import { PongService } from './pong.service';
import { PongGateway } from "./gateway/pong.gateway";
import { MatchInstanceModule } from './match/match-instance.module';
import { Match } from './match/match';
import { MatchService } from 'src/match/match.service';
import { PlayerService } from 'src/player/player.service';



@Module({
	imports: [
		MatchInstanceModule,
	],
	controllers: [PongController],
	providers: [
		PongGateway,
		PongService,
		PlayerService,
		MatchService,
		Server,
		Match,
	],
})
export class PongModule {}