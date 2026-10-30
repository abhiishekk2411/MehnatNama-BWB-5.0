import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { helperService } from '../../services/phase4Service';
import { RefreshCw, AlertCircle } from 'lucide-react';

export const PublicSharedReportPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadReport() {
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        const result = await helperService.getPublicSharedReport(token);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Shared report link is invalid or expired.');
      } finally {
        setIsLoading(false);
      }
    }
    loadReport();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-forest mx-auto mb-3" />
          <h2 className="text-sm font-semibold text-gray-900">Loading Shared Wage Statement...</h2>
          <p className="text-xs text-gray-500 font-devanagari mt-1">हिसाब पर्चा लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-gray-200 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-gray-900">Link Unavailable / लिंक समाप्त</h2>
          <p className="text-xs text-gray-600 mt-2 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  const report = data.report;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-bold text-forest tracking-wider uppercase">
                MehnatNama • Trusted Helper View
              </span>
              <h1 className="text-lg font-bold text-gray-900 mt-0.5">
                Worker Wage Statement (कामगार का हिसाब पर्चा)
              </h1>
            </div>
            <div className="text-right text-xs">
              <span className="text-gray-400 block">Worker:</span>
              <span className="font-bold text-gray-900">{report.worker.fullName}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-forest-50/60 border border-forest-200 rounded-xl text-xs text-forest flex items-center justify-between">
            <span>Access Mode: Read-Only (केवल देखने की अनुमति)</span>
            <span className="text-[11px] text-gray-500">
              Valid until: {new Date(data.expiresAt).toLocaleDateString('en-IN')}
            </span>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <span className="text-[11px] text-gray-400">Total Days Logged</span>
            <div className="text-lg font-bold text-gray-900 mt-0.5">
              {report.summary.totalWorkingDays} days
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <span className="text-[11px] text-forest">Total Earned</span>
            <div className="text-lg font-bold text-forest mt-0.5">
              ₹{report.summary.totalEarnedRupees.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <span className="text-[11px] text-emerald-700">Receipts (Payments)</span>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">
              ₹{report.summary.totalReceiptsRupees.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-forest-200 shadow-xs bg-forest-50/30">
            <span className="text-[11px] text-forest font-semibold">Net Balance Due</span>
            <div className="text-lg font-bold text-forest mt-0.5">
              ₹{report.summary.netRecordedBalanceRupees.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Jobs & Detailed Logs */}
        {report.jobs.map((job: any) => (
          <div key={job.id} className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{job.jobTitle}</h3>
                <p className="text-xs text-gray-500">
                  Contractor: {job.contractorName} • Daily Rate: ₹{job.agreedDailyRatePaise / 100}
                </p>
              </div>
              <span className="text-xs font-bold text-forest">
                Balance Due: ₹{job.totals.jobBalanceDuePaise / 100}
              </span>
            </div>

            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase">
                  <tr>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Earned</th>
                    <th className="py-2 px-3">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {job.workDays.map((wd: any) => (
                    <tr key={wd.id}>
                      <td className="py-2 px-3 whitespace-nowrap font-medium text-gray-900">
                        {wd.workDate}
                      </td>
                      <td className="py-2 px-3">{wd.status}</td>
                      <td className="py-2 px-3 text-right font-semibold text-forest">
                        ₹{wd.earnedAmountPaise / 100}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            wd.confirmationStatus === 'CONFIRMED'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : wd.confirmationStatus === 'DISPUTED'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {wd.confirmationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div className="p-4 bg-gray-100/70 rounded-xl text-[11px] text-gray-500 leading-relaxed text-center">
          {report.disclaimer}
        </div>
      </div>
    </div>
  );
};
