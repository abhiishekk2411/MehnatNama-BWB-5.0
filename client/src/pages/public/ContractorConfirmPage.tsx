import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { confirmationService } from '../../services/phase4Service';
import {
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';

export const ContractorConfirmPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  // Form responses: itemId -> { responseType, disputeReason, optionalComment }
  const [responses, setResponses] = useState<
    Record<
      string,
      {
        responseType: 'CONFIRMED' | 'DISPUTED';
        disputeReason?: string;
        optionalComment?: string;
      }
    >
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPublicData() {
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        const result = await confirmationService.getPublicConfirmation(token);
        setData(result);

        // Pre-fill default responses with 'CONFIRMED' for all items
        const initialMap: Record<string, any> = {};
        result.items.forEach((item: any) => {
          if (item.latestResponse) {
            initialMap[item.id] = {
              responseType: item.latestResponse.responseType,
              disputeReason: item.latestResponse.disputeReason || 'INCORRECT_WORKDAY',
              optionalComment: item.latestResponse.optionalComment || '',
            };
          } else {
            initialMap[item.id] = {
              responseType: 'CONFIRMED',
              disputeReason: 'INCORRECT_WORKDAY',
              optionalComment: '',
            };
          }
        });
        setResponses(initialMap);
      } catch (err: any) {
        setError(err.message || 'Unable to load confirmation request.');
      } finally {
        setIsLoading(false);
      }
    }
    loadPublicData();
  }, [token]);

  const handleToggleStatus = (itemId: string, type: 'CONFIRMED' | 'DISPUTED') => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        responseType: type,
      },
    }));
  };

  const handleReasonChange = (itemId: string, disputeReason: string) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        disputeReason,
      },
    }));
  };

  const handleCommentChange = (itemId: string, optionalComment: string) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        optionalComment,
      },
    }));
  };

  const handleConfirmAll = () => {
    if (!data) return;
    const updated: Record<string, any> = {};
    data.items.forEach((i: any) => {
      updated[i.id] = {
        responseType: 'CONFIRMED',
        disputeReason: 'INCORRECT_WORKDAY',
        optionalComment: '',
      };
    });
    setResponses(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !data) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const payload = {
        responses: Object.entries(responses).map(([itemId, val]) => ({
          itemId,
          responseType: val.responseType,
          disputeReason: val.responseType === 'DISPUTED' ? val.disputeReason : undefined,
          optionalComment: val.optionalComment?.trim() || undefined,
        })),
      };

      await confirmationService.submitPublicResponse(token, payload);
      setIsSubmitted(true);
    } catch (err: any) {
      setSubmissionError(err.message || 'Failed to submit response.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-forest mx-auto mb-3" />
          <h2 className="text-base font-semibold text-gray-900">Loading Attendance Verification...</h2>
          <p className="text-xs text-gray-500 font-devanagari mt-1">हाजिरी सत्यापन लोड हो रहा है...</p>
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
          <h2 className="text-lg font-bold text-gray-900">Link Unavailable / समाप्त लिंक</h2>
          <p className="text-xs text-gray-600 mt-2 leading-relaxed">{error}</p>
          <div className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-400">
            MehnatNama (मेहनतनामा) — Digital Wage Diary & Rights Awareness
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-emerald-200 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Acknowledgement Recorded!</h2>
          <p className="text-sm font-devanagari font-semibold text-forest mt-1">
            आपकी पुष्टि / सत्यापन सफलतापूर्वक दर्ज हो गया है।
          </p>
          <p className="text-xs text-gray-600 mt-3 leading-relaxed">
            Thank you for verifying workdays with {data?.worker?.displayName}. The recorded status has been
            updated in the worker's digital diary.
          </p>
          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-left border border-gray-200 text-xs space-y-1.5">
            <div className="flex justify-between text-gray-600">
              <span>Worksite / काम:</span>
              <span className="font-semibold text-gray-900">{data?.job?.jobTitle}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Worker / कामगार:</span>
              <span className="font-semibold text-gray-900">{data?.worker?.displayName}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Verified Date:</span>
              <span className="font-semibold text-gray-900">
                {new Date().toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
          <div className="mt-6 text-[11px] text-gray-400">
            MehnatNama Platform • Official Public Verification Portal
          </div>
        </div>
      </div>
    );
  }

  const confirmedCount = Object.values(responses).filter((r) => r.responseType === 'CONFIRMED').length;
  const disputedCount = Object.values(responses).filter((r) => r.responseType === 'DISPUTED').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-200 text-forest flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-forest tracking-wider uppercase">
                    MehnatNama • मेहनतनामा
                  </span>
                  <span className="text-[10px] bg-forest-50 text-forest px-2 py-0.5 rounded-full border border-forest-200">
                    Contractor Verification
                  </span>
                </div>
                <h1 className="text-lg font-bold text-gray-900 mt-0.5">
                  Attendance & Wage Verification (हाजिरी व दिहाड़ी सत्यापन)
                </h1>
              </div>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-xs text-gray-500 block">Requested by Worker</span>
              <span className="text-sm font-bold text-gray-900">{data.worker.displayName}</span>
            </div>
          </div>

          {/* Job Meta Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="w-4 h-4 text-forest shrink-0" />
              <div>
                <span className="text-gray-400 block text-[10px]">Worksite / Job</span>
                <span className="font-semibold text-gray-900">{data.job.jobTitle}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-forest shrink-0" />
              <div>
                <span className="text-gray-400 block text-[10px]">Location</span>
                <span className="font-semibold text-gray-900">{data.job.workLocation || 'Not specified'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-forest shrink-0" />
              <div>
                <span className="text-gray-400 block text-[10px]">Agreed Daily Rate</span>
                <span className="font-semibold text-forest">
                  ₹{(data.job.agreedDailyRatePaise / 100).toLocaleString('en-IN')}/day
                </span>
              </div>
            </div>
          </div>

          {data.note && (
            <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Worker's Note:</span> {data.note}
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-600">
            <span className="font-semibold text-gray-900">{data.items.length}</span> workdays submitted for your
            review
          </div>
          <button
            type="button"
            onClick={handleConfirmAll}
            className="text-xs font-semibold text-forest hover:text-forest-dark bg-forest-50 hover:bg-forest-soft px-3 py-1.5 rounded-lg border border-forest-200 transition"
          >
            ✓ Mark All Confirmed (सभी सही हैं)
          </button>
        </div>

        {submissionError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{submissionError}</span>
          </div>
        )}

        {/* Workdays Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {data.items.map((item: any, idx: number) => {
            const resp = responses[item.id] || { responseType: 'CONFIRMED' };
            const isDisputed = resp.responseType === 'DISPUTED';
            const formattedDate = new Date(item.workDate).toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-4 border transition ${
                  isDisputed ? 'border-amber-300 bg-amber-50/20 shadow-xs' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  {/* Left: Date & Status */}
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-semibold text-gray-400 w-6 pt-0.5">#{idx + 1}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{formattedDate}</span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                            item.workDayStatus === 'FULL_DAY'
                              ? 'bg-forest-50 text-forest border-forest-200'
                              : item.workDayStatus === 'HALF_DAY'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {item.workDayStatus === 'FULL_DAY'
                            ? 'Full Day (पूरा दिन)'
                            : item.workDayStatus === 'HALF_DAY'
                            ? 'Half Day (आधा दिन)'
                            : 'Absent (छुट्टी)'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>Wage: ₹{item.earnedAmountPaise / 100}</span>
                        {item.overtimeMinutes > 0 && <span>• OT: +{item.overtimeMinutes}m</span>}
                        {item.note && <span className="text-gray-700 italic">• "{item.note}"</span>}
                      </div>
                    </div>
                  </div>

                  {/* Right: Confirm or Dispute Toggle */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item.id, 'CONFIRMED')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        !isDisputed
                          ? 'bg-forest text-white border-forest shadow-xs'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      ✓ Sahi Hai (Confirm)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item.id, 'DISPUTED')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        isDisputed
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      ✗ Galat Hai (Dispute)
                    </button>
                  </div>
                </div>

                {/* Dispute Reason & Comments (expanded if disputed) */}
                {isDisputed && (
                  <div className="mt-3 pt-3 border-t border-amber-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Reason for Disagreement (आपत्ति का कारण):
                      </label>
                      <select
                        value={resp.disputeReason || 'INCORRECT_WORKDAY'}
                        onChange={(e) => handleReasonChange(item.id, e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="INCORRECT_WORKDAY">Incorrect Workday / काम पर नहीं था</option>
                        <option value="INCORRECT_WAGE_RATE">Incorrect Wage Rate / दिहाड़ी गलत है</option>
                        <option value="WORK_NOT_COMPLETED">Work was not completed / काम पूरा नहीं किया</option>
                        <option value="PAYMENT_ALREADY_MADE">Payment already made / भुगतान पहले हो चुका है</option>
                        <option value="OTHER">Other / अन्य कारण</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Short explanation / टिप्पणी (Optional):
                      </label>
                      <input
                        type="text"
                        value={resp.optionalComment || ''}
                        onChange={(e) => handleCommentChange(item.id, e.target.value)}
                        placeholder="e.g. Left early at 2 PM, rain stoppage..."
                        className="w-full text-xs px-2.5 py-1.5 border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Submission Bar */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4">
            <div className="text-xs text-gray-600">
              Summary:{' '}
              <span className="font-bold text-forest">{confirmedCount} Confirmed (सही)</span>
              {disputedCount > 0 && (
                <span className="font-bold text-amber-700 ml-2">
                  • {disputedCount} Disputed (आपत्ति)
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-forest hover:bg-forest-dark text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Recording Acknowledgement...' : 'Submit Verification (सत्यापन दर्ज करें)'}
            </button>
          </div>
        </form>

        <div className="text-center text-[11px] text-gray-400 pb-8">
          This verification portal is powered by MehnatNama (मेहनतनामा). Records are preserved for wage transparency.
        </div>
      </div>
    </div>
  );
};
