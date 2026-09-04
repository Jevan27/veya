import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { UserDto, LoginRequest, RegisterRequest } from '@veya/shared';
import { authApi } from '../../../services/api/auth.api';
import { usersApi } from '../../../services/api/users.api';
import { TokenStorage } from '../../../services/storage/token.storage';
import { ApiError } from '../../../services/api/client';

export interface AuthContextValue {
  user: UserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  clearError: () => void;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: UserDto) => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const updateUser = useCallback((updatedUser: UserDto) => {
    setUser(updatedUser);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const current = await usersApi.getMe();
      setUser(current);
    } catch (err) {
      console.warn('[AuthProvider] Failed to refresh user profile:', err);
    }
  }, []);

  // Restore authentication state on mount
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const refreshToken = await TokenStorage.getRefreshToken();
        if (!refreshToken) {
          if (isMounted) setIsLoading(false);
          return;
        }

        // Fetch user profile to verify session and sync state
        try {
          const profile = await usersApi.getMe();
          if (isMounted) {
            setUser(profile);
            setIsLoading(false);
          }
        } catch {
          // If network error during restore, leave loading false but preserve token
          if (isMounted) setIsLoading(false);
        }
      } catch (err) {
        console.warn('[AuthProvider] Failed to restore auth state:', err);
        try {
          await TokenStorage.clearTokens();
        } catch {
          // Ignore storage clear failure
        }
        if (isMounted) setIsLoading(false);
      }
    }

    restoreSession().catch((err) => {
      console.warn('[AuthProvider] Unhandled restoreSession error:', err);
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      await TokenStorage.setTokens(response.tokens);
      setUser(response.user);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Incorrect email or password.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(payload);
      await TokenStorage.setTokens(response.tokens);
      setUser(response.user);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout().catch(() => {});
    } finally {
      await TokenStorage.clearTokens();
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      error,
      clearError,
      login,
      register,
      logout,
      updateUser,
      refreshUser,
    }),
    [user, isLoading, error, clearError, login, register, logout, updateUser, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
