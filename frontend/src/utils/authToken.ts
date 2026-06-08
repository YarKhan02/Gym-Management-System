import { AuthUser } from '@/interfaces/Auth';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'auth_access_token_expires_at';

const base64UrlDecode = (value: string): string => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
};

const parseJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }
    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return null;
  }
};

export const setStoredAccessToken = (token: string, expiresInSeconds?: number) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);

  const payload = parseJwtPayload(token);
  const expiresAtFromToken = typeof payload?.exp === 'number' ? payload.exp * 1000 : null;
  const expiresAtFromResponse = typeof expiresInSeconds === 'number'
    ? Date.now() + expiresInSeconds * 1000
    : null;

  const expiresAt = expiresAtFromToken ?? expiresAtFromResponse;
  if (expiresAt) {
    localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, String(expiresAt));
  } else {
    localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  }
};

export const clearStoredAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
};

export const getStoredAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const isStoredAccessTokenExpired = (): boolean => {
  const expiresAt = localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  if (!expiresAt) {
    return false;
  }
  const expiresAtMs = Number(expiresAt);
  if (!Number.isFinite(expiresAtMs)) {
    return false;
  }
  return Date.now() >= expiresAtMs;
};

export const getValidStoredAccessToken = (): string | null => {
  const token = getStoredAccessToken();
  if (!token) {
    return null;
  }
  if (isStoredAccessTokenExpired()) {
    clearStoredAccessToken();
    return null;
  }
  return token;
};

export const getUserFromAccessToken = (token: string): AuthUser | null => {
  const payload = parseJwtPayload(token);
  if (!payload) {
    return null;
  }

  const id = typeof payload.sub === 'string' ? payload.sub : null;
  const email = typeof payload.email === 'string' ? payload.email : null;

  if (!id || !email) {
    return null;
  }

  return { id, email };
};

export const getUserFromStoredAccessToken = (): AuthUser | null => {
  const token = getValidStoredAccessToken();
  if (!token) {
    return null;
  }
  return getUserFromAccessToken(token);
};
