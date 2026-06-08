export interface AuthUser {
  id: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user?: AuthUser;
  access_token?: string;
  expires_in?: number;
}
