import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Lock, User as UserIcon, ShieldCheck, ArrowRight, AlertCircle, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';

interface DemoAccount {
  label: string;
  email: string;
  pass: string;
  role: 'CITIZEN' | 'GOVERNMENT_OFFICER';
  badge: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  { label: 'Citizen (Ramasamy S.)', email: 'citizen@digiland.gov.in', pass: 'Citizen@123', role: 'CITIZEN', badge: 'Citizen' },
  { label: 'Tahsildar (Dr. K. Ananthakrishnan)', email: 'officer@digiland.gov.in', pass: 'Officer@123', role: 'GOVERNMENT_OFFICER', badge: 'Tahsildar' },
  { label: 'Senior Revenue Officer (S. Meenakshi)', email: 'senior.officer@digiland.gov.in', pass: 'Officer@123', role: 'GOVERNMENT_OFFICER', badge: 'Senior Officer' },
  { label: 'District Revenue Officer (R. Balasubramanian)', email: 'dro.chennai@digiland.gov.in', pass: 'Officer@123', role: 'GOVERNMENT_OFFICER', badge: 'DRO' },
  { label: 'GIS & Cadastral Officer (K. Rajesh)', email: 'gis.officer@digiland.gov.in', pass: 'Officer@123', role: 'GOVERNMENT_OFFICER', badge: 'GIS' },
  { label: 'Validation Officer (V. Priya)', email: 'val.officer@digiland.gov.in', pass: 'Officer@123', role: 'GOVERNMENT_OFFICER', badge: 'Validation' },
  { label: 'System Admin (DevOps)', email: 'admin@digiland.gov.in', pass: 'Admin@123', role: 'GOVERNMENT_OFFICER', badge: 'Admin' },
];

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState('citizen@digiland.gov.in');
  const [password, setPassword] = useState('Citizen@123');
  const [selectedRole, setSelectedRole] = useState<'CITIZEN' | 'GOVERNMENT_OFFICER'>('CITIZEN');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const applyDemo = (acc: DemoAccount) => {
    setSelectedRole(acc.role);
    setEmailOrPhone(acc.email);
    setPassword(acc.pass);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      await login(emailOrPhone, password);
      if (emailOrPhone.includes('officer') || emailOrPhone.includes('dro') || emailOrPhone.includes('gis') || emailOrPhone.includes('val') || emailOrPhone.includes('admin') || selectedRole === 'GOVERNMENT_OFFICER') {
        navigate('/officer/dashboard');
      } else {
        navigate('/citizen/dashboard');
      }
    } catch (err: any) {
      console.error('Login failure:', err);
      setErrorMsg(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-slate-100">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Portal Header */}
        <div className="bg-gov-navy p-6 text-white text-center border-b-4 border-gov-gold">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-gov-gold to-amber-600 flex items-center justify-center shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">{t.brandName} Portal</h2>
          <p className="text-xs text-slate-300 mt-1">{t.brandTagline}</p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {/* Role Toggle Selector */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('CITIZEN');
                setEmailOrPhone('citizen@digiland.gov.in');
                setPassword('Citizen@123');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                selectedRole === 'CITIZEN'
                  ? 'bg-gov-navy text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.loginAsCitizen}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('GOVERNMENT_OFFICER');
                setEmailOrPhone('officer@digiland.gov.in');
                setPassword('Officer@123');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                selectedRole === 'GOVERNMENT_OFFICER'
                  ? 'bg-gov-navy text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.loginAsOfficer}
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.emailOrPhone}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="name@digiland.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy focus:border-transparent font-medium"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">{t.password}</label>
                <Link to="/forgot-password" className="text-[11px] text-blue-600 hover:underline font-semibold">
                  {t.forgotPassword}?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy focus:border-transparent font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gov-navy hover:bg-gov-navyDark text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <span>{t.processing}</span>
              ) : (
                <>
                  <span>{selectedRole === 'GOVERNMENT_OFFICER' ? `${t.login} (${t.roleOfficer})` : `${t.login} (${t.roleCitizen})`}</span>
                  <ArrowRight className="w-4 h-4 text-gov-goldLight" />
                </>
              )}
            </button>
          </form>

          {/* Demo Account Quick Switch Buttons (7 Profiles) */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-gov-gold" /> {t.demoCredentials}:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {DEMO_ACCOUNTS.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyDemo(acc)}
                  className={`p-2 rounded-xl border text-left text-[11px] transition flex flex-col justify-between ${
                    emailOrPhone === acc.email
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-bold text-slate-800 truncate">{acc.label}</span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded shrink-0">
                      {acc.badge}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{acc.email}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-600">
            {t.dontHaveAccount}{' '}
            <Link to="/register" className="text-gov-navy font-bold hover:underline">
              {t.register}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
