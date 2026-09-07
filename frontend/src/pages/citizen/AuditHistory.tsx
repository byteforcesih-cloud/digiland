import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, Activity, Terminal } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { AuditLogItem } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

export const AuditHistory: React.FC = () => {
  const { t, language, formatDate } = useTranslation();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await notificationService.getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error('Failed to load audit history:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const i18n = {
    title: {
      en: 'Activity Audit History',
      ta: 'செயல்பாட்டு தணிக்கை வரலாறு',
      hi: 'गतिविधि ऑडिट इतिहास',
      te: 'కార్యకలాపాల ఆడిట్ చరిత్ర',
      kn: 'ಚಟುವಟಿಕೆ ಆಡಿಟ್ ಇತಿಹಾಸ',
      ml: 'പ്രവർത്തന ഓഡിറ്റ് ചരിത്രം'
    }[language] || 'Activity Audit History',
    subtitle: {
      en: 'Immutable tamper-proof record of all document uploads, version updates, and access logs.',
      ta: 'அனைத்து ஆவணப் பதிவேற்றங்கள், பதிப்பு புதுப்பிப்புகள் மற்றும் அணுகல் பதிவுகளின் மாற்ற முடியாத தணிக்கைப் பதிவு.',
      hi: 'सभी दस्तावेज़ अपलोड, संस्करण अपडेट और एक्सेस लॉग का अपरिवर्तनीय छेड़छाड़-रोधी रिकॉर्ड।',
      te: 'అన్ని పత్రాల అప్‌లోడ్‌లు, వెర్షన్ అప్‌డేట్‌లు మరియు యాక్సెస్ లాగ్‌ల మార్చలేని రికార్డు.',
      kn: 'ಎಲ್ಲಾ ದಾಖಲೆ ಅಪ್‌ಲೋಡ್‌ಗಳು, ಆವೃತ್ತಿ ನವೀಕರಣಗಳು ಮತ್ತು ಪ್ರವೇಶ ಲಾಗ್‌ಗಳ ಬದಲಾಯಿಸಲಾಗದ ಆಡಿಟ್ ದಾಖಲೆ.',
      ml: 'എല്ലാ രേഖാ അപ്‌ലോഡുകൾ, പതിപ്പ് അപ്‌ഡേറ്റുകൾ, ആക്‌സസ് ലോഗുകൾ എന്നിവയുടെ സുരക്ഷിത ഓഡിറ്റ് റെക്കോർഡ്.'
    }[language] || 'Immutable tamper-proof record of all document uploads, version updates, and access logs.',
    noRecords: {
      en: 'No audit trail records yet',
      ta: 'தணிக்கைப் பதிவுகள் எதுவும் இன்னும் இல்லை',
      hi: 'अभी तक कोई ऑडिट ट्रेल रिकॉर्ड नहीं है',
      te: 'ఇంకా ఆడిట్ రికార్డులు ఏవీ లేవు',
      kn: 'ಇನ್ನೂ ಯಾವುದೇ ಆಡಿಟ್ ದಾಖಲೆಗಳಿಲ್ಲ',
      ml: 'ഇതുവരെ ഓഡിറ്റ് റെക്കോർഡുകൾ ഒന്നുമില്ല'
    }[language] || 'No audit trail records yet',
    timestamp: {
      en: 'Timestamp',
      ta: 'நேர முத்திரை',
      hi: 'समय टिकट',
      te: 'సమయ ముద్రిక',
      kn: 'ಸಮಯ ಮುದ್ರೆ',
      ml: 'ടൈംസ്റ്റാമ്പ്'
    }[language] || 'Timestamp',
    actionEvent: {
      en: 'Action Event',
      ta: 'செயல் நிகழ்வு',
      hi: 'क्रिया घटना',
      te: 'చర్య ఈవెంట్',
      kn: 'ಕ್ರಿಯಾ ಈವೆಂಟ್',
      ml: 'പ്രവർത്തന ഇവന്റ്'
    }[language] || 'Action Event',
    targetEntity: {
      en: 'Target Entity',
      ta: 'இலக்கு உருப்படி',
      hi: 'लक्षित निकाय',
      te: 'లక్ష్య సంస్థ',
      kn: 'ಗುರಿ ಘಟಕ',
      ml: 'ടാർഗെറ്റ് എന്റിറ്റി'
    }[language] || 'Target Entity',
    ipAddress: {
      en: 'IP Address',
      ta: 'IP முகவரி',
      hi: 'आईपी पता',
      te: 'IP చిరునామా',
      kn: 'IP ವಿಳಾಸ',
      ml: 'IP വിലാസം'
    }[language] || 'IP Address',
    eventDetails: {
      en: 'Event Details',
      ta: 'நிகழ்வு விவரங்கள்',
      hi: 'घटना विवरण',
      te: 'ఈవెంట్ వివరాలు',
      kn: 'ಈವೆಂಟ್ ವಿವರಗಳು',
      ml: 'ഇവന്റ് വിശദാംശങ്ങൾ'
    }[language] || 'Event Details'
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-gov-navy">{i18n.title}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {i18n.subtitle}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-bold">{i18n.noRecords}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-700">
                <tr className="text-left font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">{i18n.timestamp}</th>
                  <th className="px-4 py-3">{i18n.actionEvent}</th>
                  <th className="px-4 py-3">{i18n.targetEntity}</th>
                  <th className="px-4 py-3">{i18n.ipAddress}</th>
                  <th className="px-4 py-3">{i18n.eventDetails}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-gov-navy font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-bold">
                      {log.entity_type} {log.entity_id ? `(#${log.entity_id})` : ''}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate font-sans text-[11px]">
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

