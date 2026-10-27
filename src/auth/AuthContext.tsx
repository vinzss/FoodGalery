// State autentikasi global (sumber kebenaran tetap di backend; ini hanya cache UI).
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AuthUser } from '../types';
import { authApi, ApiError } from './api';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (identifier: string, password: string) => Promise<AuthUser>;
  signup: (
    payload: Parameters<typeof authApi.signup>[0]
  ) => Promise<Awaited<ReturnType<typeof authApi.signup>>>;
  verifyOtp: (email: string, otp: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { user } = await authApi.me();
      setUser(user);
    } catch (err) {
      // 401/403 (belum login / dibanned) atau server mati → anggap guest
      if (err instanceof ApiError && err.status === 0) {
        console.warn('[auth] Backend API tidak dapat dihubungi.');
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // Re-validasi saat tab kembali aktif (mis. role diubah / akun di-ban admin)
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refresh]);

  const login = async (identifier: string, password: string) => {
    const { user } = await authApi.login(identifier, password);
    setUser(user);
    return user;
  };

  const signup = async (payload: Parameters<typeof authApi.signup>[0]) => {
    return authApi.signup(payload);
  };

  const verifyOtp = async (email: string, otp: string) => {
    const { user } = await authApi.verifyOtp(email, otp);
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        signup,
        verifyOtp,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
