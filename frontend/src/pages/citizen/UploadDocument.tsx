import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DropzoneUpload } from '../../components/document/DropzoneUpload';
import { ExtractedFieldsTable } from '../../components/document/ExtractedFieldsTable';
import { DocumentItem } from '../../types';
import { CheckCircle2, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { StatusBadge } from '../../components/common/Badge';
import { useTranslation } from '../../context/LanguageContext';

export const UploadDocument: React.FC = () => {
  const { t } = useTranslation();
  const [uploadedDoc, setUploadedDoc] = useState<DocumentItem | null>(null);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gov-navy">{t.uploadDocument}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.officialGovtPortal}
        </p>
      </div>

      {/* Upload Zone */}
      <DropzoneUpload
        onUploadSuccess={(doc) => {
          setUploadedDoc(doc);
        }}
      />

      {/* Post-Upload Extracted Results & AI Confidence Overview */}
      {uploadedDoc && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-4 animate-in fade-in">
          
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-emerald-900">
                  {t.statusCompleted}
                </h4>
                <p className="text-[11px] text-emerald-700">
                  {t.extracted17Fields}: {uploadedDoc.extracted_fields?.length || 17}. {t.status}: <StatusBadge status={uploadedDoc.status} />
                </p>
              </div>
            </div>

            <Link
              to="/citizen/status"
              className="px-3.5 py-1.5 bg-gov-navy hover:bg-gov-navyDark text-white text-xs font-bold rounded-lg transition flex items-center gap-1"
            >
              <span>{t.verificationStatus}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-gov-gold" />
              <span>{t.extracted17Fields} & {t.confidenceScore}</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              {t.ocrConfidence}: {uploadedDoc.ocr_result?.overall_confidence || 92}%
            </span>
          </div>

          <ExtractedFieldsTable fields={uploadedDoc.extracted_fields || []} />

        </div>
      )}

    </div>
  );
};
