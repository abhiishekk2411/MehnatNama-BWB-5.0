import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Wallet,
  Clock,
  Briefcase,
  AlertCircle,
  PlusCircle,
  FileCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const WorkerDashboardPage: React.FC = () => {
  const { worker } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-emerald-600 rounded-2xl p-6 text-white shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-medium backdrop-blur-xs mb-2">
              <span>कामगार डिजिटल डायरी</span>
              <span>•</span>
              <span>{worker?.stateCode || 'MH'} Zone</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              नमस्ते, {worker?.fullName || 'साथी'}!
            </h1>
            <p className="mt-1 text-sm text-brand-100 font-medium">
              Apne kaam ka hisaab, apne phone mein. Saboot ke saath.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-white text-brand-800 hover:bg-brand-50 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all"
            >
              <PlusCircle className="h-4 w-4 text-brand-600" />
              <span>नया काम जोड़ें</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Earned */}
        <div className="card">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">कुल कमाई (Total Earned)</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            ₹3,815
          </div>
          <p className="text-xs text-slate-500 mt-1">
            6 दिन काम किया (Calculated from daily logs)
          </p>
        </div>

        {/* Card 2: Advances / Kharcha Received */}
        <div className="card">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">मिला हुआ पैसा (Advances)</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            ₹1,500
          </div>
          <p className="text-xs text-slate-500 mt-1">
            2 बार खर्चा मिला (Cash & UPI)
          </p>
        </div>

        {/* Card 3: Outstanding Balance */}
        <div className="card border-brand-200 bg-brand-50/40">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-900">
              बाकी पैसा (Net Balance Due)
            </span>
            <div className="h-8 w-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-brand-800">
            ₹2,315
          </div>
          <p className="text-xs text-brand-700 mt-1 font-medium">
            ठेकेदार से लेना बाकी है (Payable by Contractor)
          </p>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/jobs"
          className="card-hover flex items-start gap-4 p-5 group"
        >
          <div className="h-12 w-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors">
            <Briefcase className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                साइट व हाजिरी (Worksites & Attendance)
              </h3>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              आज की हाजिरी (Full-Day, Half-Day, Overtime) और नगद खर्चा दर्ज करें।
            </p>
          </div>
        </Link>

        <Link
          to="/benchmarks"
          className="card-hover flex items-start gap-4 p-5 group"
        >
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FileCheck className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                सरकारी न्यूनतम मजदूरी (Minimum Wage Rates)
              </h3>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              अपने राज्य और काम के अनुसार सरकारी रेट चेक करें।
            </p>
          </div>
        </Link>
      </div>

      {/* Informational Legal / Rights Notice */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-subtle flex items-start gap-3.5">
        <AlertCircle className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-900">
            हिसाब-सबूत नियम (Contemporaneous Record Principle):
          </p>
          <p className="mt-0.5">
            हर दिन का काम उसी शाम को दर्ज करने से आपका रिकॉर्ड मजबूत सबूत (Contemporaneous Evidence) बनता है। काम पूरा होने पर ठेकेदार को वेरिफिकेशन लिंक भेजकर डिजिटल मुहर लगवाएं।
          </p>
        </div>
      </div>
    </div>
  );
};
