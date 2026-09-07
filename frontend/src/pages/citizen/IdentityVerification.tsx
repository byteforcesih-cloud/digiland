import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  KeyRound, 
  UserCheck, 
  Sparkles, 
  CreditCard,
  MapPin,
  Calendar,
  Phone,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { identityService } from '../../services/identityService';
import { IdentityStatus, MockAadhaarProfile, OTPRequestResponse } from '../../types';
import { CaptchaWidget } from '../../components/common/CaptchaWidget';
import { useTranslation } from '../../context/LanguageContext';

export const IdentityVerification: React.FC = () => {
  const { t, formatStatus, formatDate } = useTranslation();
  const [statusData, setStatusData] = useState<IdentityStatus | null>(null);
  const [demoProfiles, setDemoProfiles] = useState<MockAadhaarProfile[]>([]);
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  
  // OTP Flow
  const [otpSession, setOtpSession] = useState<OTPRequestResponse | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState<number>(300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await identityService.getIdentityStatus();
      setStatusData(res);
      const profiles = await identityService.getDemoProfiles();
      setDemoProfiles(profiles);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch identity status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (otpSession && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSession, countdown]);

  const handleFormatAadhaar = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 12);
    let formatted = '';
    for (let i = 0; i < raw.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += '-';
      formatted += raw[i];
    }
    setAadhaarInput(formatted);
  };

  const handleSelectDemo = (profile: MockAadhaarProfile) => {
    if (profile.aadhaar_number) {
      handleFormatAadhaar(profile.aadhaar_number);
    } else {
      const synthDigits = `9901${profile.id.toString().padStart(4, '0')}4819`.slice(0, 12);
      handleFormatAadhaar(synthDigits);
    }
    setError('');
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    const rawDigits = aadhaarInput.replace(/\D/g, '');
    if (rawDigits.length !== 12) {
      setError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    try {
      setLoading(true);
      const res = await identityService.requestOTP(rawDigits, captchaToken, captchaAnswer);
      setOtpSession(res);
      setCountdown(res.expires_in_seconds || 300);
      setSuccessMsg(res.message);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to dispatch verification OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSession) return;
    setError('');
    setSuccessMsg('');

    try {
      setLoading(true);
      const res = await identityService.confirmOTP(otpSession.session_id, otpCode);
      setSuccessMsg(t.kycVerifiedSuccess);
      setOtpSession(null);
      setOtpCode('');
      await fetchStatus();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isVerified = statusData?.verification_status === 'VERIFIED';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <h1 className="text-2xl font-bold text-slate-800">{t.mockAadhaarTitle}</h1>
            </div>
            <p className="text-sm text-slate-500">
              {t.mockAadhaarSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                isVerified
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {isVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {t.statusVerified} {t.roleCitizen}
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-amber-600" />
                  {t.statusPending}
                </>
              )}
            </span>
          </div>
        </div>

        {/* Demo Synthetic Disclaimer */}
        <div className="mt-4 bg-sky-50 border border-sky-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-sky-800">
          <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-0.5">{t.syntheticDemoAccounts}</p>
            <p>
              {t.tamperProofBlockchainProtected}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-700 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Verification Form / Profile Card */}
        <div className="lg:col-span-7 space-y-6">
          {isVerified && statusData?.profile ? (
            /* Digital Aadhaar Card Presentation */
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-500/30 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-indigo-800/60 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center font-bold text-amber-300 text-xs">
                    स
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-wider uppercase">{t.officialGovtPortal}</h3>
                    <p className="text-[10px] text-indigo-300">{t.mockAadhaarTitle}</p>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.statusVerified}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="sm:col-span-1 flex flex-col items-center justify-center bg-indigo-900/40 border border-indigo-700/40 rounded-xl p-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-700/50 flex items-center justify-center text-indigo-200 mb-2">
                    <UserCheck className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-semibold text-center">{statusData.profile.full_name}</span>
                  <span className="text-[10px] text-indigo-300">{statusData.profile.gender}</span>
                </div>

                <div className="sm:col-span-2 space-y-2 text-xs text-indigo-100">
                  <div>
                    <span className="text-indigo-400 block text-[10px] uppercase">{t.fullName}</span>
                    <span className="font-semibold text-sm">{statusData.profile.full_name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-indigo-400 block text-[10px] uppercase">{t.ownerName}</span>
                      <span className="font-medium">{statusData.profile.father_name}</span>
                    </div>
                    <div>
                      <span className="text-indigo-400 block text-[10px] uppercase">{t.date}</span>
                      <span className="font-medium">{statusData.profile.date_of_birth}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-indigo-400 block text-[10px] uppercase">{t.cascadingLocationFilter}</span>
                    <span className="text-indigo-200">
                      {statusData.profile.address_line}, {statusData.profile.village_town}, {statusData.profile.district}, {statusData.profile.state} - {statusData.profile.pincode}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-900/80 border border-indigo-700/50 rounded-xl p-3 flex items-center justify-between font-mono tracking-widest text-lg font-bold text-center text-amber-300">
                <span>{statusData.profile.aadhaar_masked}</span>
                <span className="text-[10px] font-sans tracking-normal text-indigo-300 font-normal bg-indigo-950 px-2 py-1 rounded">
                  {statusData.verified_at ? formatDate(statusData.verified_at) : t.statusActive}
                </span>
              </div>
            </div>
          ) : (
            /* Aadhaar Entry & OTP Trigger */
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                {t.enter12DigitAadhaar}
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                {t.syntheticDemoAccounts}
              </p>

              <form onSubmit={handleRequestOTP} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.enter12DigitAadhaar}
                  </label>
                  <input
                    type="text"
                    value={aadhaarInput}
                    onChange={(e) => handleFormatAadhaar(e.target.value)}
                    placeholder="e.g. 9901-0001-4819"
                    maxLength={14}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-lg font-mono tracking-widest focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 outline-none transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    {t.details}
                  </p>
                </div>

                {/* Risk-based CAPTCHA */}
                <CaptchaWidget
                  actionType="AADHAAR_OTP_REQUEST"
                  onVerified={(token, answer) => {
                    setCaptchaToken(token);
                    setCaptchaAnswer(answer);
                    setIsCaptchaValid(true);
                  }}
                  onInvalidated={() => setIsCaptchaValid(false)}
                />

                <button
                  type="submit"
                  disabled={loading || aadhaarInput.replace(/\D/g, '').length !== 12 || !isCaptchaValid}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  {loading ? `${t.processing}...` : t.requestOTP}
                </button>
              </form>

              {/* OTP Confirmation Modal / Box */}
              {otpSession && (
                <div className="mt-6 pt-6 border-t border-slate-200 bg-indigo-50/60 rounded-xl p-4 border border-indigo-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-indigo-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      {t.enter6DigitOTP}
                    </h3>
                    <span className="text-xs font-mono text-indigo-700 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Simulated OTP Notification Banner */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 text-xs text-amber-900">
                    <p className="font-semibold flex items-center gap-1 mb-1">
                      <Phone className="w-3.5 h-3.5 text-amber-700" />
                      SMS: {otpSession.phone_masked}
                    </p>
                    <div className="font-mono text-sm bg-white px-2.5 py-1.5 rounded border border-amber-300 inline-block font-bold tracking-widest text-indigo-950">
                      {otpSession.demo_otp}
                    </div>
                  </div>

                  <form onSubmit={handleConfirmOTP} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder={t.enter6DigitOTP}
                        maxLength={6}
                        className="w-full px-4 py-2.5 border border-indigo-200 rounded-lg text-center text-xl font-mono tracking-widest font-bold focus:ring-2 focus:ring-indigo-300 outline-none bg-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setOtpCode(otpSession.demo_otp)}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        Auto-fill
                      </button>
                      <button
                        type="submit"
                        disabled={loading || otpCode.length !== 6}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors disabled:opacity-50"
                      >
                        {loading ? `${t.processing}...` : t.verifyOTP}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Pre-seeded Synthetic Demo Profiles */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {t.syntheticDemoAccounts}
              </h3>
              <span className="text-xs text-slate-400">
                {demoProfiles.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              {t.useDemoProfile}:
            </p>

            <div className="max-h-96 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
              {demoProfiles.slice(0, 10).map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => handleSelectDemo(profile)}
                  className="pt-2 first:pt-0 pb-2 cursor-pointer hover:bg-indigo-50/60 p-2 rounded-xl transition-all border border-transparent hover:border-indigo-100 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800 group-hover:text-indigo-900">
                      {profile.full_name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {profile.aadhaar_masked}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {profile.district}, {profile.state}
                    </span>
                    <span>•</span>
                    <span className="text-indigo-600 font-mono font-semibold">📱 +91 {profile.phone_number}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
