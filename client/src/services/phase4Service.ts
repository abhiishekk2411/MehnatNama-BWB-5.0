import { api } from './api';
import type {
  ContractorConfirmationRequest,
  MinimumWageRule,
  WageComparisonResult,
  ReportData,
  RightsGuide,
  EscalationResource,
  SharedReportAccess,
  ApiResponse,
} from '../types';

export interface CreateConfirmationRequestDto {
  jobId: string;
  title?: string;
  note?: string;
  expiryDays?: number;
  workDayIds?: string[];
  startDate?: string;
  endDate?: string;
}

export interface ContractorBatchResponseDto {
  responses: Array<{
    itemId: string;
    responseType: 'CONFIRMED' | 'DISPUTED';
    disputeReason?: string;
    optionalComment?: string;
  }>;
}

export interface CalculateWageCheckDto {
  jobId?: string;
  state: string;
  zone?: string;
  employmentCategory: string;
  skillLevel: string;
  comparisonDate?: string;
  agreedDailyRatePaise?: number;
  daysWorkedCount?: number;
}

export interface CreateSharedAccessDto {
  jobId?: string;
  helperName?: string;
  expiryDays?: number;
  startDate?: string;
  endDate?: string;
}

export const confirmationService = {
  async getRequests(): Promise<ContractorConfirmationRequest[]> {
    const res = await api.get<ApiResponse>('/confirmations');
    return res.requests || [];
  },

  async getRequestById(id: string): Promise<ContractorConfirmationRequest> {
    const res = await api.get<ApiResponse>(`/confirmations/${id}`);
    return res.request!;
  },

  async createRequest(
    data: CreateConfirmationRequestDto
  ): Promise<{ request: ContractorConfirmationRequest; rawToken: string; shareUrl: string }> {
    const res = await api.post<ApiResponse>('/confirmations', data);
    return {
      request: res.request!,
      rawToken: (res as any).rawToken,
      shareUrl: res.shareUrl!,
    };
  },

  async revokeRequest(id: string): Promise<ContractorConfirmationRequest> {
    const res = await api.post<ApiResponse>(`/confirmations/${id}/revoke`, {});
    return res.request!;
  },

  // Public Contractor Endpoints (Zero Auth)
  async getPublicConfirmation(token: string): Promise<any> {
    const res = await api.get<ApiResponse>(`/public/confirmations/${token}`);
    return res.data;
  },

  async submitPublicResponse(token: string, data: ContractorBatchResponseDto): Promise<any> {
    return await api.post<ApiResponse>(`/public/confirmations/${token}/respond`, data);
  },
};

export const wageService = {
  async getRules(params?: { state?: string; employmentCategory?: string; skillLevel?: string }): Promise<MinimumWageRule[]> {
    const q = new URLSearchParams();
    if (params?.state) q.append('state', params.state);
    if (params?.employmentCategory) q.append('employmentCategory', params.employmentCategory);
    if (params?.skillLevel) q.append('skillLevel', params.skillLevel);
    const qs = q.toString() ? `?${q.toString()}` : '';

    const res = await api.get<ApiResponse>(`/wage/rules${qs}`);
    return res.rules || [];
  },

  async calculateComparison(data: CalculateWageCheckDto): Promise<WageComparisonResult> {
    const res = await api.post<any>('/wage/check/calculate', data);
    return res;
  },
};

export const reportService = {
  async getReportData(params?: {
    jobId?: string;
    startDate?: string;
    endDate?: string;
    language?: 'hi' | 'en';
  }): Promise<ReportData> {
    const q = new URLSearchParams();
    if (params?.jobId) q.append('jobId', params.jobId);
    if (params?.startDate) q.append('startDate', params.startDate);
    if (params?.endDate) q.append('endDate', params.endDate);
    if (params?.language) q.append('language', params.language);
    const qs = q.toString() ? `?${q.toString()}` : '';

    const res = await api.get<ApiResponse>(`/reports/data${qs}`);
    return res.report!;
  },
};

export const rightsService = {
  async getGuides(): Promise<RightsGuide[]> {
    const res = await api.get<ApiResponse>('/rights/guides');
    return res.guides || [];
  },

  async getEscalationResources(): Promise<EscalationResource[]> {
    const res = await api.get<ApiResponse>('/rights/escalation-resources');
    return res.resources || [];
  },
};

export const helperService = {
  async getAccesses(): Promise<SharedReportAccess[]> {
    const res = await api.get<ApiResponse>('/helpers');
    return res.accesses || [];
  },

  async createAccess(
    data: CreateSharedAccessDto
  ): Promise<{ access: SharedReportAccess; rawToken: string; shareUrl: string }> {
    const res = await api.post<ApiResponse>('/helpers', data);
    return {
      access: res.access!,
      rawToken: (res as any).rawToken,
      shareUrl: res.shareUrl!,
    };
  },

  async revokeAccess(id: string): Promise<void> {
    await api.delete<ApiResponse>(`/helpers/${id}`);
  },

  async getPublicSharedReport(token: string): Promise<any> {
    const res = await api.get<ApiResponse>(`/public/shared-reports/${token}`);
    return res.data;
  },
};
