import { Module } from '@nestjs/common';
import { ChannelmemberService } from './channelmember.service';
import { ChannelmemberController } from './channelmember.controller';
import { FriendService } from 'src/friend/friend.service';
import { PlayerService } from 'src/player/player.service';
import { PlayerModule } from 'src/player/player.module';
import { FriendModule } from 'src/friend/friend.module';

@Module({
    imports: [
        PlayerModule,
        FriendModule
    ],
    controllers: [ChannelmemberController],
    providers: [
        ChannelmemberService,
        FriendService,
        PlayerService
    ]
})
export class ChannelmemberModule {}
