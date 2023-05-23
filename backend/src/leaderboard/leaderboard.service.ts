import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LeaderboardService {
    loadUsername(): string {
        const filePath = path.resolve(__dirname, '../../test/fakeDatabase.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileContent);
        const leaderboard = jsonData.leaderboard;
        if (leaderboard && leaderboard.length > 0) {
             console.log("test");
          const firstPlayer = leaderboard[0];
          return firstPlayer.username;
        }
        return ''; // Default value if no username is found
      }
}
