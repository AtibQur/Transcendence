import { Controller, Get, Header, Req, Res, Session, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local.authguard';
import { AuthenticatedGuard } from './local.authguard';
import { PlayerService } from 'src/player/player.service';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';
import e, { Request, Response } from 'express';
import { AuthService } from './auth.service';

const playerService = new PlayerService();

@Controller('user')
export class UserController {
    constructor(private readonly authService: AuthService,
        private readonly playerService: PlayerService) {}
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
        // const id = await this.playerService.findIdByUsername(payload.username);
        // console.log(id);
        // return id;
        return payload.playerId;
    }

    @Get('intraId')
    async GetAuthUser(@Req() req: any) {
        const token = req.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        return payload.sub;
    }
}