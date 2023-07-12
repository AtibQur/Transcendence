import axios, { AxiosInstance } from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
});

export const setDefaultAuthHeader = (accessToken: string): void => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

export const removeDefaultAuthHeader = (): void => {
  delete instance.defaults.headers.common["Authorization"];
};

export default instance;
