import { Controller, Get, Header, Req, Res, Session, UseGuards } from '@nestjs/common';
import { PlayerService } from 'src/player/player.service';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';
import e, { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('user')
export class UserController {
    constructor(private readonly authService: AuthService) {}
    @Get('username')
    async GetAuthStatus(@Req() request: Request) {
        const token = request.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        return payload.username;
    }

    @Get('id')
    async GetAuthId(@Req() req: any) {
        const token = req.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        return payload.id;
    }

    @Get('intraId')
    async GetAuthUser(@Req() req: any) {
        const token = req.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        return payload.sub;
    }
}