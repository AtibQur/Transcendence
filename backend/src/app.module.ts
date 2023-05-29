import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrudModule } from './crud/crud.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ServeStaticModule} from '@nestjs/serve-static'; // New
import { join } from 'path'; // New
import { AuthModule } from './auth/auth.module'; // New
import { GoogleModule } from './auth_google/google.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({ // New
      rootPath: join(__dirname, '../../', 'frontend/dist'), // New
    }), // New
    GoogleModule, // New
    AuthModule,
    CrudModule,
    LeaderboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}