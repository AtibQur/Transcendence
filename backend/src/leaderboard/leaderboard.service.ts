// leaderboard.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class LeaderboardService {
  async loadUsername(): Promise<string> {
    const filePath = path.resolve(__dirname, '../../test/fakeDatabase.json');
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);
      const leaderboard = jsonData.leaderboard;
      if (leaderboard && leaderboard.length > 0) {
        const firstPlayer = leaderboard[0];
        return firstPlayer.username;
      }
      return ''; // Default value if no username is found
    } catch (error) {
      console.error('Error reading JSON file:', error);
      throw error;
    }
  }

  async loadWins(): Promise<string> {
    const filePath = path.resolve(__dirname, '../../test/fakeDatabase.json');
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);
      const leaderboard = jsonData.leaderboard;
      if (leaderboard && leaderboard.length > 0) {
        const firstPlayer = leaderboard[0];
        return firstPlayer.games_won;
      }
      return ''; // Default value if no username is found
    } catch (error) {
      console.error('Error reading JSON file:', error);
      throw error;
    }
  }
}