import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Eye, 
  FileText, 
  ShieldAlert, 
  MessageSquare,
  CopyCheck,
  Save,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { ExtractedFieldsTable } from '../document/ExtractedFieldsTable';
import { verificationService } from '../../services/verificationService';
import { aiService } from '../../services/aiService';
import { StatusBadge } from '../common/Badge';
import { AIReviewData } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

interface SplitScreenVerifierProps {
  data: any; // review data payload
  onActionComplete: () => void;
}

export const SplitScreenVerifier: React.FC<SplitScreenVerifierProps> = ({
  data,
  onActionComplete
}) => {
  const { t, formatStatus, formatDate } = useTranslation();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [correctionInstructions, setCorrectionInstructions] = useState('');
  const [fieldAdjustments, setFieldAdjustments] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Compulsory AI Review Data State
  const [aiReview, setAiReview] = useState<AIReviewData | null>(null);
  const [isLoadingAiReview, setIsLoadingAiReview] = useState(true);

  const doc = data.document;
  const fields = data.extracted_fields || [];
  const validation = data.validation_result;
  const duplicate = data.duplicate_detection;

  const loadAiReview = async (force: boolean = false) => {
    setIsLoadingAiReview(true);
    try {
      const review = force 
        ? await aiService.regenerateAIReview(doc.id)
        : await aiService.getAIReview(doc.id);
      setAiReview(review);
    } catch (err) {
      console.error('Failed to load AI review for verification:', err);
    } finally {
      setIsLoadingAiReview(false);
    }
  };

  useEffect(() => {
    if (doc?.id) {
      loadAiReview(false);
    }
  }, [doc?.id]);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFieldAdjustments(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleDecision = async (decision: string) => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await verificationService.submitDecision({
        document_id: doc.id,
        decision,
        remarks: remarks || `Officer submitted decision: ${decision}`,
        correction_instructions: decision === 'REQUEST_CORRECTION' ? correctionInstructions : undefined,
        field_adjustments: Object.keys(fieldAdjustments).length > 0 ? fieldAdjustments : undefined
      });
      setFeedback({ type: 'success', message: `${t.decisionSubmittedSuccess} (${formatStatus(decision)})` });
      setTimeout(() => {
        onActionComplete();
      }, 1200);
    } catch (err: any) {
      console.error("Decision submission error:", err);
      setFeedback({ type: 'error', message: err.response?.data?.detail || 'Failed to record decision.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[750px] gap-4 bg-slate-100 p-3 rounded-2xl border border-slate-300">
      
      {/* LEFT SIDE: Original Document Viewer */}
      <div className="w-full lg:w-1/2 flex flex-col bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-700">
        
        {/* Viewer Controls */}
        <div className="p-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-white text-xs">
          <div className="flex items-center space-x-2 font-bold truncate">
            <FileText className="w-4 h-4 text-gov-gold" />
            <span className="truncate">{doc.original_filename}</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 20, 60))}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] px-1 text-slate-400">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 20, 200))}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRotation(prev => (prev + 90) % 360)}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
              title="Rotate"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Display Canvas */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950 relative min-h-[450px]">
          <div 
            className="transition-transform duration-200 shadow-2xl rounded bg-white p-6 text-slate-900 max-w-xl w-full border border-slate-700"
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
          >
            {/* Scanned Document Mock View Representation */}
            <div className="border-4 border-double border-slate-800 p-6 space-y-4 font-serif text-[11px] bg-amber-50/20">
              <div className="text-center border-b-2 border-slate-800 pb-3">
                <p className="text-[10px] font-sans font-bold tracking-widest text-slate-500 uppercase">{t.officialGovtPortal}</p>
                <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">{t.originalDeedPreview}</h2>
                <p className="text-[10px] italic">{t.tamperProofBlockchainProtected}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-sans">
                <div><strong>{t.documentNumber}:</strong> {doc.document_number}</div>
                <div><strong>{t.version}:</strong> v{doc.current_version}</div>
                <div><strong>{t.documentType}:</strong> {doc.document_type}</div>
                <div><strong>{t.date}:</strong> {formatDate(doc.created_at)}</div>
              </div>

              <div className="border-t border-b border-slate-400 py-3 space-y-1.5">
                {fields.slice(0, 8).map((f: any) => (
                  <div key={f.id} className="flex justify-between border-b border-dotted border-slate-300 pb-0.5">
                    <span className="font-semibold text-slate-700">{f.field_label}:</span>
                    <span className="font-mono text-slate-900">{f.field_value || '—'}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center text-[9px] text-slate-500 font-sans">
                [ {t.verifiedByOfficer} ]
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-2.5 bg-slate-800 border-t border-slate-700 text-slate-400 text-[10px] flex justify-between items-center">
          <span>{t.details}: {doc.file_type} • {(doc.file_size / (1024 * 1024)).toFixed(2)} MB</span>
          <span className="text-gov-gold flex items-center gap-1 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" /> {t.tamperProofBlockchainProtected}
          </span>
        </div>

      </div>

      {/* RIGHT SIDE: Extracted Information, Mandatory AI Review & Officer Actions */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Header bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-sm text-gov-navy">{doc.title}</h3>
              <StatusBadge status={doc.status} />
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">{doc.document_number}</p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2.5 py-1 rounded">
            {t.version} {doc.current_version}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Feedback message */}
          {feedback && (
            <div className={`p-3 rounded-lg text-xs font-bold ${feedback.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              {feedback.message}
            </div>
          )}

          {/* COMPULSORY AI REVIEW PANEL */}
          <div className="bg-gradient-to-r from-indigo-50/90 to-purple-50/90 border border-indigo-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                {t.compulsoryOfficerInspection}
              </span>
              <button
                onClick={() => loadAiReview(true)}
                disabled={isLoadingAiReview}
                className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-white/80 px-2.5 py-1 rounded-lg border border-indigo-200 flex items-center gap-1 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingAiReview ? 'animate-spin' : ''}`} />
                <span>{t.regenerateAIReview}</span>
              </button>
            </div>

            {isLoadingAiReview ? (
              <div className="py-4 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>{t.processing}...</span>
              </div>
            ) : aiReview ? (
              <div className="space-y-2.5 text-xs">
                {/* Score & Risk Badges */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white p-2 rounded-xl border border-indigo-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-bold">{t.overallAIScore}</span>
                    <span className="text-sm font-black text-indigo-700 font-mono">
                      {aiReview.summary.overall_ai_score}%
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-indigo-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-bold">{t.tamperRiskScore}</span>
                    <span className={`text-sm font-black font-mono ${
                      aiReview.summary.risk_level === 'LOW' ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {aiReview.summary.risk_level}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-indigo-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 block font-bold">{t.duplicateOverlapRisk}</span>
                    <span className={`text-sm font-black font-mono ${
                      aiReview.summary.is_duplicate_flagged ? 'text-rose-700' : 'text-emerald-700'
                    }`}>
                      {aiReview.summary.is_duplicate_flagged ? `${aiReview.summary.duplicate_similarity}%` : 'Clean'}
                    </span>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white/90 p-2.5 rounded-xl border border-indigo-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">{t.officerRecommendations}</span>
                  <ul className="space-y-1 text-[11px] text-indigo-950 font-medium">
                    {aiReview.recommendations.map((rec, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-1.5">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">{t.noData}</p>
            )}
          </div>

          {/* Validation Anomaly Alert */}
          {validation && validation.mismatch_details && validation.mismatch_details.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{t.inconsistenciesDetected} ({validation.mismatch_details.length})</span>
              </div>
              <ul className="text-[11px] text-amber-800 list-disc list-inside space-y-0.5">
                {validation.mismatch_details.map((m: any, idx: number) => (
                  <li key={idx}><strong>{m.rule}:</strong> {m.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Duplicate Record Alert */}
          {duplicate && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-xl space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-red-900">
                <CopyCheck className="w-4 h-4 text-red-600" />
                <span>{t.potentialDuplicateDetected} ({duplicate.similarity_score}% {t.similarityScore})</span>
              </div>
              <p className="text-[11px] text-red-800">
                {t.matchedFields}: {duplicate.matched_fields?.join(', ') || `${t.surveyNumber} / ${t.pattaNumber}`}.
              </p>
            </div>
          )}

          {/* Extracted Fields Table with Inline Officer Editing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t.extracted17Fields}
              </h4>
              <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-semibold border border-purple-200">
                {t.roleOfficer} {t.edit}
              </span>
            </div>
            <ExtractedFieldsTable
              fields={fields}
              isOfficerEditable={true}
              onFieldChange={handleFieldChange}
            />
          </div>

          {/* Officer Remarks and Instructions Form */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.officerRemarks}
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Cross-verified with Sub-Registrar Volume 412. Field boundaries correspond to FMB sketch."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.correctionInstructions}
              </label>
              <input
                type="text"
                value={correctionInstructions}
                onChange={(e) => setCorrectionInstructions(e.target.value)}
                placeholder="e.g. Please upload Schedule B with clear stamp registration seal."
                className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Officer Decision Actions Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDecision('APPROVE')}
              disabled={isSubmitting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{t.approveDeed}</span>
            </button>

            <button
              onClick={() => handleDecision('REJECT')}
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition"
            >
              <XCircle className="w-4 h-4" />
              <span>{t.rejectDeed}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDecision('REQUEST_CORRECTION')}
              disabled={isSubmitting}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.requestCorrection}</span>
            </button>

            <button
              onClick={() => handleDecision('MARK_DUPLICATE')}
              disabled={isSubmitting}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{t.markAsDuplicate}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
