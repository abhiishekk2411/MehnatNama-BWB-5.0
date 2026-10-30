export type JobStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED';

export type WorkDayStatus = 'FULL_DAY' | 'HALF_DAY' | 'ABSENT';

export type LedgerEntryType = 'PAYMENT' | 'ADVANCE';

export type PaymentMode = 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'OTHER';

export type SkillLevel = 'UNSKILLED' | 'SEMI_SKILLED' | 'SKILLED' | 'HIGHLY_SKILLED';

export type WorkerTrade = string;

export interface WorkerProfile {
  id: string;
  userId: string;
  fullName: string;
  preferredLanguage: string;
  workerType: string;
  skillLevel: SkillLevel;
  profilePhotoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  phone: string;
  createdAt: string;
  profile?: WorkerProfile | null;
}

export interface JobStats {
  totalDays: number;
  totalEarnedPaise: number;
  totalEarnedRupees: number;
  totalPaymentsPaise: number;
  totalAdvancesPaise: number;
  totalReceiptsPaise: number;
  totalReceiptsRupees: number;
  outstandingBalancePaise: number;
  outstandingBalanceRupees: number;
  isCreditBalance: boolean;
}

export interface Job {
  id: string;
  userId: string;
  jobTitle: string;
  contractorName: string;
  contractorPhone: string;
  workLocation?: string | null;
  workCategory?: string | null;
  skillLevel: SkillLevel;
  agreedDailyRatePaise: number;
  startDate: string;
  expectedEndDate?: string | null;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  stats?: JobStats;
  _count?: {
    workDays: number;
    ledgerEntries: number;
  };
}

export interface WorkDay {
  id: string;
  userId: string;
  jobId: string;
  workDate: string;
  status: WorkDayStatus;
  dailyRateSnapshotPaise: number;
  earnedAmountPaise: number;
  overtimeMinutes: number;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  job?: {
    id: string;
    jobTitle: string;
    contractorName: string;
    workLocation?: string | null;
    agreedDailyRatePaise?: number;
  };
}

export interface WorkDaySummary {
  totalEntries: number;
  totalDays?: number;
  totalDaysWorked: number;
  fullDays: number;
  halfDays: number;
  absentDays: number;
  totalEarnedPaise: number;
  totalEarnedRupees: number;
  totalOvertimeMinutes: number;
  totalOvertimeHours: string;
}

export interface LedgerEntry {
  id: string;
  userId: string;
  jobId: string;
  type: LedgerEntryType;
  amountPaise: number;
  paymentDate: string;
  paymentMode: PaymentMode;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  job?: {
    id: string;
    jobTitle: string;
    contractorName: string;
  };
}

export interface LedgerSummary {
  totalEntries: number;
  totalEarnedPaise: number;
  totalEarnedRupees: number;
  totalPaymentsPaise: number;
  totalPaymentsRupees: number;
  totalAdvancesPaise: number;
  totalAdvancesRupees: number;
  totalReceiptsPaise: number;
  totalReceiptsRupees: number;
  outstandingBalancePaise: number;
  outstandingBalanceRupees: number;
  isCreditBalance: boolean;
}

export interface DashboardSummary {
  financials: {
    totalEarnedPaise: number;
    totalEarnedRupees: number;
    paymentsReceivedPaise: number;
    paymentsReceivedRupees: number;
    advancesReceivedPaise: number;
    advancesReceivedRupees: number;
    totalReceiptsPaise: number;
    totalReceiptsRupees: number;
    outstandingBalancePaise: number;
    outstandingBalanceRupees: number;
    isCreditBalance: boolean;
    workingDaysCount: number;
  };
  jobs: {
    activeCount: number;
    totalCount: number;
    activeList: Array<{
      id: string;
      name: string;
      contractor: string;
      dailyWage: number;
      dailyWagePaise: number;
      status: string;
      location?: string;
    }>;
  };
  confirmations: {
    confirmed: number;
    disputed: number;
    pending: number;
  };
}

export interface DashboardActivityItem {
  id: string;
  timestamp: number;
  date: string;
  activity: string;
  hindiActivity?: string;
  job: string;
  amountOrDetails: string;
  status: string;
  statusLabel?: string;
  statusHindi?: string;
  type: 'work' | 'payment' | 'advance';
}

export interface MinimumWageBenchmark {
  id: string;
  stateCode: string;
  sphere: 'CENTRAL' | 'STATE';
  scheduledEmployment: string;
  skillCategory: SkillLevel;
  dailyWagePaise: number;
  effectiveDate: string;
  notificationRef: string;
  authorityName: string;
  sourceUrl?: string | null;
  isActive: boolean;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  success: boolean;
  message?: string;
  error?: {
    message: string;
    statusCode: number;
    issues?: Array<{ field: string; message: string }>;
  };
  token?: string;
  user?: User;
  profile?: WorkerProfile;
  jobs?: Job[];
  job?: Job;
  workDays?: WorkDay[];
  workDay?: WorkDay;
  summary?: any;
  entries?: LedgerEntry[];
  entry?: LedgerEntry;
  activities?: DashboardActivityItem[];
}
