import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PlayerService } from 'src/player/player.service';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

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
        
        // check database whether user with that intraname exists
        var playerUsername = await this.playerService.findUsernameByIntra(userData.login);

        var playerId: number;
        if (!playerUsername) { // if player does not exist, create it
            playerId = await this.playerService.createPlayer({username: userData.login});
            playerUsername = userData.login;
        }
        else { // if player already exists, set playerid accordingly
            playerId = await this.playerService.findIdByIntraUsername(userData.login);
        }

        const payload = {
            id: playerId,
            intraname: userData.login,
            username: playerUsername,
            sub: userData.id,
        };

        if (await this.playerService.findOne2FA(playerId) == false) {
            const jwt = await this.authService.generateToken(payload);

            response.cookie('auth', jwt)
            response.status(200).redirect(process.env.HOST_COMPUTER + ':8080');
        } else {
            response.cookie('payload', JSON.stringify(payload));
            response.cookie('auth', 'HALF_TOKEN')
            response.redirect(process.env.HOST_COMPUTER + ':8080/redirect2faverify')
        }
    }

    @Get('/logout')
    async fortyTwoLogout(@Req() request: Request, @Res({passthrough: true}) response: Response) {
        response.clearCookie('auth');
        response.redirect(process.env.HOST_COMPUTER + ':8080/');
    }
    
    @Get('2fa')
    async twoFactorAuth(@Req() req: any, @Res() res: any) {
        const token = req.header('Authorization').split(' ')[1];
        const payload = await this.authService.validateToken(token as string);
        const id = payload.id;
        var secret = speakeasy.generateSecret({ 
            name: 'trance',
        });
        await this.playerService.updateTfaCode(id, secret.base32);
        qrCode.toDataURL(secret.otpauth_url, (err, data) => {
            if (err)
            return res.send('Error occured');
            res.send(data);
        });
        return true;
    }
    
    @Post('2fa/verify')
    async create(@Body() body: any, @Res({passthrough: true}) response: Response) {
        const payload = JSON.parse(body.payload);
        const code = await this.playerService.findOne2FACode(payload.id);
        const verified = speakeasy.totp.verify({
            secret: code,// tfa secret from db,
            encoding: 'base32',
            token: body.submittedValue,
        });
        if (verified) {
            const jwt = await this.authService.generateToken(payload);
            
            response.cookie('auth', jwt)
            return jwt;
        }
        return false;
    }

} 