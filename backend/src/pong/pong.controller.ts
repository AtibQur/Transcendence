import { Controller, Get, Req } from '@nestjs/common';
import { Server } from 'socket.io';
import { Request } from 'express';

@Controller()
export class PongController {
	@Get('socket.io')
	findAll(@Req() request: Request): void {
	}
}