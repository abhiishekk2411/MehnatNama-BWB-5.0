import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, WorkerProfile } from '../types';
import { authService, type LoginDto, type RegisterDto, type UpdateProfileDto } from '../services/authService';

interface AuthContextType {
  user: User | null;
  profile: WorkerProfile | null;
  worker: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileDto) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = async () => {
    try {
      // 1. Check if active session exists
      const response = await authService.getMe();
      setUser(response.user);
    } catch {
      // 2. If no active session, auto-login as demo worker (Ramesh Kumar) for Phase 3 review
      try {
        const demoLogin = await authService.login({ phone: '9876543210', pin: '1234' });
        setUser(demoLogin.user);
      } catch {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (data: LoginDto) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterDto) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (data: UpdateProfileDto) => {
    const res = await authService.updateProfile(data);
    if (user) {
      setUser({
        ...user,
        profile: res.profile,
      });
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await authService.getMe();
      setUser(response.user);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: user?.profile || null,
        worker: user?.profile || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
