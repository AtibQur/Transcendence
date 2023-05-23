import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('/leaderboard')
export class LeaderboardController {
    constructor(private readonly LeaderboardService: LeaderboardService) {}

    
    @Get()
    getName(): string {
        return this.LeaderboardService.getName();
    }
}