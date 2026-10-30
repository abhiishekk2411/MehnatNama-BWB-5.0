import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Phone, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone || !password) {
      setError('कृपया मोबाइल नंबर और पासवर्ड दर्ज करें (Please enter mobile and password)');
      return;
    }

    setSubmitting(true);
    try {
      await login({ phone, password });
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setPhone('9876543210');
    setPassword('worker123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Logo and Tagline */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Hisaab-Saboot
          </h2>
          <p className="mt-1 text-sm font-medium text-brand-700">
            हिसाब-सबूत — अपने काम का हिसाब, अपने फोन में।
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-white py-8 px-6 shadow-card rounded-2xl border border-slate-200/80 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-700 font-medium leading-relaxed">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="phone" className="form-label">
                Mobile Number (मोबाइल नंबर)
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  maxLength={10}
                  placeholder="10 अंकों का मोबाइल नंबर (e.g. 9876543210)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="form-input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password (पासवर्ड)
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="अपना पासवर्ड डालें"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 text-base shadow-sm"
            >
              {submitting ? (
                <span>Checking... (जाँच हो रही है...)</span>
              ) : (
                <>
                  <span>Log In (लॉग इन करें)</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Pill */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="p-3 bg-brand-50/70 rounded-xl border border-brand-200/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-700 shrink-0" />
                <span className="text-xs text-brand-900 font-medium">Demo Worker Account</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs font-semibold text-brand-700 hover:text-brand-800 bg-white px-2.5 py-1 rounded-lg border border-brand-200 shadow-2xs hover:bg-brand-50"
              >
                1-Click Demo Fill
              </button>
            </div>
          </div>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              नया खाता बनाना है? (Don't have an account?){' '}
              <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-800 underline">
                Register (रजिस्टर करें)
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <span>सुरक्षित व गोपनीय</span>
          <span>•</span>
          <span>No Aadhaar Required</span>
          <span>•</span>
          <span>100% Free for Workers</span>
        </div>
      </div>
    </div>
  );
};
