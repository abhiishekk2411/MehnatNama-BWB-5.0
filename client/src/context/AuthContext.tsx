import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Worker } from '../types';
import { authService } from '../services/authService';
import type { LoginDto, RegisterDto } from '../services/authService';

interface AuthContextType {
  worker: Worker | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = async () => {
    const token = localStorage.getItem('hisaab_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      setWorker(response.worker);
    } catch {
      authService.logout();
      setWorker(null);
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
      setWorker(response.worker);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterDto) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      setWorker(response.worker);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setWorker(null);
  };

  const refreshProfile = async () => {
    try {
      const response = await authService.getMe();
      setWorker(response.worker);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        worker,
        isAuthenticated: !!worker,
        isLoading,
        login,
        register,
        logout,
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
