import axios from 'axios';

const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

export const authClient = axios.create({
  baseURL: AUTH_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-ID': CLIENT_ID,
  },
});

authClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
