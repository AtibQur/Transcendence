import axios, { AxiosInstance } from 'axios';
import { removeCookie } from './components/cookie_utils';

const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
});

export const setDefaultAuthHeader = (accessToken: string): void => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

export const removeDefaultAuthHeader = (): void => {
  delete instance.defaults.headers.common["Authorization"];
};

export const sendVerifyToken = async (payload: any, submittedValue: string): Promise<any> => {
  await instance.post('auth/2fa/verify', {payload, submittedValue});
  // if (response.data == true) {
  //   window.location.replace('http://localhost:8080/');
  // } else {
  //   removeCookie('payload');
  //   removeCookie('playerId');
  //   window.location.replace('http://localhost:8080/wrong2fa');
  // }
}

export default instance;
