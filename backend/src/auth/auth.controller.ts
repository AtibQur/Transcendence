import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    @Get('42')
    @UseGuards(AuthGuard('42'))
    async login() {}

    @Get('42/callback')
    @UseGuards(AuthGuard('42'))
    async callback(@Req() red: any, @Res() res: any) {
        res.redirect('/');
    }

    @Get('logout')
    async logout(@Req() req: any, @Res() res: any) {
        req.logout();
        res.redirect('/');
    }
}
