import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './jwt/jwt.config';
import axios from 'axios';
import { Player } from 'src/player/entities/player.entity';
import { sign } from 'crypto';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async generateToken(id: string, login: string): Promise<string> {
        const payload = { 
            sub: id,
            username: login, 
        };
        const options = { secret: 'geheim', expiresIn: '1h'}
        const token = await this.jwtService.signAsync(payload, options);

        return JSON.stringify({access_token: token});
    }

    async validateToken(token: string): Promise<any> {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw 'invalid token';
        }
    }

    async validateUser(accessToken: any): Promise<any> {
        const response = await axios.post('https://api.intra.42.fr/oauth/token',{
            grant_type: 'authorization_code',
            client_id: "u-s4t2ud-1f5d67cb202d54f32ab27a0d8d47faa94081df9fc3e7da31b097a09fb7707578",
            client_secret: "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",
            code: accessToken,
            redirect_uri: "http://localhost:3000/auth/42/callback"
        });
        return response.data;
    }

    async getIntraDatabyToken(token: string): Promise<any> {
        const response = await axios.get('https://api.intra.42.fr/v2/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        /*
        als de user niet bestaat in de database, maak hier een nieuwe user aan
        */
        return response.data;
    }
}