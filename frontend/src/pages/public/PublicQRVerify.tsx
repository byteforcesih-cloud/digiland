import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  QrCode, 
  Loader2, 
  Building2, 
  MapPin, 
  Calendar,
  Lock,
  ExternalLink
} from 'lucide-react';
import { qrVerifyService } from '../../services/qrVerifyService';
import { useTranslation } from '../../context/LanguageContext';

export const PublicQRVerify: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { t, formatStatus, formatDate } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const resolveToken = async () => {
      if (!token) {
        setError('No verification token provided in request URL.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await qrVerifyService.resolvePublicToken(token);
        setData(res);
      } catch (err: any) {
        setError(err?.response?.data?.detail || 'Invalid, expired, or revoked digital certificate token.');
      } finally {
        setLoading(false);
      }
    };

    resolveToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-slate-800/90 border border-slate-700 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-700/80 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
              {t.officialGovtPortal}
            </span>
            <h1 className="text-lg font-bold text-white">
              {t.brandName} - {t.verificationStatus}
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto" />
            <p className="text-xs text-slate-400">{t.processing}</p>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/30 p-6 rounded-2xl text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
            <h2 className="text-sm font-bold text-rose-300">Verification Notice</h2>
            <p className="text-xs text-rose-200/80">{error}</p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Status Pill */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-emerald-300 block">
                    {t.statusVerified} - {t.tamperProofBlockchainProtected}
                  </span>
                  <span className="text-[11px] text-emerald-400/80">
                    {formatDate(data.last_verified_date || new Date().toISOString())}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold">
                {formatStatus(data.verification_status)}
              </span>
            </div>

            {/* Document Details Table */}
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">{t.details}</span>
                <span className="font-mono font-bold text-white">{data.document_reference_number}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">{t.status}</span>
                <span className="font-semibold text-white">{data.document_type}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">{t.district} / {t.taluk} / {t.village}</span>
                <span className="font-semibold text-white">{data.village}, {data.taluk}, {data.district}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">{t.surveyNumber}</span>
                <span className="font-bold text-indigo-400">{data.survey_number}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">{t.blockHash}</span>
                <span className="font-mono text-[10px] text-amber-400 truncate max-w-[200px]">{data.blockchain_block_hash}</span>
              </div>
            </div>

            {/* Privacy Disclaimer */}
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40 text-[11px] text-slate-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{data.disclaimer}</span>
            </div>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1.5"
              >
                {t.login} <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
