import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    @Get('/42')
    @UseGuards(AuthGuard('42'))
    async fortyTwoLogin() {}

    @Get('/42/callback')
    @UseGuards(AuthGuard('42'))
    async fortyTwoCallback(@Req() req: any, @Res() res: any) {
        console.log(req.user);
        res.redirect('http://localhost:8080/protected-route');
    }

    @Get('/logout')
    async fortyTwoLogout(@Req() req: any, @Res() res: any) {
        req.logout();
        res.redirect('http://localhost:8080/');
    }
}
