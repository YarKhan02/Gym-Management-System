import axios from 'axios';
import { getValidStoredAccessToken } from '@/utils/authToken';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-ID': CLIENT_ID,
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getValidStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.response.data);
    }
    return Promise.reject(error);
  }
);