// @third-party
import axios from 'axios';

// @project
import { AUTH_USER_KEY } from '@/config';

const axiosServices = axios.create({
  baseURL: import.meta.env.VITE_APP_API_HOST || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001')
});

/***************************  AXIOS MIDDLEWARE  ***************************/

axiosServices.interceptors.request.use(
  async (config) => {
    const storedValue = typeof window !== 'undefined' ? localStorage.getItem(AUTH_USER_KEY) : null;
    const parsedValue = storedValue && JSON.parse(storedValue);

    if (parsedValue?.access_token) {
      config.headers['Authorization'] = `Bearer ${parsedValue.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && !window.location.href.includes('/login')) {
      window.location.pathname = '/login';
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;
