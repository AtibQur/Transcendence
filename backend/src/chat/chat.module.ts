import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { PlayerService } from 'src/player/player.service';
import { ChannelmemberService } from 'src/channelmember/channelmember.service';
import { ChannelService } from 'src/channel/channel.service';
import { ChatmessageService } from 'src/chatmessage/chatmessage.service';

@Module({
    providers: [
        ChatGateway,
        PlayerService,
        ChannelmemberService,
        ChannelService,
        ChatmessageService
    ]
  })
export class ChatModule {}
