import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { PlayerModule } from 'src/player/player.module';
import { PlayerService } from 'src/player/player.service';
import { BlockedplayerService } from 'src/blockedplayer/blockedplayer.service';
import { BlockedplayerModule } from 'src/blockedplayer/blockedplayer.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [PlayerModule, BlockedplayerModule, AuthModule],
  controllers: [FriendController],
  providers: [FriendService, PlayerService, BlockedplayerService, AuthService]
})
export class FriendModule {}
