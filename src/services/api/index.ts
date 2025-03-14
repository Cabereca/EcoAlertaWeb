import axios, { AxiosHeaderValue, HeadersDefaults } from 'axios';
import Cookies from 'js-cookie';

type headers = {
  'Content-Type': string;
  Accept: string;
  Authorization: string;
  [key: string]: AxiosHeaderValue;
};

const api = axios.create();

api.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';

api.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
} as headers & HeadersDefaults;

// Adding Authorization header for all requests
api.interceptors.request.use(
  async (config) => {
    const token = Cookies.get('token');

    if (token) config.headers['Authorization'] = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
