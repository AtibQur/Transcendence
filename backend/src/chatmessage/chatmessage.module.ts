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

@Module({
  imports: [
    BlockedplayerModule,
    PlayerModule,
    ChannelModule,
    ChannelmemberModule
  ],
  controllers: [
    ChatmessageController
  ],
  providers: [
    ChatmessageService,
    BlockedplayerService,
    PlayerService,
    ChannelService,
    ChannelmemberService
  ]
})
export class ChatmessageModule {}
