import React from 'react';
import { Plus, MapPin, Calendar, ArrowRight, UserCheck } from 'lucide-react';

export const JobsListPage: React.FC = () => {
  // Sample active job populated from seed data
  const sampleJobs = [
    {
      id: 'demo-job-1',
      title: 'Sharmaji Kothi 3rd Floor Construction',
      contractorName: 'Vikram Singh Thekedar',
      contractorPhone: '9822012345',
      siteLocation: 'Baner Hills, Pune',
      dailyWagePaise: 65000,
      standardHours: 8,
      startDate: '2026-10-01',
      status: 'ACTIVE',
      totalEarnedPaise: 381500,
      totalAdvancesPaise: 150000,
      netDuesPaise: 231500,
      daysWorked: 6,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Kaam & Sites (काम और साइट्स)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            यहाँ आपकी सभी चालू और पूरी हो चुकी साइट्स का हिसाब है।
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => alert('New job creation dialog will open in Phase 2!')}
        >
          <Plus className="h-4 w-4" />
          <span>नया काम जोड़ें (Add Site)</span>
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sampleJobs.map((job) => (
          <div key={job.id} className="card-hover flex flex-col justify-between">
            <div>
              {/* Job Status & Rate */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="badge-confirmed font-semibold">
                  चालू काम (Active Site)
                </span>
                <span className="text-sm font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                  ₹{job.dailyWagePaise / 100} / दिन
                </span>
              </div>

              {/* Title & Contractor */}
              <div className="mt-3">
                <h2 className="text-base font-bold text-slate-900 hover:text-brand-700 transition-colors">
                  {job.title}
                </h2>

                <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>ठेकेदार: <strong>{job.contractorName}</strong> ({job.contractorPhone})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{job.siteLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>शुरुआत: {job.startDate} • कुल हाजिरी: {job.daysWorked} दिन</span>
                  </div>
                </div>
              </div>

              {/* Mini Balance Strip */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl grid grid-cols-3 gap-2 text-center border border-slate-200/60">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">कुल कमाई</span>
                  <span className="text-xs font-bold text-slate-800">₹{job.totalEarnedPaise / 100}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">मिला खर्चा</span>
                  <span className="text-xs font-bold text-amber-700">₹{job.totalAdvancesPaise / 100}</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-900 uppercase font-semibold block">बाकी पैसा</span>
                  <span className="text-xs font-bold text-brand-700">₹{job.netDuesPaise / 100}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Phase 2 Core Ledger</span>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800"
              >
                <span>हाजिरी व हिसाब देखें</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
