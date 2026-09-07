import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCw, FileText, Upload, AlertTriangle, CheckCircle, ArrowRight, GitCommit } from 'lucide-react';
import { documentService } from '../../services/documentService';
import { DocumentItem } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { useTranslation } from '../../context/LanguageContext';

export const UpdateDocument: React.FC = () => {
  const { t, formatDate } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialDocId = searchParams.get('docId');

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDocId || '');
  const [file, setFile] = useState<File | null>(null);
  const [changeSummary, setChangeSummary] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedDoc, setUpdatedDoc] = useState<DocumentItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocId || !file) {
      setErrorMsg('Please select a document and an updated file.');
      return;
    }

    setIsUpdating(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('change_summary', changeSummary || 'Updated deed version with modified boundaries/schedule');

    try {
      const res = await documentService.updateDocumentVersion(Number(selectedDocId), formData);
      setUpdatedDoc(res);
      setFile(null);
    } catch (err: any) {
      console.error('Version update failure:', err);
      setErrorMsg(err.response?.data?.detail || 'Failed to update document version.');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentDoc = documents.find(d => d.id.toString() === selectedDocId);

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-gov-navy">{t.updateDocument}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.officialGovtPortal}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            
            {/* Document Selector */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.myDocuments}</label>
              <select
                value={selectedDocId}
                onChange={(e) => {
                  setSelectedDocId(e.target.value);
                  setUpdatedDoc(null);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gov-navy bg-white font-medium"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.document_number}) – Current: v{d.current_version}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload for Updated Version */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.uploadNewVersion} ({t.supportedFormats})</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-gov-navy bg-slate-50 transition cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs"
                />
                <p className="text-[11px] text-slate-400 mt-1">{t.dragAndDropFiles}</p>
              </div>
            </div>

            {/* Change Summary */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.reasonForUpdate}</label>
              <textarea
                rows={3}
                value={changeSummary}
                onChange={(e) => setChangeSummary(e.target.value)}
                placeholder="e.g. Revised boundary schedule following revenue re-survey or partition deed."
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gov-navy focus:outline-none"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={!file || isUpdating}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow transition ${
                !file || isUpdating
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gov-navy hover:bg-gov-navyDark text-white'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>{isUpdating ? `${t.processing}...` : t.uploadNewVersion}</span>
            </button>

          </form>
        </div>

        {/* Version History Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-gov-navy flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-gov-gold" />
            <span>{t.version}</span>
          </h3>

          {currentDoc ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">{t.version} {currentDoc.current_version}</span>
                  <StatusBadge status={currentDoc.status} />
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  {currentDoc.document_number}
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  {t.uploadedOn}: {formatDate(currentDoc.updated_at)}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                <strong>{t.details}:</strong> {t.tamperProofBlockchainProtected}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">{t.noData}</p>
          )}
        </div>

      </div>

      {/* Post-Update Diff Results */}
      {updatedDoc && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
            <CheckCircle className="w-5 h-5" />
            <span>{t.statusCompleted} – {t.version} {updatedDoc.current_version}</span>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{t.inconsistenciesDetected}</span>
            </div>
            <p className="text-[11px] text-amber-800">
              {t.status}: <StatusBadge status={updatedDoc.status} />. {t.requiresHumanVerification}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
