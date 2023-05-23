import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('/leaderboard')
export class LeaderboardController {
    constructor(private readonly leaderboardService: LeaderboardService) {}
    @Get('username')
    loadUsername(): string {
      const username = this.leaderboardService.loadUsername();
      return username;
    }
    
}