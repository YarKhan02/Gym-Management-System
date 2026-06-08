import axios from 'axios';

const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:8080';

export const authClient = axios.create({
  baseURL: AUTH_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

authClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
