import { Module } from '@nestjs/common';
import { MatchInstance } from './match-instance';
import { Server } from 'socket.io';
import { Match } from './match';

@Module({
    imports: [
    ],
    providers: [
        MatchInstance,
        Server,
        Match,
    ],
    // controllers: [MatchController],
})
export class MatchInstanceModule {}
