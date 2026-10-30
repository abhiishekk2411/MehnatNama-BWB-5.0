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

export interface ContractorConfirmationRequest {
  id: string;
  userId: string;
  jobId: string;
  tokenHash?: string;
  expiresAt: string;
  revokedAt?: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'DISPUTED' | 'EXPIRED' | 'REVOKED';
  title?: string | null;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  items?: ConfirmationItem[];
  auditEvents?: Array<{
    id: string;
    eventType: string;
    createdAt: string;
    metadata?: any;
  }>;
}

export interface ConfirmationItem {
  id: string;
  requestId: string;
  workDayId: string;
  status: 'PENDING' | 'CONFIRMED' | 'DISPUTED';
  workDay?: WorkDay;
  responses?: Array<{
    id: string;
    responseType: 'CONFIRMED' | 'DISPUTED';
    disputeReason?: string | null;
    optionalComment?: string | null;
    submittedAt: string;
  }>;
}

export interface MinimumWageRule {
  id: string;
  state: string;
  zone: string;
  employmentCategory: string;
  skillLevel: SkillLevel;
  wagePeriod: string;
  baseRatePaise: number;
  variableAllowancePaise: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  notificationDate: string;
  officialSourceUrl: string;
  sourceReference: string;
  verificationStatus: string;
  verifiedAt?: string | null;
}

export interface WageComparisonResult {
  matched: boolean;
  message?: string;
  jobTitle?: string;
  comparisonDate?: string;
  rule?: {
    id: string;
    state: string;
    zone: string;
    employmentCategory: string;
    skillLevel: SkillLevel;
    baseRatePaise: number;
    variableAllowancePaise: number;
    totalBenchmarkDailyRatePaise: number;
    totalBenchmarkDailyRateRupees: number;
    effectiveFrom: string;
    notificationDate: string;
    sourceReference: string;
    officialSourceUrl: string;
  };
  worker?: {
    agreedDailyRatePaise: number;
    agreedDailyRateRupees: number;
    daysCount: number;
  };
  comparison?: {
    differencePerDayPaise: number;
    differencePerDayRupees: number;
    cumulativeDifferencePaise: number;
    cumulativeDifferenceRupees: number;
    isBelowBenchmark: boolean;
    status: string;
    hindiStatus: string;
  };
  disclaimer: string;
}

export interface RightsGuide {
  id: string;
  category: string;
  categoryHindi: string;
  title: string;
  titleHindi: string;
  summary: string;
  summaryHindi: string;
  keyPoints: string[];
  keyPointsHindi: string[];
  officialReference: string;
  officialSourceUrl: string;
  lastReviewedDate: string;
}

export interface EscalationResource {
  id: string;
  stepNumber: number;
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  authorityName: string;
  contactDetails: {
    helpline?: string;
    portalUrl?: string;
    address?: string;
  };
  officialSourceUrl: string;
  actionGuidance: string;
  actionGuidanceHindi: string;
}

export interface ReportData {
  reportId: string;
  generatedAt: string;
  language: 'hi' | 'en';
  branding: {
    product: string;
    tagline: string;
    reportTitle: string;
  };
  worker: {
    fullName: string;
    phone: string;
    workerType: string;
    skillLevel: string;
  };
  dateRange: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalWorkingDays: number;
    fullDays: number;
    halfDays: number;
    absentDays: number;
    totalEarnedPaise: number;
    totalEarnedRupees: number;
    totalPaymentsPaise: number;
    totalPaymentsRupees: number;
    totalAdvancesPaise: number;
    totalAdvancesRupees: number;
    totalReceiptsPaise: number;
    totalReceiptsRupees: number;
    netRecordedBalancePaise: number;
    netRecordedBalanceRupees: number;
    confirmedDays: number;
    disputedDays: number;
    pendingDays: number;
  };
  benchmarkReference?: {
    state: string;
    category: string;
    ratePerDayRupees: number;
    notificationRef: string;
    officialSource: string;
  } | null;
  jobs: Array<{
    id: string;
    jobTitle: string;
    contractorName: string;
    contractorPhone: string;
    workLocation?: string | null;
    agreedDailyRatePaise: number;
    workDays: Array<{
      id: string;
      workDate: string;
      status: string;
      dailyRateSnapshotPaise: number;
      earnedAmountPaise: number;
      overtimeMinutes: number;
      note?: string | null;
      confirmationStatus: string;
      disputeReason?: string | null;
    }>;
    ledgerEntries: Array<{
      id: string;
      type: string;
      amountPaise: number;
      paymentDate: string;
      paymentMode: string;
      note?: string | null;
    }>;
    totals: {
      jobEarnedPaise: number;
      jobPaymentsPaise: number;
      jobAdvancesPaise: number;
      jobReceiptsPaise: number;
      jobBalanceDuePaise: number;
    };
  }>;
  disclaimer: string;
}

export interface SharedReportAccess {
  id: string;
  userId: string;
  jobId?: string | null;
  helperName?: string | null;
  expiresAt: string;
  revokedAt?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
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
  requests?: ContractorConfirmationRequest[];
  request?: ContractorConfirmationRequest;
  shareUrl?: string;
  rules?: MinimumWageRule[];
  rule?: MinimumWageRule;
  report?: ReportData;
  guides?: RightsGuide[];
  resources?: EscalationResource[];
  accesses?: SharedReportAccess[];
  access?: SharedReportAccess;
}
