import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor() {
        super({
            clientID: 'u-s4t2ud-1f5d67cb202d54f32ab27a0d8d47faa94081df9fc3e7da31b097a09fb7707578',
            clientSecret: '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',
            callbackUrl: 'http://localhost:3000/auth/42/callback',
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        return done(null, profile);
    }
}