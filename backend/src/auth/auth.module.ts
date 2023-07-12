import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserController } from './auth.endpoint.controller';
import { Player } from 'src/player/entities/player.entity';
import { PlayerService } from 'src/player/player.service';

@Module({
	imports: [
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '604800s' },
		}),
		PassportModule.register({ defaultStrategy: 'jwt' }),
	],
	controllers: [AuthController, UserController],
	providers: [AuthService, JwtStrategy, PlayerService],
})
export class AuthModule {}