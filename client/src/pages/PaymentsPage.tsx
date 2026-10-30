import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { SectionHeader } from '../components/common/SectionHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { jobService } from '../services/jobService';
import { ledgerService, type CreateLedgerEntryDto, type UpdateLedgerEntryDto } from '../services/ledgerService';
import type { Job, LedgerEntry, LedgerSummary, LedgerEntryType, PaymentMode } from '../types';
import {
  Wallet,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Filter,
  ArrowDownLeft,
  Edit2,
  X,
  Receipt,
  PiggyBank,
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  // Data state
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [summary, setSummary] = useState<LedgerSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterJobId, setFilterJobId] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<'ALL' | LedgerEntryType>('ALL');
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [filterMonth, setFilterMonth] = useState<string>(currentMonthStr);

  // Record Transaction Modal State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [formJobId, setFormJobId] = useState<string>('');
  const [formType, setFormType] = useState<LedgerEntryType>('PAYMENT');
  const [formAmountRupees, setFormAmountRupees] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formMode, setFormMode] = useState<PaymentMode>('CASH');
  const [formNote, setFormNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit Transaction Modal State
  const [editingEntry, setEditingEntry] = useState<LedgerEntry | null>(null);
  const [editAmountRupees, setEditAmountRupees] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editMode, setEditMode] = useState<PaymentMode>('CASH');
  const [editNote, setEditNote] = useState<string>('');
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Fetch jobs
  useEffect(() => {
    async function loadJobs() {
      try {
        const jobs = await jobService.getJobs();
        const active = jobs.filter((j) => j.status === 'ACTIVE');
        setActiveJobs(active);
        if (active.length > 0 && !formJobId) {
          setFormJobId(active[0].id);
        }
      } catch (err: any) {
        console.error('Failed to load jobs:', err);
      }
    }
    loadJobs();
  }, []);

  // Fetch Ledger Data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (filterJobId !== 'ALL') params.jobId = filterJobId;
      if (filterType !== 'ALL') params.type = filterType;
      if (filterMonth) params.month = filterMonth;

      const [entryList, sum] = await Promise.all([
        ledgerService.getLedgerEntries(params),
        ledgerService.getLedgerSummary(filterJobId !== 'ALL' ? { jobId: filterJobId } : undefined),
      ]);

      setEntries(entryList);
      setSummary(sum);
    } catch (err: any) {
      setError(err.message || 'Failed to load ledger records');
    } finally {
      setIsLoading(false);
    }
  }, [filterJobId, filterType, filterMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Open Create Modal
  const handleOpenRecordModal = (defaultType: LedgerEntryType = 'PAYMENT') => {
    setFormType(defaultType);
    setFormAmountRupees('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormMode('CASH');
    setFormNote('');
    setFormError(null);
    if (activeJobs.length > 0 && !formJobId) {
      setFormJobId(activeJobs[0].id);
    }
    setIsRecordModalOpen(true);
  };

  // Submit Create Transaction
  const handleRecordTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJobId) {
      setFormError('Please select a job (काम चुनें)');
      return;
    }
    const amountNum = parseFloat(formAmountRupees);
    if (isNaN(amountNum) || amountNum <= 0) {
      setFormError('Please enter a valid amount greater than ₹0');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload: CreateLedgerEntryDto = {
        jobId: formJobId,
        type: formType,
        amountPaise: Math.round(amountNum * 100),
        paymentDate: formDate,
        paymentMode: formMode,
        note: formNote.trim() || undefined,
      };

      await ledgerService.recordEntry(payload);
      setIsRecordModalOpen(false);
      setSuccessMsg(
        `${formType === 'PAYMENT' ? 'भुगतान (Payment)' : 'खर्चा (Advance)'} of ₹${amountNum.toLocaleString('en-IN')} recorded successfully!`
      );
      fetchData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to record entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (entry: LedgerEntry) => {
    setEditingEntry(entry);
    setEditAmountRupees(String(Math.round(entry.amountPaise / 100)));
    setEditDate(entry.paymentDate.split('T')[0]);
    setEditMode(entry.paymentMode);
    setEditNote(entry.note || '');
    setEditError(null);
  };

  // Submit Edit Transaction
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    const amountNum = parseFloat(editAmountRupees);
    if (isNaN(amountNum) || amountNum <= 0) {
      setEditError('Please enter a valid amount greater than ₹0');
      return;
    }

    setIsEditSubmitting(true);
    setEditError(null);

    try {
      const payload: UpdateLedgerEntryDto = {
        amountPaise: Math.round(amountNum * 100),
        paymentDate: editDate,
        paymentMode: editMode,
        note: editNote.trim() || undefined,
      };

      await ledgerService.updateEntry(editingEntry.id, payload);
      setEditingEntry(null);
      fetchData();
    } catch (err: any) {
      setEditError(err.message || 'Failed to update entry');
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const paymentModeLabel = (mode: PaymentMode) => {
    switch (mode) {
      case 'CASH':
        return 'Cash (नकद)';
      case 'UPI':
        return 'UPI (फोनपे/गूगल पे)';
      case 'BANK_TRANSFER':
        return 'Bank Transfer (बैंक)';
      default:
        return 'Other (अन्य)';
    }
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <SectionHeader
        title="Payments & Advances"
        hindiTitle="खर्चा व भुगतान खाता"
        description="Track cash advances ('kharcha') and wage payments received from contractors, with verified balance computation."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenRecordModal('ADVANCE')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition shadow-xs"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              + Record Advance (खर्चा)
            </button>
            <button
              onClick={() => handleOpenRecordModal('PAYMENT')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-forest hover:bg-forest-dark rounded-lg transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              + Record Payment (भुगतान)
            </button>
          </div>
        }
      />

      {/* Success Notification */}
      {successMsg && (
        <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Financial Health Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Earned */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-medium">Total Earned</span>
              <Receipt className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-[11px] font-devanagari text-gray-400">कुल कमाई (हाजिरी से)</p>
            <div className="text-xl font-bold text-gray-900 mt-1">
              ₹{(summary.totalEarnedPaise / 100).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Payments Received */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between text-emerald-700 mb-1">
              <span className="text-xs font-medium">Payments Received</span>
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[11px] font-devanagari text-gray-400">भुगतान मिला</p>
            <div className="text-xl font-bold text-emerald-700 mt-1">
              ₹{(summary.totalPaymentsPaise / 100).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Advances Taken */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between text-amber-800 mb-1">
              <span className="text-xs font-medium">Advances (Kharcha)</span>
              <PiggyBank className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-[11px] font-devanagari text-gray-400">लिया गया खर्चा / पेशगी</p>
            <div className="text-xl font-bold text-amber-800 mt-1">
              ₹{(summary.totalAdvancesPaise / 100).toLocaleString('en-IN')}
            </div>
          </div>

          {/* Outstanding Balance */}
          <div className="bg-white p-4 rounded-xl border border-forest-200/80 shadow-xs bg-gradient-to-br from-forest-50/50 to-white">
            <div className="flex items-center justify-between text-forest mb-1">
              <span className="text-xs font-semibold">Outstanding Due</span>
              <Wallet className="w-4 h-4 text-forest" />
            </div>
            <p className="text-[11px] font-devanagari text-gray-500">कुल बकाया राशि</p>
            <div className="text-xl font-bold text-forest mt-1">
              ₹{(summary.outstandingBalancePaise / 100).toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">
              (खर्चा काटने के बाद शुद्ध शेष)
            </p>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-semibold text-gray-800">Filter Ledger:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Job filter */}
          <select
            value={filterJobId}
            onChange={(e) => setFilterJobId(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-forest text-gray-700"
          >
            <option value="ALL">All Jobs (सभी काम)</option>
            {activeJobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.jobTitle}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-forest text-gray-700"
          >
            <option value="ALL">All Transactions</option>
            <option value="PAYMENT">Payments Only (भुगतान)</option>
            <option value="ADVANCE">Advances Only (खर्चा)</option>
          </select>

          {/* Month filter */}
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-forest text-gray-700"
          />

          <button
            onClick={() => fetchData()}
            disabled={isLoading}
            className="p-1.5 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Ledger Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Transaction Receipts</h3>
            <p className="text-xs font-devanagari text-gray-500">रुपये के लेन-देन का प्रमाण</p>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {entries.length} records found
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin text-forest mb-2" />
            <p className="text-xs">Loading ledger entries...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-rose-600">
            <AlertCircle className="w-6 h-6 mx-auto mb-2" />
            <p className="text-xs">{error}</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <Wallet className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-700">No payment or advance entries recorded</p>
            <p className="text-[11px] font-devanagari text-gray-400 mt-0.5">
              ठेकेदार से मिला भुगतान या खर्चा दर्ज करने के लिए ऊपर दिए बटन पर क्लिक करें।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50/80 text-[11px] font-medium text-gray-500 uppercase border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Date (तारीख)</th>
                  <th className="py-3 px-4">Job & Contractor</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Payment Mode</th>
                  <th className="py-3 px-4 text-right">Amount (रुपये)</th>
                  <th className="py-3 px-4">Notes / Purpose</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.map((entry) => {
                  const formattedDate = new Date(entry.paymentDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                  const isPayment = entry.type === 'PAYMENT';

                  return (
                    <tr key={entry.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900 block">
                          {entry.job?.jobTitle || 'Job'}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {entry.job?.contractorName}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          status={isPayment ? 'paid' : 'advance'}
                          label={isPayment ? 'Payment' : 'Advance'}
                          hindiLabel={isPayment ? 'भुगतान' : 'खर्चा'}
                          size="sm"
                        />
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-600">
                        {paymentModeLabel(entry.paymentMode)}
                      </td>
                      <td
                        className={`py-3 px-4 text-right whitespace-nowrap font-bold text-sm ${
                          isPayment ? 'text-emerald-700' : 'text-amber-800'
                        }`}
                      >
                        ₹{(entry.amountPaise / 100).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 max-w-[200px] truncate text-gray-600">
                        {entry.note || '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleOpenEditModal(entry)}
                          className="p-1.5 text-gray-500 hover:text-forest hover:bg-forest-50 rounded transition"
                          title="Edit Transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Transaction Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {formType === 'PAYMENT' ? 'Record Payment' : 'Record Cash Advance'}
                </h3>
                <p className="text-xs text-gray-500 font-devanagari">
                  {formType === 'PAYMENT' ? 'मजदूरी / भुगतान दर्ज करें' : 'खर्चा / पेशगी दर्ज करें'}
                </p>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="m-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleRecordTransaction} className="p-4 space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Transaction Type <span className="font-devanagari text-gray-500">(प्रकार)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('PAYMENT')}
                    className={`p-2.5 rounded-lg border text-center transition ${
                      formType === 'PAYMENT'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-xs font-medium">Payment Received</span>
                    <span className="text-[10px] font-devanagari text-gray-500">भुगतान मिला</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('ADVANCE')}
                    className={`p-2.5 rounded-lg border text-center transition ${
                      formType === 'ADVANCE'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 font-semibold'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-xs font-medium">Advance / Kharcha</span>
                    <span className="text-[10px] font-devanagari text-gray-500">खर्चा / पेशगी लिया</span>
                  </button>
                </div>
              </div>

              {/* Job Selector */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Job <span className="font-devanagari text-gray-500">(काम)</span>
                </label>
                <select
                  value={formJobId}
                  onChange={(e) => setFormJobId(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest bg-white"
                >
                  {activeJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.jobTitle} • {j.contractorName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount in Rupees */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Amount in Rupees (₹) <span className="font-devanagari text-gray-500">(रुपये)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400 font-semibold">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={formAmountRupees}
                    onChange={(e) => setFormAmountRupees(e.target.value)}
                    placeholder="e.g. 2000"
                    className="w-full text-xs pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>
              </div>

              {/* Date & Mode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date <span className="font-devanagari text-gray-500">(तारीख)</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Mode <span className="font-devanagari text-gray-500">(माध्यम)</span>
                  </label>
                  <select
                    value={formMode}
                    onChange={(e) => setFormMode(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest bg-white"
                  >
                    <option value="CASH">Cash (नकद)</option>
                    <option value="UPI">UPI (Google Pay / PhonePe)</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* Note / Purpose */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Purpose / Note <span className="font-devanagari text-gray-500">(टिप्पणी या कारण)</span>
                </label>
                <input
                  type="text"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder={
                    formType === 'ADVANCE'
                      ? 'e.g. For family medicine, grocery ration...'
                      : 'e.g. Weekly Saturday wage payment...'
                  }
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-xs font-medium text-white rounded-lg transition disabled:opacity-50 ${
                    formType === 'PAYMENT'
                      ? 'bg-forest hover:bg-forest-dark'
                      : 'bg-amber-700 hover:bg-amber-800'
                  }`}
                >
                  {isSubmitting ? 'Saving...' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Update Transaction</h3>
                <p className="text-xs text-gray-500 font-devanagari">
                  {editingEntry.type === 'PAYMENT' ? 'भुगतान रिकॉर्ड अपडेट करें' : 'खर्चा रिकॉर्ड अपडेट करें'} •{' '}
                  {editingEntry.job?.jobTitle}
                </p>
              </div>
              <button
                onClick={() => setEditingEntry(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="m-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="p-4 space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Amount in Rupees (₹) <span className="font-devanagari text-gray-500">(रुपये)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400 font-semibold">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={editAmountRupees}
                    onChange={(e) => setEditAmountRupees(e.target.value)}
                    className="w-full text-xs pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>
              </div>

              {/* Date & Mode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date <span className="font-devanagari text-gray-500">(तारीख)</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Mode <span className="font-devanagari text-gray-500">(माध्यम)</span>
                  </label>
                  <select
                    value={editMode}
                    onChange={(e) => setEditMode(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest bg-white"
                  >
                    <option value="CASH">Cash (नकद)</option>
                    <option value="UPI">UPI (Google Pay / PhonePe)</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Note <span className="font-devanagari text-gray-500">(टिप्पणी)</span>
                </label>
                <input
                  type="text"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditSubmitting}
                  className="px-4 py-2 text-xs font-medium text-white bg-forest hover:bg-forest-dark rounded-lg transition disabled:opacity-50"
                >
                  {isEditSubmitting ? 'Saving...' : 'Update Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
