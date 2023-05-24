import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageService } from 'src/message/message.service';
import { PlayerService } from 'src/player/player.service';
import { ChannelService } from 'src/channel/channel.service';

@Module({
	providers: [ChatGateway, MessageService, PlayerService, ChannelService]
  })
export class ChatModule {}
