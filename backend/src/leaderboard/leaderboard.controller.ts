// leaderboard.controller.ts
import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('/leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  async loadUsername(): Promise<string> {
    const username = await this.leaderboardService.loadUsername();
    return username;
  }
}