import type { ApiResponse } from '../types';

const API_BASE_URL =
  (typeof window !== 'undefined' && window.location.hostname)
    ? `${window.location.protocol}//${window.location.hostname}:5001/api`
    : (import.meta.env.VITE_API_URL || 'http://localhost:5001/api');

class ApiClient {
  private getAuthToken(): string | null {
    return localStorage.getItem('mehnatnama_token');
  }

  public setAuthToken(token: string): void {
    localStorage.setItem('mehnatnama_token', token);
  }

  public removeAuthToken(): void {
    localStorage.removeItem('mehnatnama_token');
  }

  public async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include', // Include HttpOnly cookies automatically
        headers,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data.error?.message || data.message || 'Something went wrong. Please try again.';
        throw new Error(errorMsg);
      }

      return data as T;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Network error. Please check your internet connection.');
    }
  }

  public get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  public delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
