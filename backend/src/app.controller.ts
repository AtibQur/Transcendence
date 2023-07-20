import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller("api")
export class AppController {

  @Get()
  getHello(): string {
    return 'hoi :)';
  }

  @Get('protected-route')
  getProtectedRoute(): string {
    return 'you have entered my king';
  }
}

