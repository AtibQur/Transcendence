import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  @Get('profile')
  @UseGuards(AuthGuard('42'))
  getProfile() {
    // Here, you can access the user information through the `req.user` object
    return { message: 'This is your profile' };
  }
}