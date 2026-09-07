import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-800">
          <div>
            <h4 className="text-white font-bold mb-2">{t.brandName} Platform</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {t.brandTagline}
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Government Links</h4>
            <ul className="space-y-1 text-[11px]">
              <li><a href="#" className="hover:text-white transition">Tamil Nadu e-Governance Agency (TNeGA)</a></li>
              <li><a href="#" className="hover:text-white transition">Department of Survey and Settlement</a></li>
              <li><a href="#" className="hover:text-white transition">National Portal of India</a></li>
              <li><a href="#" className="hover:text-white transition">Digital India Land Records Modernization</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Security & Standards</h4>
            <ul className="space-y-1 text-[11px]">
              <li className="flex items-center gap-1"><Lock className="w-3 h-3 text-emerald-400" /> AES-256 GCM Sensitive Data Encryption</li>
              <li className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-gov-gold" /> {t.tamperProofBlockchainProtected}</li>
              <li>Role-Based Access Control & Immutable Auditing</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Disclaimer</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              {t.aiDisclaimer}
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500">
          <p>© 2026 {t.brandName} – {t.officialGovtPortal}. {t.allRightsReserved}</p>
          <p className="mt-2 sm:mt-0 font-mono">ISO 27001 Certified • Secure Cloud Architecture</p>
        </div>
      </div>
    </footer>
  );
};
