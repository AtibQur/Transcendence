import { Module } from '@nestjs/common';
import { ChannelmemberService } from './channelmember.service';
import { ChannelmemberController } from './channelmember.controller';

@Module({
  controllers: [ChannelmemberController],
  providers: [ChannelmemberService]
})
export class ChannelmemberModule {}
