import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrudModule } from './crud/crud.module';
import { ServeStaticModule} from '@nestjs/serve-static'; // New
import { join } from 'path'; // New
import { AuthModule } from './auth/auth.module'; // New
import { GoogleModule } from './auth_google/google.module';
import { PlayerModule } from './player/player.module';
import { ChannelModule } from './channel/channel.module';
import { ChannelmemberModule } from './channelmember/channelmember.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({ // New
      rootPath: join(__dirname, '../../', 'frontend/dist'), // New
    }), // New
    GoogleModule, // New
    AuthModule,
    CrudModule,
    PlayerModule,
    ChannelModule,
    ChannelmemberModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}