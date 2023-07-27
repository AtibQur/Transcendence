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

@Module({
  imports: [
    ChannelmemberModule,
    PlayerModule,
    FriendModule,
    BlockedplayerModule
  ],
  controllers: [ChannelController],
  providers: [
    ChannelService,
    PlayerService,
    ChannelmemberService,
    FriendService,
    BlockedplayerService
  ]
})
export class ChannelModule {}
