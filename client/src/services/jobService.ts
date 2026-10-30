import { api } from './api';
import type { Job, ApiResponse, JobStatus, SkillLevel } from '../types';

export interface CreateJobDto {
  jobTitle: string;
  contractorName: string;
  contractorPhone: string;
  workLocation?: string;
  workCategory?: string;
  skillLevel?: SkillLevel;
  agreedDailyRatePaise: number;
  startDate: string;
  expectedEndDate?: string;
}

export interface UpdateJobDto {
  jobTitle?: string;
  contractorName?: string;
  contractorPhone?: string;
  workLocation?: string;
  workCategory?: string;
  skillLevel?: SkillLevel;
  agreedDailyRatePaise?: number;
  startDate?: string;
  expectedEndDate?: string;
  status?: JobStatus;
}

export const jobService = {
  async getJobs(params?: { status?: JobStatus; search?: string }): Promise<Job[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const res = await api.get<ApiResponse>(`/jobs${queryString}`);
    return res.jobs || [];
  },

  async createJob(data: CreateJobDto): Promise<Job> {
    const res = await api.post<ApiResponse>('/jobs', data);
    return res.job!;
  },

  async getJobById(id: string): Promise<Job> {
    const res = await api.get<ApiResponse>(`/jobs/${id}`);
    return res.job!;
  },

  async updateJob(id: string, data: UpdateJobDto): Promise<Job> {
    const res = await api.patch<ApiResponse>(`/jobs/${id}`, data);
    return res.job!;
  },

  async updateJobStatus(id: string, status: JobStatus): Promise<Job> {
    const res = await api.patch<ApiResponse>(`/jobs/${id}/status`, { status });
    return res.job!;
  },
};
