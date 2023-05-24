// leaderboard.controller.ts
import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('/leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('/name')
  async loadUsername(): Promise<string> {
    const username = await this.leaderboardService.loadUsername();
    return username;
  }

  @Get('/wins')
  async loadWins(): Promise<string> {
    const wins = await this.leaderboardService.loadWins();
    return wins;
  }


}