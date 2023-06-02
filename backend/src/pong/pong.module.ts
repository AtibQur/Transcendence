import { Module } from '@nestjs/common';
import { PongController } from './pog.controller';
import { PongService } from './pong.service';
import { PongGateway } from "./gateway/pong.gateway";

@Module({
	providers: [
		PongGateway,
	], 
})
export class PongModule {}