import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { SectionHeader } from '../components/common/SectionHeader';
import { jobService } from '../services/jobService';
import { reportService, helperService } from '../services/phase4Service';
import type { Job, ReportData } from '../types';
import {
  Share2,
  Printer,
  RefreshCw,
  CheckCircle2,
  Users,
  Copy,
  X,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');

  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper Access Modal
  const [isHelperModalOpen, setIsHelperModalOpen] = useState(false);
  const [helperName, setHelperName] = useState('');
  const [helperExpiry, setHelperExpiry] = useState(7);
  const [helperShareUrl, setHelperShareUrl] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const fetchReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reportService.getReportData({
        jobId: selectedJobId !== 'ALL' ? selectedJobId : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        language,
      });
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate report.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function loadJobs() {
      try {
        const list = await jobService.getJobs();
        setJobs(list);
      } catch (e) {
        console.error(e);
      }
    }
    loadJobs();
    fetchReport();
  }, [selectedJobId, language]);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    if (!report) return;
    const msg = `*MehnatNama (मेहनतनामा) Wage & Dues Statement*\nWorker: ${report.worker.fullName}\nTotal Days: ${report.summary.totalWorkingDays} days\nTotal Earned: ₹${report.summary.totalEarnedRupees.toLocaleString('en-IN')}\nPayments Received: ₹${report.summary.totalReceiptsRupees.toLocaleString('en-IN')}\n*Net Outstanding Balance: ₹${report.summary.netRecordedBalanceRupees.toLocaleString('en-IN')}*\nGenerated via MehnatNama.`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleCreateHelperAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await helperService.createAccess({
        jobId: selectedJobId !== 'ALL' ? selectedJobId : undefined,
        helperName: helperName.trim() || undefined,
        expiryDays: Number(helperExpiry),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      const fullUrl = `${window.location.origin}${res.shareUrl}`;
      setHelperShareUrl(fullUrl);
    } catch (err: any) {
      alert(err.message || 'Failed to generate helper link');
    }
  };

  return (
    <PageContainer>
      <div className="print:hidden">
        <SectionHeader
          title="My Reports & Wage Statement"
          hindiTitle="मेहनतनामा हिसाब पर्चा"
          description="Print-ready, verifiable bilingual wage statement. Summarizes daily attendance records, cash advances, payments, and contractor verification."
          action={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsHelperModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-xs"
              >
                <Users className="w-3.5 h-3.5 text-forest" />
                Share with Volunteer / Helper
              </button>
              <button
                onClick={handleWhatsAppShare}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                WhatsApp Share
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-forest hover:bg-forest-dark rounded-lg transition shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Download PDF
              </button>
            </div>
          }
        />

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Job Filter */}
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-forest"
            >
              <option value="ALL">All Jobs & Worksites (सभी काम)</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.jobTitle}
                </option>
              ))}
            </select>

            {/* Date Range */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white"
              title="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white"
              title="End Date"
            />

            {/* Language Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded font-semibold transition ${
                  language === 'hi' ? 'bg-white text-forest shadow-xs' : 'text-gray-600'
                }`}
              >
                हिंदी (Hindi)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded font-semibold transition ${
                  language === 'en' ? 'bg-white text-forest shadow-xs' : 'text-gray-600'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={fetchReport}
              className="p-1.5 text-gray-500 hover:text-gray-800 border border-gray-300 rounded-lg"
              title="Regenerate"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Printable Statement Container */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center text-gray-500">
          <RefreshCw className="w-8 h-8 animate-spin text-forest mx-auto mb-3" />
          <p className="text-xs font-semibold">Compiling statement records...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-rose-200 p-6 text-center text-rose-700 text-xs">
          {error}
        </div>
      ) : report ? (
        <div
          ref={printRef}
          className="bg-white rounded-2xl border border-gray-300 shadow-sm p-8 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 space-y-6"
        >
          {/* Header */}
          <div className="border-b-2 border-forest pb-5 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-forest text-white flex items-center justify-center font-bold text-sm">
                  म
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">MehnatNama (मेहनतनामा)</h1>
                  <p className="text-[11px] font-devanagari text-forest font-semibold">
                    हर दिन का काम। हर रुपये का हिसाब।
                  </p>
                </div>
              </div>
              <h2 className="text-sm font-bold text-gray-800 mt-3">{report.branding.reportTitle}</h2>
              <span className="text-[10px] text-gray-500 font-mono">Statement ID: {report.reportId}</span>
            </div>

            <div className="text-right text-xs">
              <span className="text-gray-400 block text-[10px]">Worker Profile:</span>
              <span className="font-bold text-gray-900 text-sm block">{report.worker.fullName}</span>
              <span className="text-gray-600 block">{report.worker.phone}</span>
              <span className="text-gray-500 text-[11px]">{report.worker.workerType} ({report.worker.skillLevel})</span>
              <span className="text-gray-400 text-[10px] block mt-1">
                Generated: {new Date(report.generatedAt).toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>

          {/* High-Level Financial Summary */}
          <div className="grid grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Days Worked</span>
              <span className="text-lg font-bold text-gray-900">{report.summary.totalWorkingDays}</span>
              <span className="text-[10px] text-gray-400 block">
                ({report.summary.fullDays} full / {report.summary.halfDays} half)
              </span>
            </div>

            <div>
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Total Earned</span>
              <span className="text-lg font-bold text-forest">
                ₹{report.summary.totalEarnedRupees.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-gray-400 block">Gross wages</span>
            </div>

            <div>
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Total Receipts</span>
              <span className="text-lg font-bold text-emerald-800">
                ₹{report.summary.totalReceiptsRupees.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-gray-400 block">
                (Pay: ₹{report.summary.totalPaymentsRupees} + Adv: ₹{report.summary.totalAdvancesRupees})
              </span>
            </div>

            <div className="bg-forest-50/80 rounded-lg p-1 border border-forest-200">
              <span className="text-[10px] text-forest uppercase font-bold block">Net Balance Due</span>
              <span className="text-lg font-bold text-forest">
                ₹{report.summary.netRecordedBalanceRupees.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-forest/80 font-medium block">कुल बकाया राशि</span>
            </div>
          </div>

          {/* Verification Badge Ribbon */}
          <div className="flex items-center justify-between text-xs px-4 py-2 bg-slate-50 border border-gray-200 rounded-lg">
            <span className="text-gray-600 font-semibold">Contractor Verification Status:</span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-800 font-bold">
                ✓ {report.summary.confirmedDays} Confirmed (सत्यापित)
              </span>
              {report.summary.disputedDays > 0 && (
                <span className="text-amber-800 font-bold">
                  ✗ {report.summary.disputedDays} Disputed (आपत्ति)
                </span>
              )}
              {report.summary.pendingDays > 0 && (
                <span className="text-gray-500">
                  ○ {report.summary.pendingDays} Awaiting Contractor
                </span>
              )}
            </div>
          </div>

          {/* Detailed Job Tables */}
          {report.jobs.map((job) => (
            <div key={job.id} className="space-y-3">
              <div className="flex justify-between items-center bg-gray-100/80 px-4 py-2 rounded-lg text-xs">
                <div>
                  <span className="font-bold text-gray-900">{job.jobTitle}</span>
                  <span className="text-gray-500 ml-2">
                    (Contractor: {job.contractorName} • {job.contractorPhone} • Agreed Rate: ₹{job.agreedDailyRatePaise / 100}/day)
                  </span>
                </div>
                <span className="font-bold text-forest">
                  Job Balance: ₹{job.totals.jobBalanceDuePaise / 100}
                </span>
              </div>

              {/* Attendance Table */}
              <table className="w-full text-left text-xs text-gray-700 border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 text-[10px] uppercase font-semibold text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="py-2 px-3">Date (तारीख)</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Daily Rate</th>
                    <th className="py-2 px-3 text-right">Earned Wage</th>
                    <th className="py-2 px-3">Verification</th>
                    <th className="py-2 px-3">Work Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {job.workDays.map((wd) => (
                    <tr key={wd.id}>
                      <td className="py-2 px-3 font-medium text-gray-900 whitespace-nowrap">
                        {wd.workDate}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            wd.status === 'FULL_DAY'
                              ? 'bg-emerald-50 text-emerald-800'
                              : wd.status === 'HALF_DAY'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {wd.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right whitespace-nowrap text-gray-500">
                        ₹{wd.dailyRateSnapshotPaise / 100}
                      </td>
                      <td className="py-2 px-3 text-right whitespace-nowrap font-bold text-forest">
                        ₹{wd.earnedAmountPaise / 100}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            wd.confirmationStatus === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-900 font-bold'
                              : wd.confirmationStatus === 'DISPUTED'
                              ? 'bg-amber-100 text-amber-900 font-bold'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {wd.confirmationStatus}
                        </span>
                        {wd.disputeReason && (
                          <span className="text-[10px] text-amber-800 block italic">
                            ({wd.disputeReason})
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-gray-500 text-[11px] truncate max-w-[200px]">
                        {wd.note || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Payments & Advances on this job */}
              {job.ledgerEntries.length > 0 && (
                <div className="bg-gray-50/60 p-3 rounded-lg border border-gray-200 text-xs">
                  <span className="font-semibold text-gray-700 block mb-1">
                    Recorded Payments & Advances (भुगतान व खर्चा):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {job.ledgerEntries.map((l) => (
                      <div key={l.id} className="flex justify-between p-1.5 bg-white rounded border border-gray-200 text-[11px]">
                        <span>
                          {l.paymentDate} •{' '}
                          <strong className={l.type === 'PAYMENT' ? 'text-emerald-700' : 'text-amber-800'}>
                            {l.type} ({l.paymentMode})
                          </strong>
                        </span>
                        <span className="font-bold">₹{l.amountPaise / 100}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Statutory Benchmark Reference Box */}
          {report.benchmarkReference && (
            <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-gray-900 block">
                Statutory Gazette Benchmark Reference (सरकारी न्यूनतम संदर्भ):
              </span>
              <p className="text-gray-600">
                Official minimum wage notified for {report.benchmarkReference.state} ({report.benchmarkReference.category}) is{' '}
                <strong className="text-forest">₹{report.benchmarkReference.ratePerDayRupees}/day</strong> under{' '}
                <span className="font-mono">{report.benchmarkReference.notificationRef}</span>.
              </p>
            </div>
          )}

          {/* Endorsement & Signature Section for Formal Use */}
          <div className="pt-8 border-t border-gray-200 grid grid-cols-2 gap-8 text-xs text-gray-700">
            <div className="border-t border-gray-400 pt-2 text-center">
              <span className="font-semibold block">{report.worker.fullName}</span>
              <span className="text-[10px] text-gray-400">Worker Signature / कामगार के हस्ताक्षर</span>
            </div>

            <div className="border-t border-gray-400 pt-2 text-center">
              <span className="font-semibold block">Contractor / Site In-charge</span>
              <span className="text-[10px] text-gray-400">ठेकेदार / नियोक्ता के हस्ताक्षर</span>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="pt-4 border-t border-gray-100 text-[10px] text-gray-400 text-center leading-relaxed">
            {report.disclaimer}
          </div>
        </div>
      ) : null}

      {/* Helper Access Modal */}
      {isHelperModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Share Read-Only Report Access</h3>
                <p className="text-xs text-gray-500 font-devanagari">
                  सहायक / स्वयंसेवक के लिए सुरक्षित लिंक बनाएं
                </p>
              </div>
              <button
                onClick={() => setIsHelperModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {helperShareUrl ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Helper Link Ready</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    This link provides read-only access to this report without exposing your PIN or account.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 break-all select-all font-mono">
                  {helperShareUrl}
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(helperShareUrl);
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 3000);
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-forest hover:bg-forest-dark text-white text-xs font-semibold rounded-lg transition shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copySuccess ? 'Copied to Clipboard!' : 'Copy Helper Link'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateHelperAccess} className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Helper / Volunteer Name (सहायक का नाम)
                  </label>
                  <input
                    type="text"
                    value={helperName}
                    onChange={(e) => setHelperName(e.target.value)}
                    placeholder="e.g. Ramesh Social Worker, Legal Aid Clinic"
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Link Validity (वैधता)
                  </label>
                  <select
                    value={helperExpiry}
                    onChange={(e) => setHelperExpiry(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest bg-white"
                  >
                    <option value={3}>3 Days</option>
                    <option value={7}>7 Days (1 Week - Recommended)</option>
                    <option value={14}>14 Days</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsHelperModalOpen(false)}
                    className="px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-forest hover:bg-forest-dark rounded-lg transition"
                  >
                    Generate Helper Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
};
