import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Phone, Lock, User, Briefcase, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import type { WorkerTrade } from '../../types';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    trade: 'MASON' as WorkerTrade,
    stateCode: 'MH',
    district: '',
    password: '',
    preferredLang: 'hi',
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const tradeOptions = [
    { value: 'MASON', label: 'राजमिस्त्री (Mason)' },
    { value: 'HELPER', label: 'हेल्पर / बेलदार (Helper / Beldar)' },
    { value: 'CARPENTER', label: 'बढ़ई (Carpenter)' },
    { value: 'PAINTER', label: 'पेंटर (Painter)' },
    { value: 'LOADER', label: 'लोडर / पल्लेदार (Loader)' },
    { value: 'ELECTRICIAN', label: 'इलेक्ट्रीशियन (Electrician)' },
    { value: 'PLUMBER', label: 'प्लम्बर (Plumber)' },
    { value: 'AGRICULTURAL_LABOURER', label: 'कृषि मजदूर (Agricultural Labourer)' },
    { value: 'GENERAL_LABOUR', label: 'सामान्य मजदूर (General Labour)' },
    { value: 'OTHER', label: 'अन्य काम (Other)' },
  ];

  const stateOptions = [
    { code: 'MH', name: 'Maharashtra (महाराष्ट्र)' },
    { code: 'DL', name: 'Delhi (दिल्ली)' },
    { code: 'UP', name: 'Uttar Pradesh (उत्तर प्रदेश)' },
    { code: 'BR', name: 'Bihar (बिहार)' },
    { code: 'KA', name: 'Karnataka (कर्नाटक)' },
    { code: 'RJ', name: 'Rajasthan (राजस्थान)' },
    { code: 'MP', name: 'Madhya Pradesh (मध्य प्रदेश)' },
    { code: 'WB', name: 'West Bengal (पश्चिम बंगाल)' },
    { code: 'GJ', name: 'Gujarat (गुजरात)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.phone.length !== 10) {
      setError('कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें (10-digit mobile number required)');
      return;
    }

    if (formData.password.length < 6) {
      setError('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए (Password must be at least 6 characters)');
      return;
    }

    setSubmitting(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            नया खाता बनाएं
          </h2>
          <p className="mt-1 text-sm font-medium text-brand-700">
            Hisaab-Saboot — Apne kaam ka hisaab, apne phone mein.
          </p>
        </div>

        <div className="mt-7 bg-white py-8 px-6 shadow-card rounded-2xl border border-slate-200/80 sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-700 font-medium leading-relaxed">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="form-label">
                Full Name (आपका पूरा नाम)
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="form-input pl-10"
                  required
                />
              </div>
            </div>

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
                  type="tel"
                  maxLength={10}
                  placeholder="10 अंकों का मोबाइल नंबर"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  className="form-input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="trade" className="form-label">
                Trade / Kaam (आपका मुख्य काम)
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Briefcase className="h-4 w-4" />
                </div>
                <select
                  id="trade"
                  value={formData.trade}
                  onChange={(e) => setFormData({ ...formData, trade: e.target.value as WorkerTrade })}
                  className="form-input pl-10 bg-white"
                >
                  {tradeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="stateCode" className="form-label">
                  State (राज्य)
                </label>
                <div className="relative mt-1">
                  <select
                    id="stateCode"
                    value={formData.stateCode}
                    onChange={(e) => setFormData({ ...formData, stateCode: e.target.value })}
                    className="form-input bg-white text-xs"
                  >
                    {stateOptions.map((st) => (
                      <option key={st.code} value={st.code}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="district" className="form-label">
                  City / District (शहर)
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <input
                    id="district"
                    type="text"
                    placeholder="e.g. Pune"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="form-input pl-9 text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password (पासवर्ड बनाएं)
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="कम से कम 6 अक्षर"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="form-input pl-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 text-base shadow-sm mt-2"
            >
              {submitting ? (
                <span>रजिस्टर हो रहा है...</span>
              ) : (
                <>
                  <span>Create Account (खाता बनाएं)</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              पहले से खाता है? (Already registered?){' '}
              <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800 underline">
                Log In (लॉग इन करें)
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
