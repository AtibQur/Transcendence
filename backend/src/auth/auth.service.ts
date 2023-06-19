import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
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