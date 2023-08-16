import { Controller, Get, Header, Post, Req, Res, Session, Patch, UseGuards, Body } from '@nestjs/common';
import { PlayerService } from 'src/player/player.service';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';
import { AuthGuard } from './local.authguard';
import e, { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UpdatePlayerDto } from 'src/player/dto/update-player.dto';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private readonly authService: AuthService,
        private readonly playerService: PlayerService) {}

    @Get('intraname')
    async GetAuthIntraname(@Req() request: Request) {
        const token = request.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        return payload.intraname;
    }

    @Get('username')
    async GetAuthUsername(@Req() request: Request) {
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

    @Patch('enable2fa')
    async Enable2FA(@Req() req: any, @Body() updatePlayerDto: UpdatePlayerDto) {
        const token = req.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        await this.playerService.update2FA(payload.id, updatePlayerDto.two_factor_enabled);
        return 'enabled';
    }
    
    @Patch('disable2fa')
    async Disable2FA(@Req() req: any, @Body() updatePlayerDto: UpdatePlayerDto) {
        const token = req.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        await this.playerService.update2FA(payload.id, updatePlayerDto.two_factor_enabled);
        await this.playerService.updateTfaCode(payload.id, null);
        return 'disabled';
    }

}