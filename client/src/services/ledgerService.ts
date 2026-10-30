import { api } from './api';
import type { LedgerEntry, LedgerSummary, LedgerEntryType, PaymentMode, ApiResponse } from '../types';

export interface CreateLedgerEntryDto {
  jobId: string;
  type: LedgerEntryType;
  amountPaise: number;
  paymentDate: string; // YYYY-MM-DD
  paymentMode: PaymentMode;
  note?: string;
}

export interface UpdateLedgerEntryDto {
  amountPaise?: number;
  paymentDate?: string;
  paymentMode?: PaymentMode;
  note?: string;
}

export interface QueryLedgerParams {
  jobId?: string;
  type?: LedgerEntryType;
  month?: string; // YYYY-MM
  startDate?: string;
  endDate?: string;
}

export const ledgerService = {
  async getLedgerEntries(params?: QueryLedgerParams): Promise<LedgerEntry[]> {
    const query = new URLSearchParams();
    if (params?.jobId) query.append('jobId', params.jobId);
    if (params?.type) query.append('type', params.type);
    if (params?.month) query.append('month', params.month);
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const res = await api.get<ApiResponse>(`/ledger${queryString}`);
    return res.entries || [];
  },

  async recordEntry(data: CreateLedgerEntryDto): Promise<LedgerEntry> {
    const res = await api.post<ApiResponse>('/ledger', data);
    return res.entry!;
  },

  async getEntryById(id: string): Promise<LedgerEntry> {
    const res = await api.get<ApiResponse>(`/ledger/${id}`);
    return res.entry!;
  },

  async updateEntry(id: string, data: UpdateLedgerEntryDto): Promise<LedgerEntry> {
    const res = await api.patch<ApiResponse>(`/ledger/${id}`, data);
    return res.entry!;
  },

  async getLedgerSummary(params?: QueryLedgerParams): Promise<LedgerSummary> {
    const query = new URLSearchParams();
    if (params?.jobId) query.append('jobId', params.jobId);
    if (params?.type) query.append('type', params.type);
    if (params?.month) query.append('month', params.month);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const res = await api.get<ApiResponse>(`/ledger/summary${queryString}`);
    return res.summary;
  },
};
