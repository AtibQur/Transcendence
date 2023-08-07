import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { PlayerModule } from 'src/player/player.module';
import { PlayerService } from 'src/player/player.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [PlayerModule, AuthModule],
  controllers: [MatchController],
  providers: [MatchService, PlayerService, AuthService]
})
export class MatchModule {}
