import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';
import { translations, TranslationDict } from '../i18n/translations';
import { useAuth } from './AuthContext';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationDict;
  formatStatus: (status: string) => string;
  formatDate: (date: string | Date | undefined | null) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateLanguagePreference } = useAuth();
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('digiland_lang') as LanguageCode) || 'en';
  });

  useEffect(() => {
    if (user?.preferred_language) {
      setLanguageState(user.preferred_language);
    }
  }, [user]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('digiland_lang', lang);
    updateLanguagePreference(lang);
  };

  const t = translations[language] || translations.en;

  const formatStatus = (status: string): string => {
    if (!status) return '';
    const norm = status.toUpperCase().replace(/\s+/g, '_');
    const map: Record<string, string> = {
      VERIFIED: t.statusVerified,
      APPROVED: t.statusVerified,
      PENDING: t.statusPending,
      PENDING_REVIEW: t.statusPending,
      REJECTED: t.statusRejected,
      VERIFICATION_REQUIRED: t.statusVerificationRequired,
      CORRECTION_REQUESTED: t.statusCorrectionRequested,
      DUPLICATE_SUSPECTED: t.statusDuplicateSuspected,
      DUPLICATE_DETECTED: t.statusDuplicateSuspected,
      UNDER_REVIEW: t.statusUnderReview,
      FLAGGED_BY_OFFICER: t.statusFlaggedByOfficer,
      DISMISSED: t.statusDismissed,
      CONFIRMED_FRAUD: t.statusConfirmedFraud,
      NEEDS_REVIEW: t.statusNeedsReview,
      SUBMITTED: t.statusSubmitted,
      RESOLVED: t.statusResolved,
      ACTIVE: t.statusActive,
      COMPLETED: t.statusCompleted,
      FAILED: t.statusFailed,
      ESCALATED: t.statusEscalated
    };
    return map[norm] || status.replace(/_/g, ' ');
  };

  const formatDate = (date: string | Date | undefined | null): string => {
    if (!date) return '';
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      const localeMap: Record<string, string> = {
        en: 'en-IN',
        ta: 'ta-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        kn: 'kn-IN',
        ml: 'ml-IN'
      };
      return d.toLocaleDateString(localeMap[language] || 'en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return String(date);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatStatus, formatDate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
