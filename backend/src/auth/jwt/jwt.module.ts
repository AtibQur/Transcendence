import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './jwt.config';
import { AuthService } from '../auth.service';

@Module({
    imports: [
        JwtModule.register({
            secret: 'groootegeheim',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    exports: [JwtModule],
    providers: [AuthService],
})
export class JwtConfigModule {}