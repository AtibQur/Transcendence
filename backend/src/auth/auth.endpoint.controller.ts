import { Controller, Get, Header, Post, Req, Res, Session, UseGuards, Body } from '@nestjs/common';
import { PlayerService } from 'src/player/player.service';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';
import e, { Request, Response } from 'express';
import { AuthService } from './auth.service';

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
        return payload.id;
    }

    @Get('intraId')
    async GetAuthUser(@Req() req: any) {
        const token = req.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        return payload.sub;
    }

    @Get('enable2fa')
    async Enable2FA(@Req() req: any) {
        const token = req.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        await this.playerService.update2FA(payload.id, true);
    }
    
    @Get('disable2fa')
    async Disable2FA(@Req() req: any, @Res() res: Response) {
        const token = req.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        await this.playerService.update2FA(payload.id, false);
    }

    @Get('logout')
    async Logout(@Req() req: any, @Res() res: Response) {
        // res.clearCookie('auth');
        // res.redirect('http://localhost/8080');
    }

}