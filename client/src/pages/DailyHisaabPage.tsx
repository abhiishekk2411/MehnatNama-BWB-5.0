import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { SectionHeader } from '../components/common/SectionHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { jobService } from '../services/jobService';
import { workdayService, type CreateWorkDayDto, type UpdateWorkDayDto } from '../services/workdayService';
import type { Job, WorkDay, WorkDaySummary, WorkDayStatus } from '../types';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  RefreshCw,
  Plus,
  Edit2,
  X,
  Sun,
  Sunset,
  UserX,
  Filter,
} from 'lucide-react';

export const DailyHisaabPage: React.FC = () => {
  // Data state
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [workdays, setWorkdays] = useState<WorkDay[]>([]);
  const [summary, setSummary] = useState<WorkDaySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State for Logger
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [workDate, setWorkDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<WorkDayStatus>('FULL_DAY');
  const [overtimeMinutes, setOvertimeMinutes] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Filter State
  const [filterJobId, setFilterJobId] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | WorkDayStatus>('ALL');
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [filterMonth, setFilterMonth] = useState<string>(currentMonthStr);

  // Edit Modal State
  const [editingWorkday, setEditingWorkday] = useState<WorkDay | null>(null);
  const [editStatus, setEditStatus] = useState<WorkDayStatus>('FULL_DAY');
  const [editOvertime, setEditOvertime] = useState<number>(0);
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
        if (active.length > 0 && !selectedJobId) {
          setSelectedJobId(active[0].id);
        }
      } catch (err: any) {
        console.error('Failed to load jobs:', err);
      }
    }
    loadJobs();
  }, []);

  // Fetch Workdays & Summary
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (filterJobId !== 'ALL') params.jobId = filterJobId;
      if (filterStatus !== 'ALL') params.status = filterStatus;
      if (filterMonth) params.month = filterMonth;

      const [entries, sum] = await Promise.all([
        workdayService.getWorkdays(params),
        workdayService.getWorkdaysSummary(params),
      ]);

      setWorkdays(entries);
      setSummary(sum);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch workday data');
    } finally {
      setIsLoading(false);
    }
  }, [filterJobId, filterStatus, filterMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Selected job helper
  const selectedJob = activeJobs.find((j) => j.id === selectedJobId);
  const dailyRatePaise = selectedJob?.agreedDailyRatePaise || 0;
  const calculatedWagePaise =
    status === 'FULL_DAY'
      ? dailyRatePaise
      : status === 'HALF_DAY'
      ? Math.round(dailyRatePaise / 2)
      : 0;

  // Handle Log Attendance
  const handleLogAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) {
      setFormError('Please select a job (कृपया काम चुनें)');
      return;
    }
    if (!workDate) {
      setFormError('Please select a date (कृपया तारीख चुनें)');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const payload: CreateWorkDayDto = {
        jobId: selectedJobId,
        workDate,
        status,
        overtimeMinutes: Number(overtimeMinutes) || 0,
        note: note.trim() || undefined,
      };

      await workdayService.recordWorkday(payload);
      setFormSuccess(
        `हाजिरी दर्ज हो गई! (Attendance logged: ₹${(calculatedWagePaise / 100).toLocaleString('en-IN')})`
      );
      setNote('');
      setOvertimeMinutes(0);
      fetchData();

      setTimeout(() => {
        setFormSuccess(null);
      }, 4000);
    } catch (err: any) {
      if (err.message && err.message.includes('already exists')) {
        setFormError('इस तारीख की हाजिरी पहले से दर्ज है। आप नीचे सूची में इसे बदल सकते हैं। (Attendance already logged for this date. Edit it below.)');
      } else {
        setFormError(err.message || 'हाजिरी दर्ज करने में त्रुटि (Failed to record attendance)');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (wd: WorkDay) => {
    setEditingWorkday(wd);
    setEditStatus(wd.status);
    setEditOvertime(wd.overtimeMinutes);
    setEditNote(wd.note || '');
    setEditError(null);
  };

  // Handle Edit Submit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkday) return;

    setIsEditSubmitting(true);
    setEditError(null);

    try {
      const payload: UpdateWorkDayDto = {
        status: editStatus,
        overtimeMinutes: Number(editOvertime) || 0,
        note: editNote.trim() || undefined,
      };

      await workdayService.updateWorkday(editingWorkday.id, payload);
      setEditingWorkday(null);
      fetchData();
    } catch (err: any) {
      setEditError(err.message || 'Failed to update attendance');
    } finally {
      setIsEditSubmitting(false);
    }
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <SectionHeader
        title="Daily Hisaab"
        hindiTitle="दैनिक हाजिरी व दिहाड़ी"
        description="Quick 15-second daily attendance logger. Keep tamper-proof records of daily wages and workdays."
        action={
          <button
            onClick={() => fetchData()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        }
      />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column: Quick Attendance Logger Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs sticky top-20">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-forest-50 border border-forest-200 flex items-center justify-center text-forest">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Log Attendance</h3>
                  <p className="text-xs font-devanagari text-gray-500">हाजिरी दर्ज करें</p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-forest bg-forest-50 px-2 py-0.5 rounded-full border border-forest-200">
                15 Sec Entry
              </span>
            </div>

            {formSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{formSuccess}</span>
              </div>
            )}

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {activeJobs.length === 0 ? (
              <div className="text-center py-6 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">No active jobs found</p>
                <p className="text-[11px] text-gray-500 font-devanagari mt-0.5 mb-3">
                  हाजिरी लगाने के लिए पहले एक सक्रिय काम जोड़ें
                </p>
                <a
                  href="/jobs"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest text-white rounded-lg text-xs font-medium hover:bg-forest-dark transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Job (काम जोड़ें)
                </a>
              </div>
            ) : (
              <form onSubmit={handleLogAttendance} className="space-y-4">
                {/* Job Selection */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Select Job <span className="font-devanagari text-gray-500">(काम चुनें)</span>
                  </label>
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest focus:border-forest bg-white"
                  >
                    {activeJobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.jobTitle} • {j.contractorName} (₹{j.agreedDailyRatePaise / 100}/day)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Work Date <span className="font-devanagari text-gray-500">(तारीख)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={workDate}
                      onChange={(e) => setWorkDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest focus:border-forest"
                    />
                  </div>
                </div>

                {/* Status Picker: 3 Big Interactive Cards */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Attendance Type <span className="font-devanagari text-gray-500">(हाजिरी प्रकार)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Full Day */}
                    <button
                      type="button"
                      onClick={() => setStatus('FULL_DAY')}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition ${
                        status === 'FULL_DAY'
                          ? 'bg-forest-50 border-forest text-forest font-semibold shadow-xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Sun className="w-5 h-5 mb-1 text-forest" />
                      <span className="text-xs font-medium">Full Day</span>
                      <span className="text-[10px] font-devanagari text-gray-500">पूरा दिन</span>
                    </button>

                    {/* Half Day */}
                    <button
                      type="button"
                      onClick={() => setStatus('HALF_DAY')}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition ${
                        status === 'HALF_DAY'
                          ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold shadow-xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Sunset className="w-5 h-5 mb-1 text-amber-600" />
                      <span className="text-xs font-medium">Half Day</span>
                      <span className="text-[10px] font-devanagari text-gray-500">आधा दिन</span>
                    </button>

                    {/* Absent */}
                    <button
                      type="button"
                      onClick={() => setStatus('ABSENT')}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition ${
                        status === 'ABSENT'
                          ? 'bg-rose-50 border-rose-500 text-rose-900 font-semibold shadow-xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <UserX className="w-5 h-5 mb-1 text-rose-600" />
                      <span className="text-xs font-medium">Absent</span>
                      <span className="text-[10px] font-devanagari text-gray-500">छुट्टी</span>
                    </button>
                  </div>
                </div>

                {/* Live Wage Preview Card */}
                <div className="bg-forest-50/70 border border-forest-200 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-600 font-medium">Wage for Today:</span>
                    <p className="text-[10px] font-devanagari text-gray-500">आज की बनने वाली दिहाड़ी</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-forest">
                      ₹{(calculatedWagePaise / 100).toLocaleString('en-IN')}
                    </span>
                    <p className="text-[10px] text-gray-500">
                      {status === 'FULL_DAY' ? '100% Rate' : status === 'HALF_DAY' ? '50% Rate' : '₹0'}
                    </p>
                  </div>
                </div>

                {/* Overtime (optional) */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Overtime in Minutes <span className="font-devanagari text-gray-500">(अतिरिक्त समय)</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 mb-1.5">
                    {[0, 60, 120, 180].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setOvertimeMinutes(mins)}
                        className={`py-1 text-[11px] rounded border transition ${
                          overtimeMinutes === mins
                            ? 'bg-forest text-white border-forest'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {mins === 0 ? 'None' : `${mins / 60}h`}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="15"
                      value={overtimeMinutes}
                      onChange={(e) => setOvertimeMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="e.g. 60 min"
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest focus:border-forest"
                    />
                    <span className="absolute right-3 top-2 text-[11px] text-gray-400">mins</span>
                  </div>
                </div>

                {/* Note / Task Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Work Note / Details <span className="font-devanagari text-gray-500">(काम का विवरण)</span>
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. 3rd floor slab casting, plaster work..."
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest focus:border-forest"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-forest hover:bg-forest-dark text-white font-medium text-xs rounded-lg transition shadow-xs focus:ring-2 focus:ring-offset-1 focus:ring-forest disabled:opacity-50"
                >
                  <CalendarCheck className="w-4 h-4" />
                  {isSubmitting ? 'दर्ज कर रहे हैं...' : 'हाजिरी दर्ज करें (Save Attendance)'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Summary Cards & Timesheet History Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Ribbon */}
          {summary && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
                <span className="text-[11px] font-medium text-gray-500">Days Logged</span>
                <p className="text-[10px] font-devanagari text-gray-400">कुल दर्ज दिन</p>
                <div className="text-xl font-bold text-gray-900 mt-1">
                  {summary.totalDays ?? summary.totalDaysWorked}
                  <span className="text-xs font-normal text-gray-500 ml-1">days</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
                <span className="text-[11px] font-medium text-forest">Total Earned</span>
                <p className="text-[10px] font-devanagari text-gray-400">कुल कमाई</p>
                <div className="text-xl font-bold text-forest mt-1">
                  ₹{(summary.totalEarnedPaise / 100).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
                <span className="text-[11px] font-medium text-gray-500">Full / Half Days</span>
                <p className="text-[10px] font-devanagari text-gray-400">पूरा / आधा दिन</p>
                <div className="text-xl font-bold text-gray-900 mt-1">
                  <span className="text-forest">{summary.fullDays}</span>
                  <span className="text-gray-300 mx-1">/</span>
                  <span className="text-amber-600">{summary.halfDays}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
                <span className="text-[11px] font-medium text-gray-500">Overtime Recorded</span>
                <p className="text-[10px] font-devanagari text-gray-400">अतिरिक्त काम</p>
                <div className="text-xl font-bold text-gray-900 mt-1">
                  {Math.round(summary.totalOvertimeMinutes / 60)}
                  <span className="text-xs font-normal text-gray-500 ml-1">hrs</span>
                </div>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-800">Filter History:</span>
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

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="text-xs px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-forest text-gray-700"
              >
                <option value="ALL">All Status</option>
                <option value="FULL_DAY">Full Day (पूरा दिन)</option>
                <option value="HALF_DAY">Half Day (आधा दिन)</option>
                <option value="ABSENT">Absent (छुट्टी)</option>
              </select>

              {/* Month selector */}
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-forest text-gray-700"
              />
            </div>
          </div>

          {/* Timesheet Log Table */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Attendance Log & History</h3>
                <p className="text-xs font-devanagari text-gray-500">हाजिरी व कमाई का ब्यौरा</p>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {workdays.length} entries found
              </span>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                <RefreshCw className="w-6 h-6 animate-spin text-forest mb-2" />
                <p className="text-xs">Loading attendance records...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-rose-600">
                <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs">{error}</p>
              </div>
            ) : workdays.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <CalendarCheck className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">No attendance entries recorded</p>
                <p className="text-[11px] font-devanagari text-gray-400 mt-0.5">
                  बाईं तरफ के फॉर्म से अपनी आज की हाजिरी दर्ज करें।
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-gray-50/80 text-[11px] font-medium text-gray-500 uppercase border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-4">Date (तारीख)</th>
                      <th className="py-3 px-4">Job & Contractor</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Daily Rate</th>
                      <th className="py-3 px-4 text-right">Earned Wage</th>
                      <th className="py-3 px-4">Note / OT</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {workdays.map((wd) => {
                      const formattedDate = new Date(wd.workDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      });
                      const badgeStatus =
                        wd.status === 'FULL_DAY'
                          ? 'full-day'
                          : wd.status === 'HALF_DAY'
                          ? 'half-day'
                          : 'absent';

                      return (
                        <tr key={wd.id} className="hover:bg-gray-50/60 transition">
                          <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                            {formattedDate}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-gray-900 block">
                              {wd.job?.jobTitle || 'Job'}
                            </span>
                            <span className="text-[11px] text-gray-500">
                              {wd.job?.contractorName}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={badgeStatus} size="sm" />
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap text-gray-500">
                            ₹{(wd.dailyRateSnapshotPaise / 100).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap font-bold text-forest">
                            ₹{(wd.earnedAmountPaise / 100).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 max-w-[160px] truncate">
                            {wd.overtimeMinutes > 0 && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mr-1.5">
                                <Clock className="w-2.5 h-2.5" />
                                +{wd.overtimeMinutes}m
                              </span>
                            )}
                            <span className="text-gray-600 text-[11px]">
                              {wd.note || '—'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleOpenEdit(wd)}
                              className="p-1.5 text-gray-500 hover:text-forest hover:bg-forest-50 rounded transition"
                              title="Edit Entry"
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
        </div>
      </div>

      {/* Edit Workday Modal */}
      {editingWorkday && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Update Attendance Record</h3>
                <p className="text-xs text-gray-500 font-devanagari">
                  {new Date(editingWorkday.workDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  • {editingWorkday.job?.jobTitle}
                </p>
              </div>
              <button
                onClick={() => setEditingWorkday(null)}
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
              {/* Status Picker */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Attendance Status <span className="font-devanagari text-gray-500">(हाजिरी स्थिति)</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStatus('FULL_DAY')}
                    className={`p-2.5 rounded-lg border text-center transition ${
                      editStatus === 'FULL_DAY'
                        ? 'bg-forest-50 border-forest text-forest font-semibold'
                        : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    <span className="block text-xs font-medium">Full Day</span>
                    <span className="text-[10px] text-gray-500">₹{editingWorkday.dailyRateSnapshotPaise / 100}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditStatus('HALF_DAY')}
                    className={`p-2.5 rounded-lg border text-center transition ${
                      editStatus === 'HALF_DAY'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold'
                        : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    <span className="block text-xs font-medium">Half Day</span>
                    <span className="text-[10px] text-gray-500">₹{Math.round(editingWorkday.dailyRateSnapshotPaise / 200)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditStatus('ABSENT')}
                    className={`p-2.5 rounded-lg border text-center transition ${
                      editStatus === 'ABSENT'
                        ? 'bg-rose-50 border-rose-500 text-rose-900 font-semibold'
                        : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    <span className="block text-xs font-medium">Absent</span>
                    <span className="text-[10px] text-gray-500">₹0</span>
                  </button>
                </div>
              </div>

              {/* Overtime */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Overtime in Minutes <span className="font-devanagari text-gray-500">(अतिरिक्त समय)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="15"
                  value={editOvertime}
                  onChange={(e) => setEditOvertime(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                />
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
                  onClick={() => setEditingWorkday(null)}
                  className="px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditSubmitting}
                  className="px-4 py-2 text-xs font-medium text-white bg-forest hover:bg-forest-dark rounded-lg transition disabled:opacity-50"
                >
                  {isEditSubmitting ? 'Saving...' : 'Update Attendance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
