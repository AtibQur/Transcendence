import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageService } from 'src/chat_message/message.service';
import { PlayerService } from 'src/chat_player/player.service';
import { ChannelService } from 'src/chat_channel/channel.service';

@Module({
	providers: [ChatGateway, MessageService, PlayerService, ChannelService]
  })
export class ChatModule {}
