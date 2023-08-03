import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [AuthModule],
  controllers: [PlayerController],
  providers: [PlayerService, AuthService]
})
export class PlayerModule {}
