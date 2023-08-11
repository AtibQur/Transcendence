import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_HOST_COMPUTER + ':3000/',
});

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError ) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const setDefaultAuthHeader = (accessToken: string): void => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

export const removeDefaultAuthHeader = (): void => {
  delete instance.defaults.headers.common["Authorization"];
};

export const sendVerifyToken = async (payload: any, submittedValue: string) => {
  await instance.post('auth/2fa/verify', { payload, submittedValue });
}

export default instance;
