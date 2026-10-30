import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { StatusBadge } from '../components/common/StatusBadge';
import { jobService, type CreateJobDto, type UpdateJobDto } from '../services/jobService';
import type { Job, JobStatus, SkillLevel } from '../types';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  User,
  Phone,
  MapPin,
  ArrowRight,
  Edit2,
  CheckCircle,
  PauseCircle,
  PlayCircle,
  X,
  AlertCircle,
  FolderOpen,
} from 'lucide-react';

export const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'ALL' | JobStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Job Form State
  const [formJobTitle, setFormJobTitle] = useState('');
  const [formContractorName, setFormContractorName] = useState('');
  const [formContractorPhone, setFormContractorPhone] = useState('');
  const [formWorkLocation, setFormWorkLocation] = useState('');
  const [formWorkCategory, setFormWorkCategory] = useState('Construction');
  const [formSkillLevel, setFormSkillLevel] = useState<SkillLevel>('SKILLED');
  const [formDailyWage, setFormDailyWage] = useState<string>('600');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formEndDate, setFormEndDate] = useState('');

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await jobService.getJobs({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: searchQuery || undefined,
      });
      setJobs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleOpenCreateModal = () => {
    setFormJobTitle('');
    setFormContractorName('');
    setFormContractorPhone('');
    setFormWorkLocation('');
    setFormWorkCategory('Construction');
    setFormSkillLevel('SKILLED');
    setFormDailyWage('600');
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormEndDate('');
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (job: Job) => {
    setEditingJob(job);
    setFormJobTitle(job.jobTitle);
    setFormContractorName(job.contractorName);
    setFormContractorPhone(job.contractorPhone);
    setFormWorkLocation(job.workLocation || '');
    setFormWorkCategory(job.workCategory || 'Construction');
    setFormSkillLevel(job.skillLevel);
    setFormDailyWage(String(Math.round(job.agreedDailyRatePaise / 100)));
    setFormStartDate(job.startDate.split('T')[0]);
    setFormEndDate(job.expectedEndDate ? job.expectedEndDate.split('T')[0] : '');
    setFormError(null);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const wage = parseInt(formDailyWage, 10);
    if (isNaN(wage) || wage <= 0) {
      setFormError('Please enter a valid daily wage in Rupees.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingJob) {
        const updatePayload: UpdateJobDto = {
          jobTitle: formJobTitle,
          contractorName: formContractorName,
          contractorPhone: formContractorPhone,
          workLocation: formWorkLocation,
          workCategory: formWorkCategory,
          skillLevel: formSkillLevel,
          agreedDailyRatePaise: wage * 100,
          startDate: formStartDate,
          expectedEndDate: formEndDate || undefined,
        };
        await jobService.updateJob(editingJob.id, updatePayload);
        setEditingJob(null);
      } else {
        const createPayload: CreateJobDto = {
          jobTitle: formJobTitle,
          contractorName: formContractorName,
          contractorPhone: formContractorPhone,
          workLocation: formWorkLocation,
          workCategory: formWorkCategory,
          skillLevel: formSkillLevel,
          agreedDailyRatePaise: wage * 100,
          startDate: formStartDate,
          expectedEndDate: formEndDate || undefined,
        };
        await jobService.createJob(createPayload);
        setIsCreateModalOpen(false);
      }
      fetchJobs();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (job: Job, newStatus: JobStatus) => {
    try {
      await jobService.updateJobStatus(job.id, newStatus);
      fetchJobs();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <PageContainer maxWidth="xl" className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-borderNeutral/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-primary">
              My Jobs & Worksites
            </h1>
            <span className="text-lg sm:text-xl font-bold text-forest font-hindi">
              (मेरे काम व साइट्स)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1">
            Manage your contracts, worksites, and agreed daily wage rates.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="btn-primary self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Job (नया काम जोड़ें)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-borderNeutral shadow-subtle">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'ACTIVE', 'PAUSED', 'COMPLETED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab
                  ? 'bg-forest text-white shadow-subtle'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-surface'
              }`}
            >
              {tab === 'ALL'
                ? 'All Jobs'
                : tab === 'ACTIVE'
                ? 'Active (चालू)'
                : tab === 'PAUSED'
                ? 'Paused (रोका गया)'
                : 'Completed (पूरा)'}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-muted" />
          <input
            type="text"
            placeholder="Search job or contractor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-borderNeutral text-xs focus:border-forest focus:outline-none bg-surface"
          />
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between text-xs text-status-danger">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
          <button onClick={fetchJobs} className="underline font-semibold">
            Retry
          </button>
        </div>
      )}

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-white border border-borderNeutral p-5" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="card-base text-center py-12 space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-forest-soft text-forest flex items-center justify-center mx-auto">
            <FolderOpen className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-ink-primary">No Jobs Found</h3>
            <p className="text-xs text-ink-secondary">
              {searchQuery || statusFilter !== 'ALL'
                ? 'No jobs match your current search or status filter.'
                : 'You have not added any worksites yet. Add your first job to start logging attendance.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="btn-primary text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Job</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => {
            const dailyWageRupees = Math.round(job.agreedDailyRatePaise / 100);
            const stats = job.stats;

            return (
              <div
                key={job.id}
                className="card-base flex flex-col justify-between transition-all duration-200 hover:shadow-lifted hover:border-forest-200"
              >
                <div>
                  {/* Top Bar: Title & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-forest-soft text-forest flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-ink-primary leading-tight">
                          {job.jobTitle}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-ink-secondary">
                          <span className="px-1.5 py-0.5 rounded bg-surface border border-borderNeutral font-medium">
                            {job.workCategory || 'General'}
                          </span>
                          <span>•</span>
                          <span>{job.skillLevel}</span>
                        </div>
                      </div>
                    </div>

                    <StatusBadge status={job.status.toLowerCase()} size="sm" />
                  </div>

                  {/* Contractor & Location Info */}
                  <div className="mt-4 pt-3 border-t border-borderNeutral/70 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-secondary">
                    <div className="flex items-center gap-1.5 truncate">
                      <User className="h-3.5 w-3.5 text-ink-muted shrink-0" />
                      <span className="truncate">
                        <strong className="text-ink-primary">{job.contractorName}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="h-3.5 w-3.5 text-ink-muted shrink-0" />
                      <span className="font-mono">{job.contractorPhone}</span>
                    </div>

                    {job.workLocation && (
                      <div className="flex items-center gap-1.5 col-span-full truncate">
                        <MapPin className="h-3.5 w-3.5 text-ink-muted shrink-0" />
                        <span className="truncate">{job.workLocation}</span>
                      </div>
                    )}
                  </div>

                  {/* Financial Stats Strip */}
                  <div className="mt-4 pt-3 border-t border-borderNeutral/70 grid grid-cols-3 gap-2 text-center bg-surface p-2.5 rounded-xl border border-borderNeutral/60">
                    <div>
                      <span className="text-[10px] text-ink-muted block uppercase">Daily Rate</span>
                      <span className="text-xs font-bold text-forest stat-figure">
                        ₹{dailyWageRupees}/day
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-muted block uppercase">Earned</span>
                      <span className="text-xs font-bold text-ink-primary stat-figure">
                        ₹{(stats?.totalEarnedRupees || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-muted block uppercase">Due Balance</span>
                      <span
                        className={`text-xs font-bold stat-figure ${
                          (stats?.outstandingBalanceRupees || 0) > 0 ? 'text-amber-700' : 'text-forest'
                        }`}
                      >
                        ₹{(stats?.outstandingBalanceRupees || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-4 pt-3 border-t border-borderNeutral/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                  {/* Status Actions */}
                  <div className="flex items-center gap-1">
                    {job.status !== 'ACTIVE' && (
                      <button
                        onClick={() => handleToggleStatus(job, 'ACTIVE')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-forest hover:bg-forest-soft"
                        title="Resume Job"
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        <span>Activate</span>
                      </button>
                    )}
                    {job.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleToggleStatus(job, 'PAUSED')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-amber-700 hover:bg-amber-50"
                        title="Pause Job"
                      >
                        <PauseCircle className="h-3.5 w-3.5" />
                        <span>Pause</span>
                      </button>
                    )}
                    {job.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleToggleStatus(job, 'COMPLETED')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-ink-secondary hover:bg-surface"
                        title="Mark Complete"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Complete</span>
                      </button>
                    )}
                  </div>

                  {/* Edit and Quick Log */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(job)}
                      className="p-1.5 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-surface"
                      title="Edit Job Details"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <Link
                      to="/daily-hisaab"
                      className="inline-flex items-center gap-1 text-forest hover:text-forest-dark font-semibold group"
                    >
                      <span>Log Work</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Job Modal */}
      {(isCreateModalOpen || editingJob) && (
        <div className="fixed inset-0 z-50 bg-ink-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-lifted border border-borderNeutral space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-borderNeutral">
              <div>
                <h3 className="text-base font-bold text-ink-primary">
                  {editingJob ? 'Edit Job Record' : 'Create New Job (नया काम जोड़ें)'}
                </h3>
                <p className="text-xs text-forest font-hindi">
                  कार्यस्थल व दैनिक मजदूरी की जानकारी
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingJob(null);
                }}
                className="p-1.5 rounded-lg text-ink-secondary hover:bg-surface"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 text-status-danger text-xs border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveJob} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-ink-primary mb-1">
                  Job / Site Title (काम का नाम) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Construction Site A, Farm Harvest, Villa Painting"
                  value={formJobTitle}
                  onChange={(e) => setFormJobTitle(e.target.value)}
                  className="w-full rounded-xl border border-borderNeutral px-3 py-2 text-sm focus:border-forest focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-ink-primary mb-1">
                    Contractor Name (ठेकेदार का नाम) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={formContractorName}
                    onChange={(e) => setFormContractorName(e.target.value)}
                    className="w-full rounded-xl border border-borderNeutral px-3 py-2 text-sm focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink-primary mb-1">
                    Contractor Phone (मोबाइल नंबर) *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={formContractorPhone}
                    onChange={(e) => setFormContractorPhone(e.target.value)}
                    className="w-full rounded-xl border border-borderNeutral px-3 py-2 text-sm focus:border-forest focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-ink-primary mb-1">
                  Work Location / Address (काम की जगह)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sector 62 Noida, Badlapur Rural"
                  value={formWorkLocation}
                  onChange={(e) => setFormWorkLocation(e.target.value)}
                  className="w-full rounded-xl border border-borderNeutral px-3 py-2 text-sm focus:border-forest focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-ink-primary mb-1">
                    Agreed Daily Rate (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-ink-muted font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="600"
                      value={formDailyWage}
                      onChange={(e) => setFormDailyWage(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-borderNeutral text-sm font-bold text-forest focus:border-forest focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-ink-primary mb-1">
                    Work Category
                  </label>
                  <input
                    type="text"
                    value={formWorkCategory}
                    onChange={(e) => setFormWorkCategory(e.target.value)}
                    placeholder="Construction"
                    className="w-full rounded-xl border border-borderNeutral px-3 py-2 text-sm focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink-primary mb-1">
                    Skill Level
                  </label>
                  <select
                    value={formSkillLevel}
                    onChange={(e) => setFormSkillLevel(e.target.value as any)}
                    className="w-full rounded-xl border border-borderNeutral px-3 py-2 text-sm focus:border-forest focus:outline-none bg-white"
                  >
                    <option value="UNSKILLED">Unskilled</option>
                    <option value="SEMI_SKILLED">Semi-Skilled</option>
                    <option value="SKILLED">Skilled</option>
                    <option value="HIGHLY_SKILLED">Highly Skilled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-ink-primary mb-1">
                    Start Date (शुरू होने की तारीख) *
                  </label>
                  <input
                    type="date"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full rounded-xl border border-borderNeutral px-3 py-2 text-sm focus:border-forest focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink-primary mb-1">
                    Expected End Date (समाप्ति तारीख)
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full rounded-xl border border-borderNeutral px-3 py-2 text-sm focus:border-forest focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-borderNeutral flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingJob(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? 'Saving...' : editingJob ? 'Save Changes' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
