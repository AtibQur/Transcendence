import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { PlayerService } from 'src/player/player.service';
import { ChannelmemberService } from 'src/channelmember/channelmember.service';
import { ChannelService } from 'src/channel/channel.service';
import { ChatmessageService } from 'src/chatmessage/chatmessage.service';
import { BlockedplayerService } from 'src/blockedplayer/blockedplayer.service';
import { FriendService } from 'src/friend/friend.service';

@Module({
  providers: [
    ChatGateway,
    ChannelmemberService,
    ChannelService,
    ChatmessageService,
    BlockedplayerService,
    PlayerService,
    FriendService
    ]
  })
export class ChatModule {}
