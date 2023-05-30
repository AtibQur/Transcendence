import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './fortytwo.strategy';
import { AuthController } from './auth.controller';

@Module({
    imports: [
      PassportModule.register({ defaultStrategy: '42' , session: true}),
    ],
    providers: [FortyTwoStrategy],
    controllers: [AuthController],
    exports: [PassportModule],
  })
  
  export class AuthModule {}
  