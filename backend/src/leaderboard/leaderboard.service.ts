import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaderboardService {
    getName(): string {
        return 'Leaderboard....ewa.';
    }
}
