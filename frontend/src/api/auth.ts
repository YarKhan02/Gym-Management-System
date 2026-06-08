import { authClient } from '@/api/authClient';
import { AuthResponse, LoginPayload, RegisterPayload } from '@/interfaces/Auth';

const AUTH_ROUTES = {
  register: '/auth/register',
  login: '/auth/login',
  logout: '/auth/logout',
  me: '/auth/me',
};

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await authClient.post(AUTH_ROUTES.register, payload);
  return response.data;
};

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await authClient.post(AUTH_ROUTES.login, payload);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await authClient.post(AUTH_ROUTES.logout);
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
  const response = await authClient.get(AUTH_ROUTES.me);
  return response.data;
};
