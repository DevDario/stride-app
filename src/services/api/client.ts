import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.strideapp.com';

if (__DEV__ && !process.env.EXPO_PUBLIC_API_URL) {
  console.warn(
    '[API] EXPO_PUBLIC_API_URL is not set. Using default: https://api.strideapp.com'
  );
}

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
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
  (error) => {
    const customError = new Error(
      error.response?.data?.message || error.message
    );
    return Promise.reject(customError);
  }
);
