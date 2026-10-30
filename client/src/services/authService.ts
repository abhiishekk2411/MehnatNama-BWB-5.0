import { api } from './api';
import type { User, WorkerProfile, ApiResponse } from '../types';

export interface LoginDto {
  phone: string;
  pin?: string;
  password?: string;
}

export interface RegisterDto {
  phone: string;
  pin?: string;
  password?: string;
  fullName: string;
  trade?: string;
  stateCode?: string;
  district?: string;
  preferredLang?: string;
  preferredLanguage?: string;
  workerType?: string;
  skillLevel?: 'UNSKILLED' | 'SEMI_SKILLED' | 'SKILLED' | 'HIGHLY_SKILLED';
}

export interface UpdateProfileDto {
  fullName?: string;
  preferredLanguage?: string;
  workerType?: string;
  skillLevel?: 'UNSKILLED' | 'SEMI_SKILLED' | 'SKILLED' | 'HIGHLY_SKILLED';
  profilePhotoUrl?: string | null;
}

export const authService = {
  async register(data: RegisterDto): Promise<{ user: User; token: string }> {
    const payload = {
      phone: data.phone,
      pin: data.pin || data.password || '1234',
      fullName: data.fullName,
      preferredLanguage: data.preferredLanguage || data.preferredLang || 'hi',
      workerType: data.workerType || data.trade || 'CONSTRUCTION',
      skillLevel: data.skillLevel || 'SKILLED',
    };
    const res = await api.post<ApiResponse>('/auth/register', payload);
    if (res.token) {
      api.setAuthToken(res.token);
    }
    return { user: res.user!, token: res.token! };
  },

  async login(data: LoginDto): Promise<{ user: User; token: string }> {
    const payload = {
      phone: data.phone,
      pin: data.pin || data.password || '1234',
    };
    const res = await api.post<ApiResponse>('/auth/login', payload);
    if (res.token) {
      api.setAuthToken(res.token);
    }
    return { user: res.user!, token: res.token! };
  },

  async logout(): Promise<void> {
    try {
      await api.post<ApiResponse>('/auth/logout', {});
    } catch {
      // ignore
    } finally {
      api.removeAuthToken();
    }
  },

  async getMe(): Promise<{ user: User }> {
    const res = await api.get<ApiResponse>('/auth/me');
    return { user: res.user! };
  },

  async getProfile(): Promise<{ profile: WorkerProfile }> {
    const res = await api.get<ApiResponse>('/profile');
    return { profile: res.profile! };
  },

  async updateProfile(data: UpdateProfileDto): Promise<{ profile: WorkerProfile }> {
    const res = await api.patch<ApiResponse>('/profile', data);
    return { profile: res.profile! };
  },
};
