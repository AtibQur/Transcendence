import { Controller, Get, Req } from '@nestjs/common';
import { Server } from 'socket.io';
import { Request } from 'express';

@Controller()
export class PongController {
	// @Post('notify-user-leave')
	@Get('socket.io')
	findAll(@Req() request: Request): void {
	}
}