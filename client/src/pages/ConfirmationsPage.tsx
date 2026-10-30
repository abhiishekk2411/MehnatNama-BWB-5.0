import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { SectionHeader } from '../components/common/SectionHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { jobService } from '../services/jobService';
import {
  confirmationService,
  type CreateConfirmationRequestDto,
} from '../services/phase4Service';
import type { Job, ContractorConfirmationRequest } from '../types';
import {
  CheckCheck,
  Plus,
  RefreshCw,
  Share2,
  Copy,
  AlertCircle,
  CheckCircle2,
  X,
  Ban,
} from 'lucide-react';

export const ConfirmationsPage: React.FC = () => {
  const [requests, setRequests] = useState<ContractorConfirmationRequest[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [expiryDays, setExpiryDays] = useState(14);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Created Link Showcase
  const [newShareUrl, setNewShareUrl] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [reqList, jobList] = await Promise.all([
        confirmationService.getRequests(),
        jobService.getJobs({ status: 'ACTIVE' }),
      ]);
      setRequests(reqList);
      setJobs(jobList);
      if (jobList.length > 0 && !selectedJobId) {
        setSelectedJobId(jobList[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load confirmation requests');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreateModal = () => {
    setTitle('');
    setNote('');
    setExpiryDays(14);
    setFormError(null);
    setNewShareUrl(null);
    if (jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0].id);
    }
    setIsCreateModalOpen(true);
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) {
      setFormError('Please select a job (काम चुनें)');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload: CreateConfirmationRequestDto = {
        jobId: selectedJobId,
        title: title.trim() || undefined,
        note: note.trim() || undefined,
        expiryDays: Number(expiryDays),
      };

      const result = await confirmationService.createRequest(payload);
      const fullUrl = `${window.location.origin}${result.shareUrl}`;
      setNewShareUrl(fullUrl);
      fetchData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create verification request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 3000);
  };

  const handleWhatsAppShare = (req: ContractorConfirmationRequest, url: string) => {
    const jobTitle = req.job?.jobTitle || 'Kaam';
    const message = `Namaste ji, kripya is link par jaakar mere ${jobTitle} ki haajiri aur hisaab ki pushti kar dein (MehnatNama): ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleRevoke = async (id: string) => {
    if (!window.confirm('Are you sure you want to revoke this link? The contractor will no longer be able to open it.')) {
      return;
    }
    try {
      await confirmationService.revokeRequest(id);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to revoke link');
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Contractor Confirmations"
        hindiTitle="ठेकेदार सत्यापन लिंक"
        description="Generate tamper-evident, zero-login verification links. Share with your contractor on WhatsApp to confirm daily work and wage records."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchData()}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-xs"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-forest hover:bg-forest-dark rounded-lg transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              + New Verification Link (नया लिंक बनाएं)
            </button>
          </div>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
          <span className="text-xs text-gray-400 font-medium">Total Requests</span>
          <div className="text-xl font-bold text-gray-900 mt-1">{requests.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-xs bg-emerald-50/20">
          <span className="text-xs text-emerald-800 font-medium">Confirmed (सत्यापित)</span>
          <div className="text-xl font-bold text-emerald-700 mt-1">
            {requests.filter((r) => r.status === 'CONFIRMED').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-xs bg-amber-50/20">
          <span className="text-xs text-amber-900 font-medium">Disputed (आपत्ति)</span>
          <div className="text-xl font-bold text-amber-800 mt-1">
            {requests.filter((r) => r.status === 'DISPUTED').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Pending Review</span>
          <div className="text-xl font-bold text-gray-800 mt-1">
            {requests.filter((r) => r.status === 'PENDING').length}
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin text-forest mx-auto mb-2" />
            <p className="text-xs">Loading verification requests...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl border border-rose-200 p-6 text-center text-rose-700 text-xs">
            {error}
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
            <CheckCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-900">No confirmation links generated yet</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Create a verification link to share with your thekedar on WhatsApp. They can review and confirm your days with 1-click.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-forest hover:bg-forest-dark rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Create First Verification Link
            </button>
          </div>
        ) : (
          requests.map((req) => {
            const confirmedItems = req.items?.filter((i) => i.status === 'CONFIRMED').length || 0;
            const disputedItems = req.items?.filter((i) => i.status === 'DISPUTED').length || 0;
            const totalItems = req.items?.length || 0;
            const isRevoked = req.status === 'REVOKED';
            const isExpired = req.status === 'EXPIRED';

            // Seeded or simulated public token URL
            const publicUrl = `${window.location.origin}/contractor/confirm/${
              req.tokenHash?.slice(0, 32) || 'preview'
            }`;

            return (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-xs transition hover:border-gray-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">
                        {req.title || req.job?.jobTitle}
                      </span>
                      <StatusBadge
                        status={
                          req.status === 'CONFIRMED'
                            ? 'confirmed'
                            : req.status === 'DISPUTED'
                            ? 'disputed'
                            : req.status === 'EXPIRED' || req.status === 'REVOKED'
                            ? 'absent'
                            : 'pending'
                        }
                        label={req.status}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>Job: {req.job?.jobTitle}</span>
                      <span>• Contractor: {req.job?.contractorName}</span>
                      <span>• Created: {new Date(req.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleWhatsAppShare(req, publicUrl)}
                      disabled={isRevoked || isExpired}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition disabled:opacity-40"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      WhatsApp
                    </button>
                    <button
                      onClick={() => handleCopyLink(publicUrl)}
                      disabled={isRevoked || isExpired}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition disabled:opacity-40"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Link
                    </button>
                    {!isRevoked && (
                      <button
                        onClick={() => handleRevoke(req.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Revoke Link"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Breakdown Bar */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      Items Submitted: <strong className="text-gray-900">{totalItems} days</strong>
                    </span>
                    <span className="text-emerald-700">
                      Confirmed: <strong>{confirmedItems}</strong>
                    </span>
                    {disputedItems > 0 && (
                      <span className="text-amber-800">
                        Disputed: <strong>{disputedItems}</strong>
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-gray-400">
                    Expires on: {new Date(req.expiresAt).toLocaleDateString('en-IN')}
                  </span>
                </div>

                {/* If there are disputed items, show contractor's dispute feedback */}
                {disputedItems > 0 && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
                    <span className="font-semibold block">Contractor Disagreement Notes:</span>
                    {req.items
                      ?.filter((i) => i.status === 'DISPUTED')
                      .map((di) => (
                        <div key={di.id} className="text-[11px]">
                          • Date {new Date(di.workDay?.workDate || '').toLocaleDateString('en-IN')}:{' '}
                          {di.responses?.[0]?.disputeReason || 'Disputed'}
                          {di.responses?.[0]?.optionalComment && (
                            <span className="italic"> — "{di.responses[0].optionalComment}"</span>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Link Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Create Contractor Verification Link</h3>
                <p className="text-xs text-gray-500 font-devanagari">
                  ठेकेदार के लिए सत्यापन लिंक बनाएं
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="m-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {newShareUrl ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Verification Link Ready!</h4>
                  <p className="text-xs text-gray-500 font-devanagari mt-0.5">
                    सत्यापन लिंक तैयार है। ठेकेदार को व्हाट्सएप पर भेजें।
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 break-all select-all font-mono">
                  {newShareUrl}
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => handleCopyLink(newShareUrl)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copyFeedback ? 'Copied!' : 'Copy Link'}
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Namaste ji, kripya is link par jaakar mere kaam ki haajiri aur hisaab ki pushti kar dein (MehnatNama): ${newShareUrl}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-forest hover:bg-forest-dark text-white text-xs font-semibold rounded-lg transition"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share WhatsApp
                  </a>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-full text-xs text-gray-500 hover:text-gray-800 pt-2"
                >
                  Done (पूर्ण)
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateRequest} className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Select Job <span className="font-devanagari text-gray-500">(काम चुनें)</span>
                  </label>
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest bg-white"
                  >
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.jobTitle} • {j.contractorName} (₹{j.agreedDailyRatePaise / 100}/day)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Request Title (शीर्षक)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. October Fortnight 1 Attendance"
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Message / Note for Contractor (संदेश)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Please confirm my 15 days mason work."
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Link Validity (वैधता)
                  </label>
                  <select
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest bg-white"
                  >
                    <option value={7}>7 Days (1 Week)</option>
                    <option value={14}>14 Days (2 Weeks - Recommended)</option>
                    <option value={30}>30 Days (1 Month)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-semibold text-white bg-forest hover:bg-forest-dark rounded-lg transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Generating...' : 'Generate Secure Link'}
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
