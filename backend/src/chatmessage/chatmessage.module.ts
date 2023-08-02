import { Module } from '@nestjs/common';
import { ChatmessageService } from './chatmessage.service';
import { ChatmessageController } from './chatmessage.controller';
import { BlockedplayerService } from 'src/blockedplayer/blockedplayer.service';
import { BlockedplayerModule } from 'src/blockedplayer/blockedplayer.module';
import { PlayerModule } from 'src/player/player.module';
import { PlayerService } from 'src/player/player.service';
import { ChannelModule } from 'src/channel/channel.module';
import { ChannelService } from 'src/channel/channel.service';
import { ChannelmemberService } from 'src/channelmember/channelmember.service';
import { ChannelmemberModule } from 'src/channelmember/channelmember.module';
import { FriendModule } from 'src/friend/friend.module';
import { FriendService } from 'src/friend/friend.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    BlockedplayerModule,
    PlayerModule,
    ChannelModule,
    ChannelmemberModule,
    FriendModule,
    AuthModule
  ],
  controllers: [
    ChatmessageController
  ],
  providers: [
    ChatmessageService,
    BlockedplayerService,
    PlayerService,
    ChannelService,
    ChannelmemberService,
    FriendService,
    AuthService
  ]
})
export class ChatmessageModule {}
