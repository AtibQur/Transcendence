import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
	} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService,
		private readonly authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		console.log("canActivate")
		const request = context.switchToHttp().getRequest();
		if (!request.header('Authorization')) {
			console.log("UNAUTHORIZED")
			throw new UnauthorizedException();
		}
		const token = request.header('Authorization').split(' ')[1];
		if (!token) {
			console.log("UNAUTHORIZED")
			throw new UnauthorizedException();
		}
		try {
			const payload = await this.authService.validateToken(token);
			console.log("AUTHORIZED")
		} catch {
			throw new UnauthorizedException();
		}
		return true;
	}
}