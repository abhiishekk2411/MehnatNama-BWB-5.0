import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { SectionHeader } from '../components/common/SectionHeader';
import { jobService } from '../services/jobService';
import { wageService } from '../services/phase4Service';
import type { Job, MinimumWageRule, WageComparisonResult, SkillLevel } from '../types';
import {
  Scale,
  AlertCircle,
  ExternalLink,
  TrendingDown,
  TrendingUp,
  Info,
} from 'lucide-react';

export const WageCheckPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [rules, setRules] = useState<MinimumWageRule[]>([]);

  // Form selections
  const [selectedJobId, setSelectedJobId] = useState<string>('CUSTOM');
  const [state, setState] = useState('Maharashtra');
  const [category, setCategory] = useState('Building and Road Construction');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('SKILLED');
  const [customRate, setCustomRate] = useState<string>('600');
  const [daysCount, setDaysCount] = useState<number>(20);

  // Comparison Result
  const [comparison, setComparison] = useState<WageComparisonResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const [jobList, ruleList] = await Promise.all([
          jobService.getJobs({ status: 'ACTIVE' }),
          wageService.getRules(),
        ]);
        setJobs(jobList);
        setRules(ruleList);

        if (jobList.length > 0) {
          setSelectedJobId(jobList[0].id);
          setCustomRate(String(Math.round(jobList[0].agreedDailyRatePaise / 100)));
        }
      } catch (err) {
        console.error('Failed to init wage check:', err);
      }
    }
    init();
  }, []);

  // Update form when a job is picked
  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    if (jobId === 'CUSTOM') {
      setCustomRate('600');
    } else {
      const j = jobs.find((x) => x.id === jobId);
      if (j) {
        setCustomRate(String(Math.round(j.agreedDailyRatePaise / 100)));
        setSkillLevel(j.skillLevel);
      }
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setCalcError(null);

    try {
      const payload = {
        jobId: selectedJobId !== 'CUSTOM' ? selectedJobId : undefined,
        state,
        employmentCategory: category,
        skillLevel,
        agreedDailyRatePaise: Math.round(Number(customRate) * 100),
        daysWorkedCount: Number(daysCount),
      };

      const result = await wageService.calculateComparison(payload);
      setComparison(result);
    } catch (err: any) {
      setCalcError(err.message || 'Comparison calculation failed.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Minimum Wage Check"
        hindiTitle="न्यूनतम मजदूरी जांच व तुलना"
        description="Statutory legal comparison of your agreed daily rate with official State & Central Gazette notifications."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column: Calculator Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs sticky top-20">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-forest-50 border border-forest-200 text-forest flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Statutory Comparison</h3>
                <p className="text-xs font-devanagari text-gray-500">सरकारी दर से तुलना</p>
              </div>
            </div>

            {calcError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{calcError}</span>
              </div>
            )}

            <form onSubmit={handleCalculate} className="space-y-4">
              {/* Job Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Select Worksite (काम चुनें)
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => handleJobSelect(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  <option value="CUSTOM">Custom Comparison (स्वतंत्र तुलना)</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.jobTitle} (₹{j.agreedDailyRatePaise / 100}/day)
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  State / Jurisdiction (राज्य)
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
                  <option value="Central Sphere">Central Sphere (केंद्र सरकार)</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Scheduled Employment (उद्योग / कार्य श्रेणी)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  <option value="Building and Road Construction">Building & Road Construction (भवन निर्माण)</option>
                  <option value="Construction or Maintenance of Roads / Runways / Buildings">
                    Central Construction & Maintenance (सड़क / भवन निर्माण)
                  </option>
                </select>
              </div>

              {/* Skill Classification */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Skill Level (योग्यता / कार्य श्रेणी)
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  <option value="UNSKILLED">Unskilled / अकुशल (मजदूर, हेल्पर)</option>
                  <option value="SEMI_SKILLED">Semi-Skilled / अर्ध-कुशल</option>
                  <option value="SKILLED">Skilled / कुशल (राजमिस्त्री, बढ़ई, पेंटर)</option>
                  <option value="HIGHLY_SKILLED">Highly Skilled / उच्च कुशल</option>
                </select>
              </div>

              {/* Worker Agreed Rate */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Agreed Daily Rate (आपकी दिहाड़ी ₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    className="w-full text-xs pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                  <span className="absolute right-3 top-2 text-gray-400 text-[11px]">/day</span>
                </div>
              </div>

              {/* Days Count */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Number of Days to Compare (तुलना के दिन)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  required
                  value={daysCount}
                  onChange={(e) => setDaysCount(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              <button
                type="submit"
                disabled={isCalculating}
                className="w-full py-2.5 px-4 bg-forest hover:bg-forest-dark text-white text-xs font-semibold rounded-lg shadow-xs transition disabled:opacity-50"
              >
                {isCalculating ? 'Comparing with Gazette...' : 'Compare with Official Gazette (तुलना करें)'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Comparison Results & Official Rules */}
        <div className="lg:col-span-2 space-y-6">
          {comparison ? (
            comparison.matched ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold text-forest tracking-wider uppercase">
                      Official Gazette Benchmark Matched
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-0.5">
                      Comparison Result for {comparison.rule?.state} ({comparison.rule?.skillLevel})
                    </h3>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      comparison.comparison?.isBelowBenchmark
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {comparison.comparison?.isBelowBenchmark ? (
                      <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                    ) : (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    {comparison.comparison?.hindiStatus}
                  </span>
                </div>

                {/* Rate Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <span className="text-[11px] text-gray-500 font-medium block">
                      Your Daily Wage (आपकी दिहाड़ी)
                    </span>
                    <div className="text-xl font-bold text-gray-900 mt-1">
                      ₹{comparison.worker?.agreedDailyRateRupees}
                      <span className="text-xs font-normal text-gray-500">/day</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-forest-50/50 border border-forest-200">
                    <span className="text-[11px] text-forest font-semibold block">
                      Official Gazette Minimum (सरकारी न्यूनतम)
                    </span>
                    <div className="text-xl font-bold text-forest mt-1">
                      ₹{comparison.rule?.totalBenchmarkDailyRateRupees}
                      <span className="text-xs font-normal text-gray-500">/day</span>
                    </div>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      (Base: ₹{(comparison.rule?.baseRatePaise || 0) / 100} + VDA: ₹
                      {(comparison.rule?.variableAllowancePaise || 0) / 100})
                    </span>
                  </div>

                  <div
                    className={`p-4 rounded-xl border ${
                      comparison.comparison?.isBelowBenchmark
                        ? 'bg-rose-50/50 border-rose-200 text-rose-900'
                        : 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                    }`}
                  >
                    <span className="text-[11px] font-semibold block">
                      Difference / अंतर ({daysCount} days)
                    </span>
                    <div className="text-xl font-bold mt-1">
                      {comparison.comparison && comparison.comparison.differencePerDayRupees < 0
                        ? `-₹${Math.abs(comparison.comparison.differencePerDayRupees)}`
                        : `+₹${comparison.comparison?.differencePerDayRupees}`}
                      <span className="text-xs font-normal">/day</span>
                    </div>
                    <span className="text-[10px] font-medium block mt-0.5">
                      Cumulative:{' '}
                      {comparison.comparison && comparison.comparison.cumulativeDifferenceRupees < 0
                        ? `Shortfall of ₹${Math.abs(comparison.comparison.cumulativeDifferenceRupees)}`
                        : `Surplus of ₹${comparison.comparison?.cumulativeDifferenceRupees}`}
                    </span>
                  </div>
                </div>

                {/* Statutory Reference Banner */}
                <div className="p-4 bg-slate-50 border border-gray-200 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="font-semibold">Official Gazette Ref:</span>
                    <span className="font-mono text-gray-900">{comparison.rule?.sourceReference}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="font-semibold">Effective From:</span>
                    <span>{comparison.rule?.effectiveFrom}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700 pt-1 border-t border-gray-200">
                    <span className="font-semibold">Official Source:</span>
                    <a
                      href={comparison.rule?.officialSourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-forest hover:underline font-semibold"
                    >
                      Verify on Labour Department Portal
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Legal Disclaimer */}
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{comparison.disclaimer}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-gray-900">No Gazette Benchmark Found</h4>
                <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">{comparison.message}</p>
              </div>
            )
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
              <Scale className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-gray-900">Statutory Wage Benchmark Comparison</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Fill the parameters on the left and click "Compare with Official Gazette" to verify your daily wage against government notified minimum rates.
              </p>
            </div>
          )}

          {/* Curated Gazette Rate Directory */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Curated Statutory Wage Rates (सरकारी न्यूनतम मजदूरी दरें)
            </h3>
            <p className="text-xs text-gray-500 mb-4 font-devanagari">
              श्रम एवं रोजगार मंत्रालय व राज्य श्रम विभाग द्वारा अधिसूचित आधिकारिक दरें
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase border-b border-gray-100">
                  <tr>
                    <th className="py-2.5 px-3">State / Sphere</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Skill Level</th>
                    <th className="py-2.5 px-3 text-right">Statutory Rate</th>
                    <th className="py-2.5 px-3">Notification Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rules.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-2.5 px-3 font-semibold text-gray-900 whitespace-nowrap">
                        {r.state}
                      </td>
                      <td className="py-2.5 px-3">{r.employmentCategory}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-semibold">
                          {r.skillLevel}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-forest whitespace-nowrap">
                        ₹{(r.baseRatePaise + r.variableAllowancePaise) / 100}/day
                      </td>
                      <td className="py-2.5 px-3 text-gray-500 text-[11px] truncate max-w-[150px]">
                        {r.sourceReference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
