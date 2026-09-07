import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, RefreshCw, Eye, Search, Plus, Sparkles } from 'lucide-react';
import { documentService } from '../../services/documentService';
import { DocumentItem } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ExtractedFieldsTable } from '../../components/document/ExtractedFieldsTable';
import { AIReviewModal } from '../../components/document/AIReviewModal';
import { useTranslation } from '../../context/LanguageContext';

export const MyDocuments: React.FC = () => {
  const { t, formatDate } = useTranslation();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [aiReviewDocId, setAiReviewDocId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocs = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const filteredDocs = documents.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.document_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.document_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gov-navy">{t.myDocuments}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.officialGovtPortal}
          </p>
        </div>

        <Link
          to="/citizen/upload"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gov-navy hover:bg-gov-navyDark text-white text-xs font-bold rounded-xl shadow transition"
        >
          <Plus className="w-4 h-4 text-gov-goldLight" />
          <span>{t.uploadDocument}</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${t.search}...`}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {t.totalDocuments}: <span className="font-bold text-slate-900">{filteredDocs.length}</span>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="font-bold">{t.noResultsFound}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-xs">
              <thead className="bg-slate-50 text-slate-700">
                <tr className="text-left font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">{t.documentNumber}</th>
                  <th className="px-4 py-3">{t.documentTitle} & {t.documentType}</th>
                  <th className="px-4 py-3">{t.version}</th>
                  <th className="px-4 py-3">{t.fileSize}</th>
                  <th className="px-4 py-3">{t.uploadedOn}</th>
                  <th className="px-4 py-3">{t.status}</th>
                  <th className="px-4 py-3 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {doc.document_number}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{doc.title}</div>
                      <div className="text-[11px] text-slate-500">{doc.document_type}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-800">
                        v{doc.current_version}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {(doc.file_size / (1024 * 1024)).toFixed(2)} MB
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(doc.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="px-4 py-3 text-right space-x-1.5">
                      <button
                        onClick={() => setAiReviewDocId(doc.id)}
                        className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition inline-flex items-center gap-1 font-bold text-[11px]"
                        title={t.aiReviewTitle}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>AI Review</span>
                      </button>
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-gov-navy transition"
                        title={t.viewDetails}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/citizen/download?docId=${doc.id}`}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition inline-block"
                        title={t.downloadCertificate}
                      >
                        <Download className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/citizen/update?docId=${doc.id}`}
                        className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition inline-block"
                        title={t.uploadNewVersion}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Extracted Particulars Modal */}
      {selectedDoc && (
        <Modal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title={`${t.extracted17Fields} – ${selectedDoc.title}`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
              <div><strong>{t.documentNumber}:</strong> <span className="font-mono">{selectedDoc.document_number}</span></div>
              <div><strong>{t.documentType}:</strong> {selectedDoc.document_type}</div>
              <div><strong>{t.version}:</strong> v{selectedDoc.current_version}</div>
              <div><strong>{t.status}:</strong> <StatusBadge status={selectedDoc.status} /></div>
            </div>

            <ExtractedFieldsTable fields={selectedDoc.extracted_fields || []} />

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-gov-navy text-white text-xs font-bold rounded-xl"
              >
                {t.close}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Unified AI Review Modal */}
      {aiReviewDocId !== null && (
        <AIReviewModal
          documentId={aiReviewDocId}
          isOpen={aiReviewDocId !== null}
          onClose={() => setAiReviewDocId(null)}
        />
      )}

    </div>
  );
};
