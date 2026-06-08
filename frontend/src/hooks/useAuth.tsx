import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authAPI from '@/api/auth';
import { AuthUser, LoginPayload, RegisterPayload } from '@/interfaces/Auth';
import {
  clearStoredAccessToken,
  getUserFromAccessToken,
  getUserFromStoredAccessToken,
  setStoredAccessToken,
} from '@/utils/authToken';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const tokenUser = getUserFromStoredAccessToken();
    if (tokenUser) {
      setUser(tokenUser);
    }

    try {
      const response = await authAPI.getCurrentUser();
      if (response.user) {
        setUser(response.user);
      } else if (!tokenUser) {
        setUser(null);
      }
    } catch {
      if (!tokenUser) {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      await refreshSession();
      setIsLoading(false);
    };

    void initializeAuth();
  }, [refreshSession]);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authAPI.login(payload);
    if (response.access_token) {
      setStoredAccessToken(response.access_token, response.expires_in);
    }

    const nextUser = response.user
      ?? (response.access_token ? getUserFromAccessToken(response.access_token) : null);

    if (!nextUser) {
      throw new Error('Login succeeded but no user information was returned.');
    }

    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await authAPI.register(payload);
    if (response.access_token) {
      setStoredAccessToken(response.access_token, response.expires_in);
    }

    const nextUser = response.user
      ?? (response.access_token ? getUserFromAccessToken(response.access_token) : null);

    if (!nextUser) {
      throw new Error('Registration succeeded but no user information was returned.');
    }

    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(async () => {
    clearStoredAccessToken();
    try {
      await authAPI.logout();
    } catch {
      // Session cookie may already be expired; local token has already been cleared.
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      refreshSession,
    }),
    [user, isLoading, login, register, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
