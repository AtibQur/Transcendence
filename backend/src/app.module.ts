import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module'; // New
import { GoogleModule } from './auth_google/google.module';
import { PongModule } from './pong/pong.module';
import { PlayerModule } from './player/player.module';
import { ChannelModule } from './channel/channel.module';
import { ChannelmemberModule } from './channelmember/channelmember.module';
import { ChatmessageModule } from './chatmessage/chatmessage.module';
import { MatchModule } from './match/match.module';
import { ChatModule } from './chat/chat.module';
import { FriendModule } from './friend/friend.module';
import { BlockedplayerModule } from './blockedplayer/blockedplayer.module';
import { MatchInstanceModule } from './pong/match/match-instance.module';


@Module({
  imports: [
    GoogleModule,
    AuthModule,
    // CrudModule,
	  PongModule,
    PlayerModule,
    ChannelModule,
    ChannelmemberModule,
    ChatmessageModule,
    MatchModule,
    ChatModule,
    FriendModule,
    BlockedplayerModule,
	MatchInstanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}