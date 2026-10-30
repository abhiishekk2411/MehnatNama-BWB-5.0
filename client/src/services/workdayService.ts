import { api } from './api';
import type { WorkDay, WorkDaySummary, WorkDayStatus, ApiResponse } from '../types';

export interface CreateWorkDayDto {
  jobId: string;
  workDate: string; // YYYY-MM-DD
  status: WorkDayStatus;
  overtimeMinutes?: number;
  note?: string;
}

export interface UpdateWorkDayDto {
  status?: WorkDayStatus;
  overtimeMinutes?: number;
  note?: string;
}

export interface QueryWorkDayParams {
  jobId?: string;
  month?: string; // YYYY-MM
  startDate?: string;
  endDate?: string;
  status?: WorkDayStatus;
}

export const workdayService = {
  async getWorkdays(params?: QueryWorkDayParams): Promise<WorkDay[]> {
    const query = new URLSearchParams();
    if (params?.jobId) query.append('jobId', params.jobId);
    if (params?.month) query.append('month', params.month);
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    if (params?.status) query.append('status', params.status);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const res = await api.get<ApiResponse>(`/workdays${queryString}`);
    return res.workDays || [];
  },

  async recordWorkday(data: CreateWorkDayDto): Promise<WorkDay> {
    const res = await api.post<ApiResponse>('/workdays', data);
    return res.workDay!;
  },

  async getWorkdayById(id: string): Promise<WorkDay> {
    const res = await api.get<ApiResponse>(`/workdays/${id}`);
    return res.workDay!;
  },

  async updateWorkday(id: string, data: UpdateWorkDayDto): Promise<WorkDay> {
    const res = await api.patch<ApiResponse>(`/workdays/${id}`, data);
    return res.workDay!;
  },

  async getWorkdaysSummary(params?: QueryWorkDayParams): Promise<WorkDaySummary> {
    const query = new URLSearchParams();
    if (params?.jobId) query.append('jobId', params.jobId);
    if (params?.month) query.append('month', params.month);
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const res = await api.get<ApiResponse>(`/workdays/summary${queryString}`);
    return res.summary;
  },
};
