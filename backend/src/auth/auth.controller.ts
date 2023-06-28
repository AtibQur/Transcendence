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
// import { }

const playerService = new PlayerService();


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @UseGuards(LocalAuthGuard)
    @Get('/login')
    async fortyTwoLogin() {
        return ('you have entered my king');
    }

    @UseGuards(LocalAuthGuard)
    @Get('/42/callback')
    async fortyTwoCallback(
        @Req() req: any,
        @Res( {passthrough: true} ) response: Response
        ) {
        console.log(req.user);
        this.authService.validateUser(req.user.accessToken, req.user.intra_username);
        const jwt = await this.authService.generateToken(req.user);
        console.log(jwt);

        // console.log(req.session);
        response.setHeader(
            'Set-Cookie',
            'jwt=' + jwt + '; HttpOnly; Secure; SameSite=Strict',
        );
        // console.log(response);
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
        // console.log(request.sessionStore);
        return("Billie Jean is not my lover Shes just a girl who claims that I am the one But the kid is not my son She says I am the one, but the kid is not my son For forty days and forty nights The law was on her side But who can stand when shes in demand Her schemes and plans Cause we danced on the floor in the round So take my strong advice, just remember to always think twice (Do think twice, do think twice) She told my baby wed danced til three, then she looked at me Then showed a photo my baby cried his eyes were like mine (oh, no) Cause we danced on the floor in the round, baby People always told me be careful of what you do And dont go around breaking young girls hearts She came and stood right by me Just the smell of sweet perfume This happened much too soon She called me to her room Billie Jean is not my lover Shes just a girl who claims that I am the one But the kid is not my son Billie Jean is not my lover Shes just a girl who claims that I am the one But the kid is not my son She says I am the one, but the kid is not my son She says I am the one, but the kid is not my son Billie Jean is not my lover Shes just a girl who claims that I am the one But the kid is not my son She says I am the one, but the kid is not my son She says I am the one You know what you did, (she says he is my son) breaking my heart babe She says I am the one Billie Jean is not my lover Billie Jean is not my lover Billie Jean is not my lover Billie Jean is not my lover (dont Billie Jean) Billie Jean is not my lover Billie Jean is not my lover");
    }

    @UseGuards(AuthenticatedGuard)
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
