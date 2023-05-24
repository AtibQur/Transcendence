import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ServeStaticModule} from '@nestjs/serve-static'; // New
// import { join } from 'path'; // New
import { MessageModule } from './message/message.module';
import { PlayerModule } from './player/player.module';
import { ChannelModule } from './channel/channel.module';
import { ChatModule } from './chat/chat.module';
import { CrudModule } from './crud/crud.module';

@Module({
//   imports: [
//     ServeStaticModule.forRoot({ // New
//       rootPath: join(__dirname, '../..', '/frontend/dist'), // New
//     }), // New
//   ],
 imports: [MessageModule, PlayerModule, ChannelModule, ChatModule, CrudModule],
 controllers: [AppController],
 providers: [AppService],
})
export class AppModule {}