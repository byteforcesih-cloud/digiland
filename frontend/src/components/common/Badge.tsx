import React from 'react';
import { DocumentStatus } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

interface BadgeProps {
  status: DocumentStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const { formatStatus } = useTranslation();

  const getBadgeStyle = (st: string) => {
    switch (st.toUpperCase()) {
      case 'VERIFIED':
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'PENDING':
      case 'PENDING_REVIEW':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'VERIFICATION_REQUIRED':
      case 'UNDER_REVIEW':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'REJECTED':
      case 'CONFIRMED_FRAUD':
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'DUPLICATE_SUSPECTED':
      case 'DUPLICATE_DETECTED':
      case 'FLAGGED_BY_OFFICER':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'POTENTIALLY_ALTERED':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'CORRECTION_REQUESTED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'DISMISSED':
      case 'RESOLVED':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const badgeStyle = getBadgeStyle(status);
  const translatedLabel = formatStatus(status);

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${badgeStyle} ${className}`}>
      {translatedLabel}
    </span>
  );
};
