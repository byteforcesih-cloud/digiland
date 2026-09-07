import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, User, Phone, Mail, Lock, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';
import { useTranslation } from '../../context/LanguageContext';

export const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    age: 28,
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
    preferred_language: 'en'
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Client-side validations
    if (Number(formData.age) < 18) {
      setErrorMsg('You must be 18 years or older to register on the Land Records Portal.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setErrorMsg('Password and Confirm Password do not match.');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Phone number must contain at least 10 digits.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        ...formData,
        age: Number(formData.age),
        phone: cleanPhone,
        role: 'CITIZEN'
      });
      setSuccessMsg('Registration successful! Account activated with full citizen access. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMsg(err.response?.data?.detail || 'Failed to create account. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-slate-100">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gov-navy p-6 text-white text-center border-b-4 border-gov-gold">
          <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-gov-gold to-amber-600 flex items-center justify-center shadow-lg">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">{t.registerTitle}</h2>
          <p className="text-xs text-slate-300 mt-0.5">{t.registerSubtitle}</p>
        </div>

        <div className="p-6 sm:p-8">
          
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Full Name & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">{t.fullName}</label>
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Kathiravan D"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.age} (18+)</label>
                <input
                  type="number"
                  name="age"
                  min={18}
                  max={120}
                  required
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy font-mono"
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.phoneNumber}</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.emailAddress}</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="citizen.name@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy"
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.password}</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.confirmPassword}</label>
                <input
                  type="password"
                  name="confirm_password"
                  required
                  minLength={6}
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy"
                />
              </div>
            </div>

            {/* Privacy Note */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gov-emerald flex-shrink-0" />
              <span>{t.tamperProofBlockchainProtected}</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gov-navy hover:bg-gov-navyDark text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <span>{t.processing}</span>
              ) : (
                <span>{t.register}</span>
              )}
            </button>

          </form>

          <div className="mt-6 text-center text-xs text-slate-600">
            {t.alreadyHaveAccount}{' '}
            <Link to="/login" className="text-gov-navy font-bold hover:underline">
              {t.login}
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
