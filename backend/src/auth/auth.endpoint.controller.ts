import { Controller, Get, Header, Post, Req, Res, Session, UseGuards, Body } from '@nestjs/common';
import { PlayerService } from 'src/player/player.service';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';
import { AuthGuard } from './local.authguard';
import e, { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('user')
export class UserController {
    constructor(private readonly authService: AuthService,
        private readonly playerService: PlayerService) {}

    @Get('intraname')
    @UseGuards(AuthGuard)
    async GetAuthIntraname(@Req() request: Request) {
        const token = request.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        return payload.intraname;
    }

    @Get('username')
    @UseGuards(AuthGuard)
    async GetAuthUsername(@Req() request: Request) {
        const token = request.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        return payload.username;
    }

    @Get('id')
    @UseGuards(AuthGuard)
    async GetAuthId(@Req() req: any) {
        const token = req.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        return payload.id;
    }

    @Get('intraId')
    @UseGuards(AuthGuard)
    async GetAuthUser(@Req() req: any) {
        const token = req.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        return payload.sub;
    }

    @Get('enable2fa')
    @UseGuards(AuthGuard)
    async Enable2FA(@Req() req: any) {
        const token = req.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        await this.playerService.update2FA(payload.id, true);
    }
    
    @Get('disable2fa')
    @UseGuards(AuthGuard)
    async Disable2FA(@Req() req: any, @Res() res: Response) {
        const token = req.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        await this.playerService.update2FA(payload.id, false);
        await this.playerService.updateTfaCode(payload.id, null);
    }

}