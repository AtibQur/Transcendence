import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor() {
        super({
            clientID : process.env.FT_CLIENTID,
            clientSecret : process.env.FT_CLIENTSCT,
            callbackURL : process.env.FT_REDIRECTURI,
            scope: 'public',
        });  
    }

    async validate(accessToken: string, profile: any, done: any) {
        const user = {
            'id': profile.id,
            'username': profile.username,
            'displayName': profile.displayName,
            accessToken,
        }
        done(null, user);
    }
}
