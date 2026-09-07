import React from 'react';
import { Bell, CheckCircle2, CheckSquare } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useTranslation } from '../../context/LanguageContext';

export const Notifications: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { t, language, formatDate } = useTranslation();

  const i18n = {
    title: {
      en: 'Notifications Center',
      ta: 'அறிவிப்பு மையம்',
      hi: 'सूचना केंद्र',
      te: 'నోటిఫికేషన్ కేంద్రం',
      kn: 'ಅಧಿಸೂಚನೆ ಕೇಂದ್ರ',
      ml: 'അറിയിപ്പ് കേന്ദ്രം'
    }[language] || 'Notifications Center',
    subtitle: {
      en: 'System updates, Tahsildar verification verdicts, and security alerts.',
      ta: 'கணினி புதுப்பிப்புகள், வட்டாட்சியர் சரிபார்ப்பு தீர்ப்புகள் மற்றும் பாதுகாப்பு விழிப்பூட்டல்கள்.',
      hi: 'सिस्टम अपडेट, तहसीलदार सत्यापन निर्णय और सुरक्षा अलर्ट।',
      te: 'సిస్టమ్ అప్‌డేట్‌లు, తహశీల్దార్ ధృవీకరణ తీర్పులు మరియు భద్రతా హెచ్చరికలు.',
      kn: 'ಸಿಸ್ಟಮ್ ನವೀಕರಣಗಳು, ತಹಶೀಲ್ದಾರ್ ಪರಿಶೀಲನಾ ತೀರ್ಪುಗಳು ಮತ್ತು ಭದ್ರತಾ ಎಚ್ಚರಿಕೆಗಳು.',
      ml: 'സിസ്റ്റം അപ്‌ഡേറ്റുകൾ, തഹസിൽദാർ പരിശോധനാ തീരുമാനങ്ങൾ, സുരക്ഷാ മുന്നറിയിപ്പുകൾ.'
    }[language] || 'System updates, Tahsildar verification verdicts, and security alerts.',
    channel: {
      en: 'Channel',
      ta: 'சேனல்',
      hi: 'चैनल',
      te: 'ఛానెల్',
      kn: 'ಚಾನಲ್',
      ml: 'ചാനൽ'
    }[language] || 'Channel',
    markRead: {
      en: 'Mark read',
      ta: 'படித்ததாகக் குறி',
      hi: 'पढ़ा हुआ चिह्नित करें',
      te: 'చదివినట్లు గుర్తించు',
      kn: 'ಓದಿದಂತೆ ಗುರುತಿಸಿ',
      ml: 'വായിച്ചതായി അടയാളപ്പെടുത്തുക'
    }[language] || 'Mark read'
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-gov-navy">{i18n.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {i18n.subtitle}
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.markAllRead}</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden text-xs">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-bold">{t.noNotifications}</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-4 transition cursor-pointer flex items-start justify-between ${
                !n.is_read ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-slate-900">{n.title}</h4>
                  {!n.is_read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                  )}
                </div>
                <p className="text-slate-600 leading-relaxed">{n.message}</p>
                <div className="text-[10px] text-slate-400 font-mono">
                  {formatDate(n.created_at)} • {i18n.channel}: {n.channel}
                </div>
              </div>

              {!n.is_read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(n.id);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-[11px] font-bold"
                >
                  {i18n.markRead}
                </button>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};

