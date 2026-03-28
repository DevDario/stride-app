import axios from 'axios';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const apiClient = axios.create({
  baseURL: 'https://api.flitapp.com',
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getString('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (__DEV__) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = storage.getString('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(
          'https://api.flitapp.com/auth/refresh',
          { refresh_token: refreshToken }
        );
        storage.set('auth_token', data.token);
        apiClient.defaults.headers.common['Authorization'] =
          `Bearer ${data.token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        storage.delete('auth_token');
        storage.delete('refresh_token');
        return Promise.reject(error);
      }
    }

    const customError = new Error(
      error.response?.data?.message || error.message
    );
    return Promise.reject(customError);
  }
);
