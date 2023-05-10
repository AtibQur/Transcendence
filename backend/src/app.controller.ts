import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('protected-route')
  @UseGuards(AuthGuard('42'))
  getProtectedRoute(): string {
    return 'you have entered my king';
  }
}

