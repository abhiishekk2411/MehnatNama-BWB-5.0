import { api } from './api';
import type { DashboardSummary, DashboardActivityItem, ApiResponse } from '../types';

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const res = await api.get<ApiResponse>('/dashboard/summary');
    return res.summary;
  },

  async getActivity(): Promise<DashboardActivityItem[]> {
    const res = await api.get<ApiResponse>('/dashboard/activity');
    return res.activities || [];
  },
};
