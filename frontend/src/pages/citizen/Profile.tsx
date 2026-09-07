import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Calendar, 
  Globe, 
  Lock, 
  Laptop, 
  Smartphone, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Key, 
  Activity,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { securityService } from '../../services/securityService';
import { LanguageCode, DeviceSessionItem, LoginHistoryItem, FeatureAccessItem } from '../../types';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { t, language, setLanguage, formatDate, formatStatus } = useTranslation();

  const [features, setFeatures] = useState<FeatureAccessItem[]>([]);
  const [sessions, setSessions] = useState<DeviceSessionItem[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionActionMsg, setSessionActionMsg] = useState<string>('');

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' },
  ];

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      const [featRes, sessRes, histRes] = await Promise.all([
        securityService.getMyAccessibleFeatures(),
        securityService.getActiveSessions(),
        securityService.getLoginHistory()
      ]);
      setFeatures(featRes.features || []);
      setSessions(sessRes || []);
      setLoginHistory(histRes || []);
    } catch (err) {
      console.error('Failed to load profile security details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const handleRevokeSession = async (sessionId: number) => {
    try {
      await securityService.revokeSession(sessionId);
      setSessionActionMsg(
        {
          en: 'Session revoked successfully.',
          ta: 'அமர்வு வெற்றிகரமாக ரத்து செய்யப்பட்டது.',
          hi: 'सत्र सफलतापूर्वक निरस्त किया गया।',
          te: 'సెషన్ విజయవంతంగా రద్దు చేయబడింది.',
          kn: 'ಅಧಿವೇಶನವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಹಿಂಪಡೆಯಲಾಗಿದೆ.',
          ml: 'സെഷൻ വിജയകരമായി റദ്ദാക്കി.'
        }[language] || 'Session revoked successfully.'
      );
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setTimeout(() => setSessionActionMsg(''), 2500);
    } catch (err) {
      console.error('Failed to revoke session', err);
    }
  };

  const i18n = {
    verifiedCitizen: {
      en: 'Verified Citizen',
      ta: 'சரிபார்க்கப்பட்ட குடிமகன்',
      hi: 'सत्यापित नागरिक',
      te: 'ధృవీకరించబడిన పౌరుడు',
      kn: 'ದೃಢೀಕೃತ ನಾಗರಿಕ',
      ml: 'പരിശോധിച്ചുറപ്പിച്ച പൗരൻ'
    }[language] || 'Verified Citizen',
    unverified: {
      en: 'Unverified (KYC Pending)',
      ta: 'சரிபார்க்கப்படவில்லை (KYC நிலுவையில்)',
      hi: 'असत्यापित (केवाईसी लंबित)',
      te: 'ధృవీకరించబడలేదు (KYC పెండింగ్‌లో ఉంది)',
      kn: 'ಪರಿಶೀಲಿಸಲಾಗಿಲ್ಲ (KYC ಬಾಕಿ)',
      ml: 'സ്ഥിരീകരിച്ചിട്ടില്ല (KYC ബാക്കി)'
    }[language] || 'Unverified (KYC Pending)',
    accountStatus: {
      en: 'Account Status',
      ta: 'கணக்கு நிலை',
      hi: 'खाता स्थिति',
      te: 'ఖాతా స్థితి',
      kn: 'ಖಾತೆ ಸ್ಥಿತಿ',
      ml: 'അക്കൗണ്ട് നില'
    }[language] || 'Account Status',
    role: {
      en: 'Role',
      ta: 'பங்கு',
      hi: 'भूमिका',
      te: 'పాత్ర',
      kn: 'ಪಾತ್ರ',
      ml: 'പങ്ക്'
    }[language] || 'Role',
    ageYears: {
      en: 'Years',
      ta: 'வயது',
      hi: 'वर्ष',
      te: 'సంవత్సరాలు',
      kn: 'ವರ್ಷಗಳು',
      ml: 'വയസ്സ്'
    }[language] || 'Years',
    registeredOn: {
      en: 'Registered On',
      ta: 'பதிவு செய்யப்பட்ட தேதி',
      hi: 'पंजीकरण तिथि',
      te: 'నమోదైన తేదీ',
      kn: 'ನೋಂದಾಯಿಸಿದ ದಿನಾಂಕ',
      ml: 'രജിസ്റ്റർ ചെയ്ത തീയതി'
    }[language] || 'Registered On',
    govtIdentity: {
      en: 'Verified Government Identity',
      ta: 'சரிபார்க்கப்பட்ட அரசு அடையாளம்',
      hi: 'सत्यापित सरकारी पहचान',
      te: 'ధృవీకరించబడిన ప్రభుత్వ గుర్తింపు',
      kn: 'ದೃಢೀಕೃತ ಸರ್ಕಾರಿ ಗುರುತು',
      ml: 'സ്ഥിരീകരിച്ച സർക്കാർ തിരിച്ചറിയൽ'
    }[language] || 'Verified Government Identity',
    maskedAadhaar: {
      en: 'Masked Aadhaar Number',
      ta: 'மறைக்கப்பட்ட ஆதார் எண்',
      hi: 'मास्क किया गया आधार नंबर',
      te: 'మాస్క్ చేయబడిన ఆధార్ సంఖ్య',
      kn: 'ಮರೆಮಾಚಲಾದ ಆಧಾರ್ ಸಂಖ್ಯೆ',
      ml: 'മാസ്ക് ചെയ്ത ആധാർ നമ്പർ'
    }[language] || 'Masked Aadhaar Number',
    vaultLinked: {
      en: 'SHA-256 Vault Linked',
      ta: 'SHA-256 பெட்டகத்துடன் இணைக்கப்பட்டது',
      hi: 'SHA-256 वॉल्ट से जुड़ा हुआ',
      te: 'SHA-256 వాల్ట్‌తో లింక్ చేయబడింది',
      kn: 'SHA-256 ವಾಲ್ಟ್ ಲಿಂಕ್ ಮಾಡಲಾಗಿದೆ',
      ml: 'SHA-256 വോൾട്ടുമായി ബന്ധിപ്പിച്ചു'
    }[language] || 'SHA-256 Vault Linked',
    regMobile: {
      en: 'Registered Mobile Number',
      ta: 'பதிவு செய்யப்பட்ட அலைபேசி எண்',
      hi: 'पंजीकृत मोबाइल नंबर',
      te: 'నమోదిత మొబైల్ నంబర్',
      kn: 'ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      ml: 'രജിസ്റ്റർ ചെയ്ത മൊബൈൽ നമ്പർ'
    }[language] || 'Registered Mobile Number',
    aadhaarMatched: {
      en: 'Aadhaar Matched & Verified',
      ta: 'ஆதார் பொருந்தியது & சரிபார்க்கப்பட்டது',
      hi: 'आधार मिलान और सत्यापित',
      te: 'ఆధార్ సరిపోలింది & ధృవీకరించబడింది',
      kn: 'ಆಧಾರ್ ಹೊಂದಿಕೆಯಾಗಿದೆ ಮತ್ತು ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
      ml: 'ആധാർ പൊരുത്തപ്പെട്ടു & സ്ഥിരീകരിച്ചു'
    }[language] || 'Aadhaar Matched & Verified',
    rbacMatrixTitle: {
      en: 'My Accessible Features (Dynamic RBAC Matrix)',
      ta: 'எனக்கு அணுகக்கூடிய அம்சங்கள் (RBAC அணுகல் முறைமை)',
      hi: 'मेरी सुलभ सुविधाएं (डायनामिक आरबीएसी मैट्रिक्स)',
      te: 'నాకు అందుబాటులో ఉన్న ఫీచర్లు (RBAC మ్యాట్రిక్స్)',
      kn: 'ನನ್ನ ಪ್ರವೇಶಿಸಬಹುದಾದ ವೈಶಿಷ್ಟ್ಯಗಳು (RBAC ಮ್ಯಾಟ್ರಿಕ್ಸ್)',
      ml: 'ലഭ്യമായ ഫീച്ചറുകൾ (RBAC മാട്രിക്സ്)'
    }[language] || 'My Accessible Features (Dynamic RBAC Matrix)',
    rbacMatrixSubtitle: {
      en: `Features enabled based on your role (${user?.role}) and identity status (${user?.verification_status}).`,
      ta: `உங்கள் பங்கு (${user?.role}) மற்றும் அடையாள நிலையின் (${user?.verification_status}) அடிப்படையில் அம்சங்கள் இயக்கப்பட்டுள்ளன.`,
      hi: `आपकी भूमिका (${user?.role}) और पहचान स्थिति (${user?.verification_status}) के आधार पर सुविधाएं सक्षम की गई हैं।`,
      te: `మీ పాత్ర (${user?.role}) మరియు గుర్తింపు స్థితి (${user?.verification_status}) ఆధారంగా ఫీచర్లు ప్రారంభించబడ్డాయి.`,
      kn: `ನಿಮ್ಮ ಪಾತ್ರ (${user?.role}) ಮತ್ತು ಗುರುತಿನ ಸ್ಥಿತಿ (${user?.verification_status}) ಆಧಾರದ ಮೇಲೆ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ.`,
      ml: `നിങ്ങളുടെ പങ്കും (${user?.role}) തിരിച്ചറിയൽ നിലയും (${user?.verification_status}) അടിസ്ഥാനമാക്കി ഫീച്ചറുകൾ പ്രവർത്തനക്ഷമമാക്കി.`
    }[language] || `Features enabled based on your role (${user?.role}) and identity status (${user?.verification_status}).`,
    featureName: {
      en: 'Feature Name',
      ta: 'அம்சத்தின் பெயர்',
      hi: 'सुविधा का नाम',
      te: 'ఫీచర్ పేరు',
      kn: 'ವೈಶಿಷ್ಟ್ಯದ ಹೆಸರು',
      ml: 'ഫീച്ചർ പേര്'
    }[language] || 'Feature Name',
    category: {
      en: 'Category',
      ta: 'வகை',
      hi: 'श्रेणी',
      te: 'వర్గం',
      kn: 'ವರ್ಗ',
      ml: 'വിഭാഗം'
    }[language] || 'Category',
    accessStatus: {
      en: 'Access Status',
      ta: 'அணுகல் நிலை',
      hi: 'पहुंच स्थिति',
      te: 'యాక్సెస్ స్థితి',
      kn: 'ಪ್ರವೇಶ ಸ್ಥಿತಿ',
      ml: 'ആക്സസ് നില'
    }[language] || 'Access Status',
    permissionPolicy: {
      en: 'Permission Policy',
      ta: 'அனுமதி கொள்கை',
      hi: 'अनुमति नीति',
      te: 'అనుమతి విధానం',
      kn: 'ಅನುಮತಿ ನೀತಿ',
      ml: 'അനുമതി നയം'
    }[language] || 'Permission Policy',
    activeSessions: {
      en: 'Active Device Sessions',
      ta: 'செயலில் உள்ள சாதன அமர்வுகள்',
      hi: 'सक्रिय डिवाइस सत्र',
      te: 'యాక్టివ్ పరికర సెషన్లు',
      kn: 'ಸಕ್ರಿಯ ಸಾಧನ ಅಧಿವೇಶನಗಳು',
      ml: 'സജീവ ഉപകരണ സെഷനുകൾ'
    }[language] || 'Active Device Sessions',
    revoke: {
      en: 'Revoke',
      ta: 'ரத்து செய்',
      hi: 'रद्द करें',
      te: 'రద్దు చేయి',
      kn: 'ಹಿಂಪಡೆಯಿರಿ',
      ml: 'റദ്ദാക്കുക'
    }[language] || 'Revoke',
    recentAuthHistory: {
      en: 'Recent Authentication History',
      ta: 'சமீபத்திய உள்நுழைவு வரலாறு',
      hi: 'हालिया प्रमाणीकरण इतिहास',
      te: 'ఇటీవలి లాగిన్ చరిత్ర',
      kn: 'ಇತ್ತೀಚಿನ ಲಾಗಿನ್ ಇತಿಹಾಸ',
      ml: 'സമീപകാല ലോഗിൻ ചരിത്രം'
    }[language] || 'Recent Authentication History',
    success: {
      en: 'Success',
      ta: 'வெற்றி',
      hi: 'सफल',
      te: 'విజయం',
      kn: 'ಯಶಸ್ಸು',
      ml: 'വിജയം'
    }[language] || 'Success',
    failed: {
      en: 'Failed',
      ta: 'தோல்வி',
      hi: 'विफल',
      te: 'విఫలమైంది',
      kn: 'ವಿಫಲವಾಗಿದೆ',
      ml: 'പരാജയം'
    }[language] || 'Failed'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-gov-navy">{t.profileTitle}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.profileSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user?.full_name?.charAt(0) || 'U'}
          </div>

          <div>
            <h3 className="font-extrabold text-base text-slate-900">{user?.full_name}</h3>
            <p className="text-xs text-slate-500 font-mono">{user?.email}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
              user?.verification_status === 'VERIFIED'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {user?.verification_status === 'VERIFIED' ? i18n.verifiedCitizen : i18n.unverified}
            </span>
          </div>

          <div className="w-full border-t pt-4 text-xs text-left space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>{i18n.accountStatus}:</span>
              <span className="text-emerald-600 font-bold">{t.statusActive}</span>
            </div>
            <div className="flex justify-between">
              <span>{i18n.role}:</span>
              <span className="font-bold text-indigo-700">{user?.role}</span>
            </div>
            <div className="flex justify-between">
              <span>{t.age}:</span>
              <span className="font-bold">{user?.age} {i18n.ageYears}</span>
            </div>
            <div className="flex justify-between">
              <span>{i18n.registeredOn}:</span>
              <span>{formatDate(user?.created_at) || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Identity & Preferences */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{i18n.govtIdentity}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-1">{i18n.maskedAadhaar}</span>
                <span className="font-mono font-bold text-sm text-slate-900">{user?.aadhaar_masked || 'XXXX-XXXX-XXXX'}</span>
                <span className="block text-[10px] text-emerald-600 font-semibold mt-1">{i18n.vaultLinked}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-1">{i18n.regMobile}</span>
                <span className="font-mono font-bold text-sm text-slate-900">+91 {user?.phone}</span>
                <span className="block text-[10px] text-indigo-600 font-semibold mt-1">{i18n.aadhaarMatched}</span>
              </div>
            </div>
          </div>

          {/* Language Preference */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>{t.preferredLanguage}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`p-3 rounded-xl border font-bold text-left transition ${
                    language === l.code
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic RBAC Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              {i18n.rbacMatrixTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {i18n.rbacMatrixSubtitle}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">{i18n.featureName}</th>
                <th className="py-2.5 px-3">{i18n.category}</th>
                <th className="py-2.5 px-3">{i18n.accessStatus}</th>
                <th className="py-2.5 px-3">{i18n.permissionPolicy}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {features.map((f, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{f.feature_name}</td>
                  <td className="py-2.5 px-3 text-slate-500">{f.category}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      f.is_allowed
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      {f.is_allowed ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {f.access_status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-slate-500">{f.restriction_reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Device Sessions & Login History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Sessions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Laptop className="w-4 h-4 text-indigo-600" />
              {i18n.activeSessions} ({sessions.length})
            </h3>
          </div>

          {sessionActionMsg && (
            <div className="p-2 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-200">
              {sessionActionMsg}
            </div>
          )}

          <div className="space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    {s.device_type === 'Mobile' ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{s.device_name}</span>
                    <span className="text-[10px] text-slate-400">IP: {s.ip_address || '127.0.0.1'} | {t.statusActive}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRevokeSession(s.id)}
                  className="px-2.5 py-1 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-[10px] font-bold transition-colors"
                >
                  {i18n.revoke}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Login History */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-600" />
            {i18n.recentAuthHistory}
          </h3>

          <div className="space-y-2.5 text-xs max-h-72 overflow-y-auto pr-1">
            {loginHistory.slice(0, 5).map((h) => (
              <div key={h.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block text-[11px] truncate max-w-[200px]">
                    {h.user_agent?.split(' ')[0] || 'Browser Client'}
                  </span>
                  <span className="text-[10px] text-slate-400">IP: {h.ip_address}</span>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    h.is_successful ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {h.is_successful ? i18n.success : i18n.failed}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">{formatDate(h.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

