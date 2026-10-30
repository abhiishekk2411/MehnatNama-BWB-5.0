export type WorkerTrade =
  | 'MASON'
  | 'CARPENTER'
  | 'HELPER'
  | 'LOADER'
  | 'PAINTER'
  | 'ELECTRICIAN'
  | 'PLUMBER'
  | 'AGRICULTURAL_LABOURER'
  | 'GENERAL_LABOUR'
  | 'OTHER';

export type JobStatus = 'ACTIVE' | 'COMPLETED' | 'DISPUTED';

export type WorkDayStatus = 'FULL_DAY' | 'HALF_DAY' | 'OVERTIME' | 'ABSENT';

export type TransactionType = 'ADVANCE' | 'PARTIAL_PAYMENT' | 'FINAL_SETTLEMENT';

export type PaymentMode = 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'OTHER';

export type VerificationStatus = 'PENDING' | 'VIEWED' | 'CONFIRMED' | 'DISPUTED' | 'EXPIRED';

export type SkillCategory = 'UNSKILLED' | 'SEMI_SKILLED' | 'SKILLED' | 'HIGHLY_SKILLED';

export interface Worker {
  id: string;
  phone: string;
  email?: string | null;
  fullName: string;
  trade: WorkerTrade;
  stateCode: string;
  district?: string | null;
  preferredLang: string;
  createdAt: string;
  _count?: {
    jobs: number;
    workLogs: number;
    payments: number;
  };
}

export interface Job {
  id: string;
  workerId: string;
  title: string;
  contractorName: string;
  contractorPhone: string;
  siteLocation?: string | null;
  dailyWagePaise: number;
  standardHours: number;
  overtimeRatePaise: number;
  startDate: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  _count?: {
    workLogs: number;
    payments: number;
    verifications: number;
  };
}

export interface WorkLog {
  id: string;
  jobId: string;
  workerId: string;
  workDate: string;
  status: WorkDayStatus;
  overtimeHours: number;
  wageEarnedPaise: number;
  notes?: string | null;
  isLocked: boolean;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  jobId: string;
  workerId: string;
  amountPaise: number;
  type: TransactionType;
  paymentMode: PaymentMode;
  transactionDate: string;
  notes?: string | null;
  createdAt: string;
}

export interface VerificationItem {
  id: string;
  verificationId: string;
  workLogId?: string | null;
  paymentId?: string | null;
  isDisputed: boolean;
  disputeReason?: string | null;
  contractorNote?: string | null;
}

export interface VerificationSnapshot {
  workerName: string;
  workerPhone: string;
  workerTrade: string;
  jobTitle: string;
  contractorName: string;
  dailyWagePaise: number;
  dateRangeStart: string;
  dateRangeEnd: string;
  totalDaysWorked: number;
  totalEarningsPaise: number;
  totalAdvancesPaise: number;
  netDuesPaise: number;
  workLogs: WorkLog[];
  payments: PaymentTransaction[];
}

export interface Verification {
  id: string;
  jobId: string;
  tokenHash: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  snapshotPayload: VerificationSnapshot;
  status: VerificationStatus;
  viewCount: number;
  firstViewedAt?: string | null;
  respondedAt?: string | null;
  contractorNote?: string | null;
  expiresAt: string;
  createdAt: string;
  items?: VerificationItem[];
}

export interface MinimumWageBenchmark {
  id: string;
  stateCode: string;
  sphere: 'CENTRAL' | 'STATE';
  scheduledEmployment: string;
  skillCategory: SkillCategory;
  dailyWagePaise: number;
  effectiveDate: string;
  notificationRef: string;
  authorityName: string;
  sourceUrl: string;
  isActive: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
    issues?: Array<{ field: string; message: string }>;
  };
}
