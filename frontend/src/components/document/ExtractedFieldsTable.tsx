import React from 'react';
import { ExtractedField } from '../../types';
import { AlertTriangle, CheckCircle2, UserCheck } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

interface ExtractedFieldsTableProps {
  fields: ExtractedField[];
  isOfficerEditable?: boolean;
  onFieldChange?: (fieldName: string, value: string) => void;
}

export const ExtractedFieldsTable: React.FC<ExtractedFieldsTableProps> = ({
  fields,
  isOfficerEditable = false,
  onFieldChange
}) => {
  const { t } = useTranslation();

  if (!fields || fields.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
        {t.noData}
      </div>
    );
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 75) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-xs">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">{t.fieldLabel}</th>
            <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">{t.extractedValue}</th>
            <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">{t.confidenceScore}</th>
            <th className="px-4 py-3 text-left font-bold uppercase tracking-wider">{t.status}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {fields.map((f) => {
            const displayVal = f.is_modified_by_officer && f.officer_modified_value
              ? f.officer_modified_value
              : (f.field_value || '—');

            return (
              <tr key={f.id} className="hover:bg-slate-50/80 transition">
                
                {/* Field Label */}
                <td className="px-4 py-3 whitespace-nowrap text-slate-800 font-semibold">
                  {f.field_label}
                </td>

                {/* Field Value */}
                <td className="px-4 py-3 text-slate-900">
                  {isOfficerEditable ? (
                    <input
                      type="text"
                      defaultValue={displayVal}
                      onChange={(e) => onFieldChange && onFieldChange(f.field_name, e.target.value)}
                      className={`w-full px-2.5 py-1 text-xs rounded border ${
                        f.is_modified_by_officer
                          ? 'border-purple-400 bg-purple-50/50 font-bold text-purple-900'
                          : 'border-slate-300 bg-white focus:ring-1 focus:ring-gov-navy'
                      }`}
                    />
                  ) : (
                    <div className="flex items-center space-x-1.5">
                      <span className={f.is_modified_by_officer ? 'font-bold text-purple-900' : ''}>
                        {displayVal}
                      </span>
                      {f.is_modified_by_officer && (
                        <span className="text-[10px] text-purple-600 bg-purple-100 px-1 rounded flex items-center gap-0.5">
                          <UserCheck className="w-3 h-3" /> {t.roleOfficer}
                        </span>
                      )}
                    </div>
                  )}
                </td>

                {/* AI Confidence Meter */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-slate-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${getProgressColor(f.confidence_score)}`}
                        style={{ width: `${Math.min(f.confidence_score, 100)}%` }}
                      />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getConfidenceColor(f.confidence_score)}`}>
                      {f.confidence_score.toFixed(1)}%
                    </span>
                  </div>
                </td>

                {/* Human Verification Tag */}
                <td className="px-4 py-3 whitespace-nowrap">
                  {f.requires_human_verification ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> {t.requiresHumanVerification}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {t.statusVerified}
                    </span>
                  )}
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
