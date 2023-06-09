import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { PlayerModule } from 'src/player/player.module';
import { PlayerService } from 'src/player/player.service';

@Module({
  imports: [PlayerModule],
  controllers: [MatchController],
  providers: [MatchService, PlayerService]
})
export class MatchModule {}
