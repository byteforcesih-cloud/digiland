import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Download, 
  FileCheck, 
  ShieldCheck, 
  QrCode, 
  Building, 
  CheckCircle2, 
  Lock, 
  KeyRound, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { documentService } from '../../services/documentService';
import { DocumentItem } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { useTranslation } from '../../context/LanguageContext';

export const DownloadDocument: React.FC = () => {
  const { t, formatStatus, formatDate } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialDocId = searchParams.get('docId');

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDocId || '');
  const [passwordHint, setPasswordHint] = useState<{
    document_number: string;
    survey_number: string;
    owner_name: string;
    password_hint: string;
    example_format: string;
  } | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        const data = await documentService.getDocuments();
        setDocuments(data);
        if (!selectedDocId && data.length > 0) {
          setSelectedDocId(data[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to load documents:', err);
      }
    };
    loadDocs();
  }, []);

  useEffect(() => {
    const loadHint = async () => {
      if (!selectedDocId) return;
      try {
        const hint = await documentService.getPasswordHint(Number(selectedDocId));
        setPasswordHint(hint);
      } catch {
        setPasswordHint(null);
      }
    };
    loadHint();
  }, [selectedDocId]);

  const currentDoc = documents.find((d) => d.id.toString() === selectedDocId);

  const handleStandardDownload = () => {
    if (!selectedDocId) return;
    const url = documentService.downloadCertificateUrl(Number(selectedDocId));
    window.open(url, '_blank');
  };

  const handleProtectedDownload = async () => {
    if (!currentDoc) return;
    try {
      setDownloading(true);
      await documentService.downloadProtectedPdf(currentDoc.id, currentDoc.document_number);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-gov-navy">{t.downloadCertificate}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.officialGovtPortal}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selector & Download Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.myDocuments}</label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-gov-navy bg-white font-medium outline-none"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.document_number}) – {formatStatus(d.status)}
                </option>
              ))}
            </select>
          </div>

          {currentDoc && (
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">{t.status}:</span>
                  <StatusBadge status={currentDoc.status} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{t.documentNumber}:</span>
                  <span className="font-mono font-bold text-slate-800">{currentDoc.document_number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{t.version}:</span>
                  <span className="font-mono text-slate-800">v{currentDoc.current_version}</span>
                </div>
              </div>

              {/* Password Hint Card */}
              {passwordHint && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2 text-amber-900">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <KeyRound className="w-4 h-4 text-amber-700" />
                    {t.passwordProtectedUnlockInfo}
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {t.passwordFormulaExplanation}
                  </p>
                  <div className="p-2 bg-white rounded-lg border border-amber-300 font-mono font-bold text-xs text-indigo-950 text-center tracking-wider">
                    {passwordHint.example_format}
                  </div>
                </div>
              )}

              {/* Download Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleProtectedDownload}
                  disabled={downloading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-800 hover:to-slate-900 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>{downloading ? `${t.processing}...` : `${t.download} (${t.password})`}</span>
                </button>

                <button
                  onClick={handleStandardDownload}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>{t.downloadCertificate}</span>
                </button>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.tamperProofBlockchainProtected}</span>
              </div>
            </div>
          )}
        </div>

        {/* Certificate Mock Visual Preview */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-6 text-slate-900 border-4 border-double border-gov-navy relative overflow-hidden text-[11px]">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none rotate-[-35deg] text-5xl font-black text-gov-navy uppercase select-none">
              DIGILAND VERIFIED
            </div>

            {/* Header */}
            <div className="text-center border-b-2 border-gov-navy pb-3 mb-3">
              <p className="text-[9px] font-bold text-gov-navy uppercase tracking-widest">{t.officialGovtPortal}</p>
              <h3 className="text-sm font-black text-slate-900 uppercase">{t.brandName}</h3>
              <p className="text-[10px] text-slate-500">{t.downloadCertificate}</p>
            </div>

            {/* Content Details */}
            {currentDoc ? (
              <div className="space-y-2 font-serif">
                <div className="flex justify-between font-mono text-[10px] border-b pb-1">
                  <span>{t.documentNumber}: {currentDoc.document_number}</span>
                  <span>{t.date}: {formatDate(new Date())}</span>
                </div>

                <div className="space-y-1 text-slate-800">
                  <p><strong>{t.documentTitle}:</strong> {currentDoc.title}</p>
                  <p><strong>{t.documentType}:</strong> {currentDoc.document_type}</p>
                  <p><strong>{t.status}:</strong> <span className="font-sans font-bold text-emerald-700">{formatStatus(currentDoc.status)}</span></p>
                  <p><strong>{t.version}:</strong> v{currentDoc.current_version}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between items-end font-sans">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-slate-800" />
                    </div>
                    <div className="text-[9px] text-slate-500">
                      <div>{t.scanDocument}</div>
                      <div className="font-mono text-emerald-600 font-bold">SHA-256 Valid</div>
                    </div>
                  </div>

                  <div className="text-right text-[9px]">
                    <div className="font-bold text-gov-navy">{t.verifiedByOfficer}</div>
                    <div className="text-slate-500">{t.brandTagline}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                {t.noData}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
