import { Controller, Get, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePlayerDto } from 'src/player/dto/create-player.dto';
import { PlayerService } from 'src/player/player.service';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';

const playerService = new PlayerService();


@Controller('auth')
export class AuthController {
    @Get('/42')
    @UseGuards(AuthGuard('42'))
    async fortyTwoLogin() {
        return ('you have entered my king');
    }

    @Get('/42/callback')
    @UseGuards(AuthGuard('42'))
    async fortyTwoCallback(@Req() req: any, @Res() res: any) {
        const createPlayerDto = new CreatePlayerDto();
        createPlayerDto.username = req.user.username;
        playerService.createPlayer(createPlayerDto);

        res.redirect('http://localhost:8080/Login?username=' + req.user.username);
    }

    @Get("session")
    async session(@Session() session: Record<string, any>) {
        console.log(session);
        console.log(session.id);
    }

    @Get('FetchUser')
    async FetchUser(@Req() req: any) {
        if (!req.user)
            return 'Codammer';
        return req.user.username;
    }

    @Get('/logout')
    async fortyTwoLogout(@Req() req: any, @Res() res: any) {
        req.logout();
        res.redirect('http://localhost:3000/');
    }

    @Get('2fa')
    async twoFactorAuth(@Req() req: any, @Res() res: any) {
        var secret = speakeasy.generateSecret({ 
            name: 'trance',
        });
        console.log(req.user);
        qrCode.toDataURL(secret.otpauth_url, (err, data) => {
            if (err)
                return res.send('Error occured');
            res.send(data);
        });
    }

    @Get('2fa/verify')
    async twoFactorAuthVerify(@Req() req: any, @Res() res: any) {
        const { token, secret } = req.query;
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
        });
        console.log(secret);
        console.log(token);
        if (verified) {
            console.log('2fa verified');
            res.send('2fa verified, you will be redirected to the login page');
        } else {
            console.log('incorrect code');
            res.send('incorrect code');
        }
    }
}
