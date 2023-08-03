import { Module } from '@nestjs/common';
import { BlockedplayerService } from './blockedplayer.service';
import { BlockedplayerController } from './blockedplayer.controller';
import { PlayerModule } from 'src/player/player.module';
import { PlayerService } from 'src/player/player.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [PlayerModule, AuthModule],
  controllers: [BlockedplayerController],
  providers: [BlockedplayerService, PlayerService, AuthService]
})
export class BlockedplayerModule {}
