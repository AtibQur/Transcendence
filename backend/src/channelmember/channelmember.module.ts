import { Module } from '@nestjs/common';
import { ChannelmemberService } from './channelmember.service';
import { ChannelmemberController } from './channelmember.controller';
import { FriendService } from 'src/friend/friend.service';
import { PlayerService } from 'src/player/player.service';
import { PlayerModule } from 'src/player/player.module';
import { FriendModule } from 'src/friend/friend.module';
import { BlockedplayerModule } from 'src/blockedplayer/blockedplayer.module';
import { BlockedplayerService } from 'src/blockedplayer/blockedplayer.service';

@Module({
    imports: [
        PlayerModule,
        FriendModule,
        BlockedplayerModule
    ],
    controllers: [ChannelmemberController],
    providers: [
        ChannelmemberService,
        FriendService,
        PlayerService,
        BlockedplayerService
    ]
})
export class ChannelmemberModule {}
