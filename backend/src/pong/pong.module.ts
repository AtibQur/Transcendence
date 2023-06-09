import { Module } from '@nestjs/common';
import { Server } from 'socket.io';
import { PongController } from './pong.controller';
import { PongService } from './pong.service';
import { PongGateway } from "./gateway/pong.gateway";


@Module({
	controllers: [PongController],
	providers: [
		PongGateway,
		PongService,
		Server,
	],
})
export class PongModule {}