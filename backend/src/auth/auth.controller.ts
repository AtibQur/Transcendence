import { Body, Controller, Get, Header, Post, Req, Res, Session, UseGuards } from '@nestjs/common';
import { PlayerService } from 'src/player/player.service';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';
import e, { Request, Response, response } from 'express';
import { AuthService } from './auth.service';
import { Verify } from 'crypto';
import { request } from 'http';
import { userInfo } from 'os';
import { ENHANCER_TOKEN_TO_SUBTYPE_MAP } from '@nestjs/core/constants';
import { CreatePlayerDto } from 'src/player/dto/create-player.dto';
import { builtinModules } from 'module';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
        private readonly playerService: PlayerService) {}

    @Get('/42/callback')
    async fortyTwoCallback(
        @Req() request: Request,
        @Res( {passthrough: true} ) response: Response
        ) {

        const intra = await this.authService.validateUser(request.query.code);
        const userData = await this.authService.getIntraDatabyToken(intra.access_token);
        const createPlayerDto = new CreatePlayerDto();
        createPlayerDto.username = userData.login;
        const playerId = await this.playerService.createPlayer(createPlayerDto);

        const payload = {
            id: playerId,
            username: userData.login,
            sub: userData.id,
        };

        if (await this.playerService.findOne2FA(playerId) == false) {
            const jwt = await this.authService.generateToken(payload);

            response.cookie('auth', jwt)
            response.status(200).redirect('http://localhost:8080');
        } else {
            response.cookie('payload', JSON.stringify(payload));
            response.redirect('http://localhost:8080/redirect2faverify')
        }
    }

    @Get('/logout')
    async fortyTwoLogout(@Req() request: Request, @Res({passthrough: true}) response: Response) {
        response.clearCookie('auth');
        response.redirect('http://localhost:8080/');
    }
    
    // @UseGuards(AuthenticatedGuard)
    @Post('2fa')
    async twoFactorAuth(@Body() body: any, @Req() req: any, @Res() res: any) {
        var secret = speakeasy.generateSecret({ 
            name: 'trance',
        });
        const payload = JSON.parse(body.payload);
        await this.playerService.updateTfaCode(payload.id, secret.base32);
        qrCode.toDataURL(secret.otpauth_url, (err, data) => {
            if (err)
            return res.send('Error occured');
            res.send(data);
        });
    }
    
    // @UseGuards(AuthenticatedGuard)
    @Post('2fa/verify')
    async create(@Body() body: any, @Res({passthrough: true}) response: Response) {
        const payload = JSON.parse(body.payload);
        const code = await this.playerService.findOne2FACode(payload.id);
        const verified = speakeasy.totp.verify({
            secret: code,// tfa secret from db,
            encoding: 'base32',
            token: body.submittedValue,
        });
        console.log(code)
        if (verified) {
            const jwt = await this.authService.generateToken(payload);
    
            response.cookie('auth', jwt)
            response.clearCookie('payload')
            response.status(200).redirect('http://localhost:8080');
        }
        return verified;
    }

}