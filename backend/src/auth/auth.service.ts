import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './jwt/jwt.config';
import axios from 'axios';
import { Player } from 'src/player/entities/player.entity';
import { sign } from 'crypto';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async generateToken(player: Player): Promise<string> {
        const payload = { sub: player.id };
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

    async validateUser(accessToken: any, intra_username: string): Promise<boolean> {
        const config = {
            headers: { Authorization: 'Bearer ' + accessToken}
        };
        const response = await axios.get('https://api.intra.42.fr/v2/me', config);
        if (response.data.login === intra_username){
            return true;
        }
        return false;
    }
}