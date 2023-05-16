import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class GoogleController {

    @Get('auth/google')
    @UseGuards(AuthGuard('google'))
    async googleLogin(@Req() req) {}

    @Get('auth/google/callback')
    @UseGuards(AuthGuard('google'))
    async googleLoginCallback(@Req() req) {
        console.log(req.user);
        if (!req.user)
            return 'No user from google'
        return req.user;
    }
}
