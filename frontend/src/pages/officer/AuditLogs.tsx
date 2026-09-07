import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, Search, Filter, Terminal } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { AuditLogItem } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

export const AuditLogs: React.FC = () => {
  const { t, language, formatDate } = useTranslation();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const data = await notificationService.getAuditLogs({
        action: actionFilter || undefined,
        entity_type: entityFilter || undefined
      });
      setLogs(data);
    } catch (err) {
      console.error('Failed to load system audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, entityFilter]);

  const i18n = {
    actionPlaceholder: {
      en: 'Filter by Action (e.g. OFFICER_DECISION)',
      ta: 'செயல் மூலம் வடிகட்டவும் (எ.கா. OFFICER_DECISION)',
      hi: 'क्रिया द्वारा फ़िल्टर करें (उदा. OFFICER_DECISION)',
      te: 'చర్య ద్వారా ఫిల్టర్ చేయండి (ఉదా. OFFICER_DECISION)',
      kn: 'ಕ್ರಿಯೆಯ ಮೂಲಕ ಫಿಲ್ಟರ್ ಮಾಡಿ (ಉದಾ. OFFICER_DECISION)',
      ml: 'പ്രവർത്തനം വഴി ഫിൽട്ടർ ചെയ്യുക (ഉദാ. OFFICER_DECISION)'
    }[language] || 'Filter by Action (e.g. OFFICER_DECISION)',
    entityPlaceholder: {
      en: 'Filter Entity (e.g. DOCUMENT)',
      ta: 'உருப்படி மூலம் வடிகட்டவும் (எ.கா. DOCUMENT)',
      hi: 'निकाय फ़िल्टर करें (उदा. DOCUMENT)',
      te: 'సంస్థను ఫిల్టర్ చేయండి (ఉదా. DOCUMENT)',
      kn: 'ಘಟಕವನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಿ (ಉದಾ. DOCUMENT)',
      ml: 'എന്റിറ്റി ഫിൽട്ടർ ചെയ്യുക (ഉദാ. DOCUMENT)'
    }[language] || 'Filter Entity (e.g. DOCUMENT)',
    loggedEvents: {
      en: 'Logged Events',
      ta: 'பதிவு செய்யப்பட்ட நிகழ்வுகள்',
      hi: 'दर्ज की गई घटनाएं',
      te: 'నమోదైన ఈవెంట్లు',
      kn: 'ದಾಖಲಾದ ಈವೆಂಟ್‌ಗಳು',
      ml: 'രേഖപ്പെടുത്തിയ ഇവന്റുകൾ'
    }[language] || 'Logged Events',
    entityHeader: {
      en: 'Entity',
      ta: 'உருப்படி',
      hi: 'निकाय',
      te: 'సంస్థ',
      kn: 'ಘಟಕ',
      ml: 'എന്റിറ്റി'
    }[language] || 'Entity'
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-gov-navy">{t.auditLogsTitle}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.auditLogsSubtitle}
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            placeholder={i18n.actionPlaceholder}
            className="px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gov-navy"
          />
          <input
            type="text"
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            placeholder={i18n.entityPlaceholder}
            className="px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gov-navy"
          />
        </div>

        <div className="text-slate-500 font-medium">
          {i18n.loggedEvents}: <span className="font-bold text-slate-900">{logs.length}</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-bold">{t.noResultsFound}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">{t.date}</th>
                  <th className="px-4 py-3 text-left">{t.emailAddress}</th>
                  <th className="px-4 py-3 text-left">{t.selectRole}</th>
                  <th className="px-4 py-3 text-left">{t.eventAction}</th>
                  <th className="px-4 py-3 text-left">{i18n.entityHeader}</th>
                  <th className="px-4 py-3 text-left">{t.ipAddress}</th>
                  <th className="px-4 py-3 text-left">{t.details}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-4 py-3 text-slate-900 font-semibold">{log.user_email || 'System'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.user_role === 'GOVERNMENT_OFFICER'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}>
                        {log.user_role || 'CITIZEN'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-900 font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {log.entity_type} {log.entity_id ? `(#${log.entity_id})` : ''}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-sans text-[11px] max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

