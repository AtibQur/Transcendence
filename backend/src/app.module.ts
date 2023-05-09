import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule} from '@nestjs/serve-static'; // New
import { join } from 'path'; // New
import { FortyTwoStrategy } from './auth/fortytwo.strategy';
import { AuthController } from './auth/auth.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: '42' }),
  ],
  providers: [FortyTwoStrategy],
  controllers: [AppController],
})

export class AuthModule {}

@Module({
  imports: [
    ServeStaticModule.forRoot({ // New
      rootPath: join(__dirname, '../..', '/frontend/dist'), // New
    }), // New
  ],
 controllers: [AppController],
 providers: [AppService],
})

export class AppModule {}