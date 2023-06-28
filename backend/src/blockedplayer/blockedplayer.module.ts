import { Module } from '@nestjs/common';
import { BlockedplayerService } from './blockedplayer.service';
import { BlockedplayerController } from './blockedplayer.controller';
import { PlayerModule } from 'src/player/player.module';
import { PlayerService } from 'src/player/player.service';

@Module({
  imports: [PlayerModule],
  controllers: [BlockedplayerController],
  providers: [BlockedplayerService, PlayerService]
})
export class BlockedplayerModule {}
