import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCw, 
  FileText, 
  Layers, 
  HelpCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { AIReviewData } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

interface AIReviewModalProps {
  documentId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const AIReviewModal: React.FC<AIReviewModalProps> = ({ documentId, isOpen, onClose }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<AIReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReview = async (force: boolean = false) => {
    if (force) {
      setIsRegenerating(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const res = force 
        ? await aiService.regenerateAIReview(documentId)
        : await aiService.getAIReview(documentId);
      setData(res);
    } catch (err: any) {
      console.error('Failed to load AI Review:', err);
      setError(err.response?.data?.detail || 'Failed to generate AI Review for this document.');
    } finally {
      setIsLoading(false);
      setIsRegenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen && documentId) {
      fetchReview(false);
    }
  }, [isOpen, documentId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">{t.aiReviewTitle}</h2>
                {data && (
                  <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full font-mono font-bold border border-indigo-400/30">
                    v{data.version}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {t.aiReviewSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchReview(true)}
              disabled={isLoading || isRegenerating}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition disabled:opacity-50"
              title={t.regenerateAIReview}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? t.processing : t.regenerateAIReview}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs bg-slate-50/50">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-bold text-slate-700 text-sm">{t.processing}...</p>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                {t.pleaseWait}
              </p>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-2 text-center">
              <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
              <h4 className="font-extrabold text-sm">{t.statusFailed}</h4>
              <p>{error}</p>
              <button
                onClick={() => fetchReview(true)}
                className="mt-2 px-4 py-2 bg-rose-600 text-white rounded-xl font-bold text-xs hover:bg-rose-700 transition"
              >
                {t.retry}
              </button>
            </div>
          ) : data ? (
            <>
              {/* Summary Score Banner */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.details}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {data.title} ({data.document_number})
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-[10px]">
                      {t.documentType}: {data.document_type}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      data.summary.overall_ai_score >= 80 
                        ? 'bg-emerald-100 text-emerald-800'
                        : data.summary.overall_ai_score >= 60 
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {t.qualityGrade}: {data.summary.quality_grade}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">{t.overallAIScore}</span>
                    <span className="text-2xl font-black text-indigo-700 font-mono">
                      {data.summary.overall_ai_score}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.ocrConfidence}</span>
                  <span className="text-lg font-black text-slate-800 font-mono mt-0.5 block">
                    {data.summary.ocr_confidence}%
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium">{t.confidenceScore}</span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.tamperRiskScore}</span>
                  <span className={`text-lg font-black font-mono mt-0.5 block ${
                    data.summary.risk_score > 40 ? 'text-rose-600' : 'text-slate-800'
                  }`}>
                    {data.summary.risk_score}/100
                  </span>
                  <span className={`text-[10px] font-bold ${
                    data.summary.risk_level === 'LOW' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {data.summary.risk_level}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.duplicateOverlapRisk}</span>
                  <span className={`text-lg font-black font-mono mt-0.5 block ${
                    data.summary.is_duplicate_flagged ? 'text-rose-600' : 'text-slate-800'
                  }`}>
                    {data.summary.duplicate_similarity}%
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {data.summary.is_duplicate_flagged ? t.statusDuplicateSuspected : t.statusActive}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.ruleValidationChecks}</span>
                  <span className="text-lg font-black text-slate-800 font-mono mt-0.5 block">
                    {data.summary.validation_passed_count}/{data.summary.validation_total_count}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {data.summary.validation_errors} / {data.summary.validation_warnings}
                  </span>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 space-y-2">
                <span className="font-extrabold text-xs text-indigo-950 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  {t.officerRecommendations}
                </span>
                <ul className="space-y-1.5 text-xs text-indigo-900 font-medium">
                  {data.recommendations.map((rec, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <span className="text-indigo-600 shrink-0">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Extracted Schedule Fields */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider block">
                  {t.extracted17Fields} ({data.extracted_schedule.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {data.extracted_schedule.map((f, fIdx) => (
                    <div key={fIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{f.field_label}</span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{f.confidence}%</span>
                      </div>
                      <p className="font-bold text-slate-800 truncate" title={f.field_value}>
                        {f.field_value || <span className="text-slate-300 italic">—</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inconsistencies / Validation Findings if any */}
              {data.inconsistencies && data.inconsistencies.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                  <span className="font-bold text-xs text-amber-950 flex items-center gap-1.5 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    {t.inconsistenciesDetected}
                  </span>
                  <div className="space-y-1.5 text-xs text-amber-900">
                    {data.inconsistencies.map((inc, iIdx) => (
                      <div key={iIdx} className="flex items-start gap-2">
                        <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-200 text-amber-900">
                          {inc.severity}
                        </span>
                        <span><strong>{inc.field}:</strong> {inc.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <p className="text-[10px] text-slate-400 text-center italic">
                {data.disclaimer || t.aiDisclaimer}
              </p>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
};
