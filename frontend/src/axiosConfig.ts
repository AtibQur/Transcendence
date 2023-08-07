import axios, { AxiosInstance } from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_HOST_COMPUTER + ':3000/',
});

export const setDefaultAuthHeader = (accessToken: string): void => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

export const removeDefaultAuthHeader = (): void => {
  delete instance.defaults.headers.common["Authorization"];
};

export const sendVerifyToken = async (payload: any, submittedValue: string): Promise<any> => {
  await instance.post('auth/2fa/verify', {payload, submittedValue});
}

export default instance;
