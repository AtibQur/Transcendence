import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as dotenv from 'dotenv';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async generateToken(payload: any): Promise<string> {
        const options = { secret: process.env.JWT_SECRET, expiresIn: '7d'}
        const token = await this.jwtService.signAsync(payload, options);

        return token;
    }

    async validateToken(token: string): Promise<any> {
        try {
            console.log("VERIFYING TOKEN")
            const options = { secret: process.env.JWT_SECRET, expiresIn: '7d'}
            return this.jwtService.verify(token, options);
        } catch (error) {
            console.log("INVALID TOKEN")
            throw 'invalid token';
        }
    }

    async validateUser(accessToken: any): Promise<any> {
        const response = await axios.post('https://api.intra.42.fr/oauth/token',{
            grant_type: 'authorization_code',
            client_id: process.env.FT_CLIENTID,
            client_secret: process.env.FT_CLIENTSCT,
            code: accessToken,
            redirect_uri: process.env.FT_REDIRECTURI
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