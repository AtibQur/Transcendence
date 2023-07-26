import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
import { AuthService } from './auth.service';

  @Injectable()
  export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService,
		private readonly authService: AuthService) {}
  
	async canActivate(context: ExecutionContext): Promise<boolean> {
	  const request = context.switchToHttp().getRequest();
	  const token = request.header('Authorization').split(' ')[1];
	  if (!token) {
		throw new UnauthorizedException();
	  }
	  try {
		const payload = await this.authService.validateToken(token);
	  } catch {
		throw new UnauthorizedException();
	  }
	  return true;
	}
}