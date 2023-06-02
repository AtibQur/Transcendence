import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { PlayerService } from 'src/player/player.service';
import { ChannelmemberService } from 'src/channelmember/channelmember.service';

@Module({
	providers: [ChatGateway, PlayerService, ChannelmemberService]
  })
export class ChatModule {}
