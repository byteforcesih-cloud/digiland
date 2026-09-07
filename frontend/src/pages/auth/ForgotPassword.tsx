import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Lock, KeyRound, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/authService';
import { useTranslation } from '../../context/LanguageContext';

export const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setSuccessMsg(res.message);
      if (res.demo_reset_token) {
        setToken(res.demo_reset_token); // Auto-populate demo reset token for convenience
      }
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to dispatch reset instructions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg(t.passwordsDoNotMatch);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.resetPassword(email, token, newPassword, confirmPassword);
      setSuccessMsg(res.message);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Password reset failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-100">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        <div className="bg-gov-navy p-6 text-white text-center border-b-4 border-gov-gold">
          <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-gov-gold to-amber-600 flex items-center justify-center shadow-lg">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">{t.forgotPasswordTitle}</h2>
          <p className="text-xs text-slate-300">{t.forgotPasswordSubtitle}</p>
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

          {step === 1 ? (
            <form onSubmit={handleRequestToken} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.emailAddress}</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@digiland.gov.in"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gov-navy hover:bg-gov-navyDark text-white font-bold rounded-xl shadow-lg transition"
              >
                {isLoading ? t.processing : t.sendResetLink}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reset Verification Token</label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste token received"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.newPassword}</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.confirmNewPassword}</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gov-navy hover:bg-gov-navyDark text-white font-bold rounded-xl shadow-lg transition"
              >
                {isLoading ? t.processing : t.save}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs">
            <Link to="/login" className="inline-flex items-center gap-1 text-slate-600 hover:text-gov-navy font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" /> {t.backToSignIn}
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
