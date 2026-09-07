import React, { useState, useEffect } from 'react';
import { RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';
import { captchaService } from '../../services/captchaService';
import { CaptchaChallenge } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

interface CaptchaWidgetProps {
  actionType?: string;
  onVerified: (token: string, answer: string) => void;
  onInvalidated?: () => void;
}

export const CaptchaWidget: React.FC<CaptchaWidgetProps> = ({
  actionType = 'SENSITIVE_ACTION',
  onVerified,
  onInvalidated,
}) => {
  const { t } = useTranslation();
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const loadChallenge = async () => {
    try {
      setLoading(true);
      setError('');
      setVerified(false);
      setUserAnswer('');
      if (onInvalidated) onInvalidated();
      const chal = await captchaService.getChallenge(actionType);
      setChallenge(chal);
    } catch (err: any) {
      setError(t.noData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenge();
  }, [actionType]);

  const handleAnswerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserAnswer(val);
    setError('');

    if (val.trim().length >= 1 && challenge) {
      const isValid = await captchaService.verifyChallenge(challenge.captcha_token, val.trim());
      if (isValid) {
        setVerified(true);
        onVerified(challenge.captcha_token, val.trim());
      } else {
        setVerified(false);
        if (onInvalidated) onInvalidated();
      }
    } else {
      setVerified(false);
      if (onInvalidated) onInvalidated();
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-3 text-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-slate-700 flex items-center gap-1.5 text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          {t.accountSecurity} ({t.requiresHumanVerification})
        </span>
        <button
          type="button"
          onClick={loadChallenge}
          disabled={loading}
          className="text-xs text-sky-600 hover:text-sky-800 flex items-center gap-1 transition-colors font-medium"
          title={t.refresh}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {t.refresh}
        </button>
      </div>

      {challenge ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="bg-white px-3 py-2 border border-slate-300 rounded-lg font-mono font-medium text-slate-800 shadow-sm flex-1">
            {challenge.question}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userAnswer}
              onChange={handleAnswerChange}
              placeholder={t.extractedValue}
              className={`w-32 px-3 py-2 border rounded-lg text-center font-bold tracking-wider transition-all focus:outline-none ${
                verified
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200'
                  : error
                  ? 'border-red-400 bg-red-50'
                  : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
              }`}
            />
            {verified && (
              <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-100 px-2.5 py-1.5 rounded-md">
                ✓ {t.statusVerified}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="text-xs text-slate-400 py-1">{t.loading}</div>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};
