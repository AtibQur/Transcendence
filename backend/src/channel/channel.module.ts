import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ChannelmemberService } from 'src/channelmember/channelmember.service';
import { ChannelmemberModule } from 'src/channelmember/channelmember.module';
import { FriendModule } from 'src/friend/friend.module';
import { FriendService } from 'src/friend/friend.service';
import { PlayerModule } from 'src/player/player.module';
import { PlayerService } from 'src/player/player.service';
import { BlockedplayerModule } from 'src/blockedplayer/blockedplayer.module';
import { BlockedplayerService } from 'src/blockedplayer/blockedplayer.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    ChannelmemberModule,
    PlayerModule,
    FriendModule,
    BlockedplayerModule,
    AuthModule  
  ],
  controllers: [ChannelController],
  providers: [
    ChannelService,
    PlayerService,
    ChannelmemberService,
    FriendService,
    BlockedplayerService,
    AuthService
  ]
})
export class ChannelModule {}
