import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { PlayerModule } from './chat_player/player.module';
// import { ChannelModule } from './chat_channel/channel.module';
import { ServeStaticModule} from '@nestjs/serve-static'; // New
import { join } from 'path'; // New
import { AuthModule } from './auth/auth.module'; // New
import { GoogleModule } from './auth_google/google.module';
import { PlayerModule } from './player/player.module';
import { ChannelModule } from './channel/channel.module';
import { ChannelmemberModule } from './channelmember/channelmember.module';
import { ChatmessageModule } from './chatmessage/chatmessage.module';


@Module({
  imports: [
    // ServeStaticModule.forRoot({ // New
    //   rootPath: join(__dirname, '../../', 'frontend/dist'), // New
    // }), // New
    GoogleModule, // New
    AuthModule,
    PlayerModule,
    ChannelModule,
    ChannelmemberModule,
    ChatmessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}