import { Controller, Get, Header, Req, Res, Session, UseGuards } from '@nestjs/common';
import { PlayerService } from 'src/player/player.service';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';
import e, { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Verify } from 'crypto';
import { request } from 'http';
import { userInfo } from 'os';
import { ENHANCER_TOKEN_TO_SUBTYPE_MAP } from '@nestjs/core/constants';
import { CreatePlayerDto } from 'src/player/dto/create-player.dto';


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

        const jwt = await this.authService.generateToken(userData.id, userData.login, playerId);
        response.cookie('auth', jwt)
        response.status(200).redirect('http://localhost:8080/home');
    }

    @Get('/logout')
    async fortyTwoLogout(@Req() request: Request, @Res({passthrough: true}) response: Response) {
        response.clearCookie('auth');
        response.redirect('http://localhost:8080/');
    }
    
    // @UseGuards(AuthenticatedGuard)
    @Get('2fa')
    async twoFactorAuth(@Req() req: any, @Res() res: any) {
        var secret = speakeasy.generateSecret({ 
            name: 'trance',
        });
        // console.log(req.session.passport.user);
        qrCode.toDataURL(secret.otpauth_url, (err, data) => {
            if (err)
            return res.send('Error occured');
            res.send(data);
        });
    }
    
    // @UseGuards(AuthenticatedGuard)
    @Get('2fa/verify')
    async twoFactorAuthVerify(@Req() req: any, @Res() res: any, @Session() session: Record<string, any>) {
        const token = req.query.token;
        const secret = req.query.secret;
        const verified = speakeasy.totp.verify({
            secret: req.session.passport.user.tfasecret,
            encoding: 'base32',
            token: token,
        });
        if (verified) {
            console.log('2fa verified');
            res.send('2fa verified, you will be redirected to the login page');
        } else {
            console.log('incorrect code');
            res.send('incorrect code');
        }
    }

}