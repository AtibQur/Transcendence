import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { PlayerModule } from 'src/player/player.module';
import { PlayerService } from 'src/player/player.service';

@Module({
  imports: [PlayerModule],
  controllers: [FriendController],
  providers: [FriendService, PlayerService]
})
export class FriendModule {}
