import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleController } from './google.controller';
import { GoogleStrategy } from './google.strategy';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: '42' }),
    ],
    controllers: [GoogleController],
    providers: [GoogleStrategy],
    exports: [PassportModule],
})

export class GoogleModule {}
