import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ServeStaticModule} from '@nestjs/serve-static'; // New
// import { join } from 'path'; // New
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';

@Module({
//   imports: [
//     ServeStaticModule.forRoot({ // New
//       rootPath: join(__dirname, '../..', '/frontend/dist'), // New
//     }), // New
//   ],
 imports: [MessageModule, UserModule, ChatModule],
 controllers: [AppController],
 providers: [AppService],
})
export class AppModule {}