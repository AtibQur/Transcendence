import { Controller, Get, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local.authguard';

@Controller()
export class AppController {

  @Get()
  getHello(): string {
    return 'Poepje met curry';
  }

  @Get('protected-route')
  @UseGuards(LocalAuthGuard)
  getProtectedRoute(): string {
    return 'you have entered my king';
  }
}

