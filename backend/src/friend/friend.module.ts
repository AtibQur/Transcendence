import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { PlayerModule } from 'src/player/player.module';
import { PlayerService } from 'src/player/player.service';
import { BlockedplayerService } from 'src/blockedplayer/blockedplayer.service';
import { BlockedplayerModule } from 'src/blockedplayer/blockedplayer.module';

@Module({
  imports: [PlayerModule, BlockedplayerModule],
  controllers: [FriendController],
  providers: [FriendService, PlayerService, BlockedplayerService]
})
export class FriendModule {}
