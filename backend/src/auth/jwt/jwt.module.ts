import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './jwt.config';

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConfig.secret,
            signOptions: { expiresIn: jwtConfig.expiresIn },
        }),
    ],
    exports: [JwtModule],
})
export class JwtConfigModule {}