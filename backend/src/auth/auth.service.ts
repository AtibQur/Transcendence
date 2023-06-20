import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async generateToken(player: any): Promise<string> {
        const payload = { username: player.username };
        return this.jwtService.sign(payload);
    }

    async validateToken(token: string): Promise<any> {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw 'invalid token';
        }
    }

    async validateUser(accessToken: any, id: any): Promise<boolean> {
        const config = {
            headers: { Authorization: 'Bearer ' + accessToken}
        };
        if (await axios.get('https://api.intra.42.fr/v2/me', config)) {
            return true;
        }
        return false;
    }
}