import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ChannelmemberService } from 'src/channelmember/channelmember.service';
import { ChannelmemberModule } from 'src/channelmember/channelmember.module';

@Module({
  imports: [ChannelmemberModule], // Import the module containing the ChannelmemberService
  controllers: [ChannelController],
  providers: [ChannelService, ChannelmemberService]
})
export class ChannelModule {}
