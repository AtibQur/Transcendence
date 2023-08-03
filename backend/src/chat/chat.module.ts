import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { PlayerService } from 'src/player/player.service';
import { ChannelmemberService } from 'src/channelmember/channelmember.service';
import { ChannelService } from 'src/channel/channel.service';
import { ChatmessageService } from 'src/chatmessage/chatmessage.service';
import { BlockedplayerService } from 'src/blockedplayer/blockedplayer.service';
import { FriendService } from 'src/friend/friend.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [AuthModule],
  providers: [
    ChatGateway,
    ChannelmemberService,
    ChannelService,
    ChatmessageService,
    BlockedplayerService,
    PlayerService,
    FriendService,
    AuthService
    ]
  })
export class ChatModule {}
