import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule} from '@nestjs/serve-static'; // New
import { join } from 'path'; // New
import { AuthModule } from './auth/auth.module'; // New

@Module({
  imports: [
    ServeStaticModule.forRoot({ // New
      rootPath: join(__dirname, '../../', 'frontend/dist'), // New
    }), // New
    AuthModule, // New
  ],
 controllers: [AppController],
 providers: [AppService],
})

export class AppModule {}