import { api } from './api';
import type { Worker } from '../types';

export interface AuthSuccessResponse {
  token: string;
  worker: Worker;
}

export interface RegisterDto {
  phone: string;
  email?: string;
  password: string;
  fullName: string;
  trade: string;
  stateCode: string;
  district?: string;
  preferredLang: string;
}

export interface LoginDto {
  phone: string;
  password: string;
}

export const authService = {
  async register(data: RegisterDto): Promise<AuthSuccessResponse> {
    const result = await api.post<AuthSuccessResponse>('/auth/register', data);
    api.setAuthToken(result.token);
    return result;
  },

  async login(data: LoginDto): Promise<AuthSuccessResponse> {
    const result = await api.post<AuthSuccessResponse>('/auth/login', data);
    api.setAuthToken(result.token);
    return result;
  },

  async getMe(): Promise<{ worker: Worker }> {
    return api.get<{ worker: Worker }>('/auth/me');
  },

  logout(): void {
    api.removeAuthToken();
  },
};
