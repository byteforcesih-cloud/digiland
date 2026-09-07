import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ShieldAlert, CheckSquare, Search } from 'lucide-react';
import { verificationService } from '../../services/verificationService';
import { ValidationResult } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

export const DataValidation: React.FC = () => {
  const { t, language, formatStatus } = useTranslation();
  const [validations, setValidations] = useState<ValidationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchValidations = async () => {
      try {
        const data = await verificationService.getValidations();
        setValidations(data);
      } catch (err) {
        console.error('Failed to load validations:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchValidations();
  }, []);

  const i18n = {
    title: {
      en: 'Data Validation Rules Engine',
      ta: 'தரவு சரிபார்ப்பு விதிகள் அமைப்பு',
      hi: 'डेटा सत्यापन नियम इंजन',
      te: 'డేటా ధృవీకరణ నియమాల ఇంజిన్',
      kn: 'ಡೇಟಾ ಪರಿಶೀಲನಾ ನಿಯಮಗಳ ಎಂಜಿನ್',
      ml: 'ഡാറ്റാ പരിശോധനാ നിയമങ്ങൾ'
    }[language] || 'Data Validation Rules Engine',
    subtitle: {
      en: 'Overview of automated integrity verification: missing survey numbers, format mismatches, area variances, and jurisdictional inconsistencies.',
      ta: 'தானியங்கி ஒருமைப்பாடு சரிபார்ப்பின் கண்ணோட்டம்: விடுபட்ட சர்வே எண்கள், வடிவமைப்பு பொருந்தாமை, பரப்பளவு வேறுபாடுகள் மற்றும் அதிகார வரம்பு முரண்பாடுகள்.',
      hi: 'स्वचालित अखंडता सत्यापन का अवलोकन: गुम सर्वेक्षण संख्या, प्रारूप बेमेल, क्षेत्र भिन्नता, और क्षेत्राधिकार संबंधी विसंगतियां।',
      te: 'ఆటోమేటెడ్ సమగ్రత ధృవీకరణ యొక్క అవలోకనం: తప్పిపోయిన సర్వే సంఖ్యలు, ఫార్మాట్ అసమతుల్యతలు, విస్తీర్ణ వైవిధ్యాలు మరియు అధికార పరిధి వ్యత్యాసాలు.',
      kn: 'ಸ್ವಯಂಚಾಲಿತ ಸಮಗ್ರತೆಯ ಪರಿಶೀಲನೆಯ ಅವಲೋಕನ: ಕಾಣೆಯಾದ ಸರ್ವೆ ಸಂಖ್ಯೆಗಳು, ಫಾರ್ಮ್ಯಾಟ್ ಅಸಾಮರಸ್ಯಗಳು, ವಿಸ್ತೀರ್ಣ ವ್ಯತ್ಯಾಸಗಳು ಮತ್ತು ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿಯ ಅಸಂಗತತೆಗಳು.',
      ml: 'ഓട്ടോമേറ്റഡ് സമഗ്രതാ പരിശോധനയുടെ അവലോകനം: നഷ്ടപ്പെട്ട സർവേ നമ്പറുകൾ, ഫോർമാറ്റ് പൊരുത്തക്കേടുകൾ, വിസ്തീർണ്ണ വ്യത്യാസങ്ങൾ.'
    }[language] || 'Overview of automated integrity verification: missing survey numbers, format mismatches, area variances, and jurisdictional inconsistencies.',
    allPassed: {
      en: 'All processed documents passed automated validation rules.',
      ta: 'செயலாக்கப்பட்ட அனைத்து ஆவணங்களும் தானியங்கி சரிபார்ப்பு விதிகளில் தேர்ச்சி பெற்றுள்ளன.',
      hi: 'सभी संसाधित दस्तावेज़ स्वचालित सत्यापन नियमों में उत्तीर्ण हुए।',
      te: 'ప్రాసెస్ చేయబడిన అన్ని పత్రాలు ఆటోమేటెడ్ ధృవీకరణ నియమాలను ఆమోదించాయి.',
      kn: 'ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾದ ಎಲ್ಲಾ ದಾಖಲೆಗಳು ಸ್ವಯಂಚಾಲಿತ ಪರಿಶೀಲನಾ ನಿಯಮಗಳಲ್ಲಿ ಉತ್ತೀರ್ಣವಾಗಿವೆ.',
      ml: 'പ്രോസസ്സ് ചെയ്ത എല്ലാ രേഖകളും ഓട്ടോമേറ്റഡ് പരിശോധനാ നിയമങ്ങൾ വിജയിച്ചു.'
    }[language] || 'All processed documents passed automated validation rules.',
    rulesPassed: {
      en: 'Rules Passed',
      ta: 'தேர்ச்சி பெற்ற விதிகள்',
      hi: 'उत्तीर्ण नियम',
      te: 'ఆమోదించబడిన నియమాలు',
      kn: 'ಉತ್ತೀರ್ಣವಾದ ನಿಯಮಗಳು',
      ml: 'വിജയിച്ച നിയമങ്ങൾ'
    }[language] || 'Rules Passed',
    errors: {
      en: 'Errors',
      ta: 'பிழைகள்',
      hi: 'त्रुटियां',
      te: 'లోపాలు',
      kn: 'ದೋಷಗಳು',
      ml: 'പിശകുകൾ'
    }[language] || 'Errors',
    noAnomalies: {
      en: 'No anomalies detected',
      ta: 'முரண்பாடுகள் எதுவும் கண்டறியப்படவில்லை',
      hi: 'कोई विसंगति नहीं मिली',
      te: 'ఎటువంటి వ్యత్యాసాలు కనుగొనబడలేదు',
      kn: 'ಯಾವುದೇ ವೈಪರೀತ್ಯಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
      ml: 'വൈരുദ്ധ്യങ്ങളൊന്നും കണ്ടെത്തിയില്ല'
    }[language] || 'No anomalies detected',
    inspectBtn: {
      en: 'Inspect',
      ta: 'ஆய்வு செய்',
      hi: 'निरीक्षण करें',
      te: 'తనిఖీ చేయండి',
      kn: 'ಪರಿಶೀಲಿಸಿ',
      ml: 'പരിശോധിക്കുക'
    }[language] || 'Inspect'
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
        {validations.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <p className="font-bold">{i18n.allPassed}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">{t.documentNumber}</th>
                  <th className="px-4 py-3 text-left">{t.status}</th>
                  <th className="px-4 py-3 text-left">{i18n.rulesPassed}</th>
                  <th className="px-4 py-3 text-left">{i18n.errors}</th>
                  <th className="px-4 py-3 text-left">{t.inconsistenciesDetected}</th>
                  <th className="px-4 py-3 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {validations.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">Doc #{v.document_id}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === 'VALID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.status === 'NEEDS_REVIEW'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {formatStatus(v.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <span className="font-bold text-emerald-700">{v.validation_rules_passed}</span> / {v.validation_rules_total}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${v.error_count > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                        {v.error_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-sm">
                      {v.mismatch_details && v.mismatch_details.length > 0 ? (
                        <div className="space-y-0.5 text-[11px]">
                          {v.mismatch_details.map((m, idx) => (
                            <div key={idx} className="text-amber-800 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <span>{m.message}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-emerald-600">{i18n.noAnomalies}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/officer/verification?reviewDocId=${v.document_id}`}
                        className="px-3 py-1.5 bg-gov-navy hover:bg-gov-navyDark text-white font-bold rounded-lg transition inline-flex items-center gap-1 shadow-sm"
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-gov-goldLight" />
                        <span>{i18n.inspectBtn}</span>
                      </Link>
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

