import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Verify } from 'crypto';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor() {
        super({
            clientID: 'u-s4t2ud-1f5d67cb202d54f32ab27a0d8d47faa94081df9fc3e7da31b097a09fb7707578',
            clientSecret: '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',
            callbackUrl: 'http://localhost:8080/auth/42/callback',
            scope: 'public',
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        const user = {
            'id': profile.id,
            'username': profile.username,
            'displayName': profile.displayName,
            accessToken
        }
        done(null, user);
    }
}