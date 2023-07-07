import { Controller, Get, Header, Req, Res, Session, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local.authguard';
import { AuthenticatedGuard } from './local.authguard';
import { PlayerService } from 'src/player/player.service';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Verify } from 'crypto';
import { request } from 'http';
import { userInfo } from 'os';
import Axios from 'axios';
// import { }

const playerService = new PlayerService();


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('/login')
    fortyTwoLogin() {
        interface AuthServiceParams {
            client_id: string;
            redirect_uri: string;
            // state: string;
            response_type: string;
          }
          const url: string = "https://api.intra.42.fr/oauth/authorize";
          const params: AuthServiceParams = {
            
            client_id: "u-s4t2ud-1f5d67cb202d54f32ab27a0d8d47faa94081df9fc3e7da31b097a09fb7707578",
            redirect_uri: "http://localhost:auth/42/callback",
            // state: "",
            response_type: "code"
          };
          const redirectUrl: string = Axios.getUri({ url, params });    
          return redirectUrl;
    }

    // @UseGuards(LocalAuthGuard)
    @Get('/42/callback')
    async fortyTwoCallback(
        @Req() request: Request,
        @Res( {passthrough: true} ) response: Response
        ) {
        // console.log(request.query);
        const intra = await this.authService.validateUser(request.query.code);
        const userData = await this.authService.getIntraDatabyToken(intra.access_token);

        const jwt = await this.authService.generateToken(userData.id, userData.login);
        console.log(jwt)
        response.setHeader(
			'Set-Cookie',
			'session_cookie=' +
				jwt +
				'; HttpOnly; Secure; SameSite=Strict',
		);
        response.status(200).redirect('http://localhost:8080/Login');
    }

    @Get("session")
    async session(@Session() session: Record<string, any>) {
        console.log(session);
        console.log(session.id);
    }

    @Get('/logout')
    async fortyTwoLogout(@Req() req: any, @Res() res: any) {
        req.logout();
        res.redirect('http://localhost:3000/');
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

    // @UseGuards(AuthenticatedGuard)
    @Get('status')
    async GetAuthStatus(@Req() request: Request) {
        // return (req.user.intra_username);
    }

    // @UseGuards(AuthenticatedGuard)
    @Get('id')
    async GetAuthId(@Req() req: any) {
        return(req.session);
    }

    @UseGuards(AuthenticatedGuard)
    @Get('user')
    async GetAuthUser(@Req() req: any) {
        return req.session.passport.user;
    }

}