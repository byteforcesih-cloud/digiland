import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, AlertTriangle, CheckSquare, Sparkles, Cpu } from 'lucide-react';
import { verificationService } from '../../services/verificationService';
import { DocumentItem } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { useTranslation } from '../../context/LanguageContext';

export const OCRReview: React.FC = () => {
  const { t, language } = useTranslation();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOCRQueue = async () => {
      try {
        const data = await verificationService.getQueue('VERIFICATION_REQUIRED');
        setDocuments(data);
      } catch (err) {
        console.error('Failed to load OCR review list:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOCRQueue();
  }, []);

  const i18n = {
    title: {
      en: 'OCR Confidence & Extraction Review',
      ta: 'OCR நம்பகத்தன்மை & பிரித்தெடுத்தல் மதிப்பாய்வு',
      hi: 'ओसीआर विश्वसनीयता एवं निष्कर्षण समीक्षा',
      te: 'OCR విశ్వసనీయత & వెలికితీత సమీక్ష',
      kn: 'OCR ವಿಶ್ವಾಸಾರ್ಹತೆ ಮತ್ತು ಹೊರತೆಗೆಯುವಿಕೆ ಪರಿಶೀಲನೆ',
      ml: 'OCR വിശ്വാസ്യതയും വേർതിരിച്ചെടുക്കലും പരിശോധന'
    }[language] || 'OCR Confidence & Extraction Review',
    subtitle: {
      en: 'Review documents where AI optical character recognition identified low-confidence fields (< 75%) requiring human verification.',
      ta: 'மனித சரிபார்ப்பு தேவைப்படும் குறைந்த நம்பகத்தன்மை புலங்களை (< 75%) AI கண்டறிந்த ஆவணங்களை மதிப்பாய்வு செய்யவும்.',
      hi: 'उन दस्तावेजों की समीक्षा करें जहां एआई ने कम विश्वसनीयता वाले फ़ील्ड (< 75%) की पहचान की है जिनके लिए मानवीय सत्यापन आवश्यक है।',
      te: 'మానవ ధృవీకరణ అవసరమయ్యే తక్కువ విశ్వసనీయత ఫీల్డ్‌లను (< 75%) AI గుర్తించిన పత్రాలను సమీక్షించండి.',
      kn: 'ಮಾನವ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿರುವ ಕಡಿಮೆ ವಿಶ್ವಾಸಾರ್ಹತೆಯ ಕ್ಷೇತ್ರಗಳನ್ನು (< 75%) AI ಗುರುತಿಸಿದ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
      ml: 'മാനുഷിക പരിശോധന ആവശ്യമുള്ള കുറഞ്ഞ വിശ്വാസ്യതയുള്ള ഫീൽഡുകൾ (< 75%) AI കണ്ടെത്തിയ രേഖകൾ പരിശോധിക്കുക.'
    }[language] || 'Review documents where AI optical character recognition identified low-confidence fields (< 75%) requiring human verification.',
    ruleNotice: {
      en: 'OCR algorithms may misinterpret blurred or degraded historical stamp seals. Authorized officers must inspect original scan bounds and confirm or correct the highlighted values.',
      ta: 'மங்கலான அல்லது சேதமடைந்த வரலாற்று முத்திரைகளை OCR தவறாகப் புரிந்து கொள்ளலாம். அங்கீகரிக்கப்பட்ட அதிகாரிகள் மூல ஆவணத்தை ஆய்வு செய்து மதிப்புகளை உறுதிப்படுத்த வேண்டும் அல்லது சரிசெய்ய வேண்டும்.',
      hi: 'ओसीआर एल्गोरिदम धुंधले या खराब हो चुके ऐतिहासिक डाक टिकटों की गलत व्याख्या कर सकते हैं। अधिकृत अधिकारियों को मूल स्कैन का निरीक्षण करना चाहिए और हाइलाइट किए गए मूल्यों की पुष्टि या सुधार करना चाहिए।',
      te: 'OCR అల్గారిథమ్‌లు అస్పష్టమైన చారిత్రక స్టాంపులను తప్పుగా అర్థం చేసుకోవచ్చు. అధీకృత అధికారులు అసలు స్కాన్‌ను పరిశీలించి విలువలను నిర్ధారించాలి లేదా సరిదిద్దాలి.',
      kn: 'OCR ಅಲ್ಗಾರಿದಮ್‌ಗಳು ಮಸುಕಾದ ಮುದ್ರೆಗಳನ್ನು ತಪ್ಪಾಗಿ ಅರ್ಥೈಸಿಕೊಳ್ಳಬಹುದು. ಅಧಿಕೃತ ಅಧಿಕಾರಿಗಳು ಮೂಲ ಸ್ಕ್ಯಾನ್ ಅನ್ನು ಪರಿಶೀಲಿಸಬೇಕು ಮತ್ತು ಮುಖ್ಯಾಂಶ ಮೌಲ್ಯಗಳನ್ನು ದೃಢೀಕರಿಸಬೇಕು ಅಥವಾ ಸರಿಪಡಿಸಬೇಕು.',
      ml: 'അവ്യക്തമായ മുദ്രകൾ OCR തെറ്റായി വ്യാഖ്യാനിച്ചേക്കാം. ഉദ്യോഗസ്ഥർ സ്കാൻ പരിശോധിച്ചു വിവരങ്ങൾ തിരുത്തുകയോ സ്ഥിരീകരിക്കുകയോ ചെയ്യണം.'
    }[language] || 'OCR algorithms may misinterpret blurred or degraded historical stamp seals. Authorized officers must inspect original scan bounds and confirm or correct the highlighted values.',
    noDocs: {
      en: 'No low-confidence OCR records currently pending review.',
      ta: 'தற்போது குறைந்த நம்பகத்தன்மை கொண்ட OCR பதிவுகள் எதுவும் மதிப்பாய்விற்கு நிலுவையில் இல்லை.',
      hi: 'वर्तमान में समीक्षा के लिए कोई कम विश्वसनीयता वाला ओसीआर रिकॉर्ड लंबित नहीं है।',
      te: 'ప్రస్తుతం సమీక్ష కోసం తక్కువ విశ్వసనీయత కలిగిన OCR రికార్డులు ఏవీ పెండింగ్‌లో లేవు.',
      kn: 'ಪ್ರಸ್ತುತ ಯಾವುದೇ ಕಡಿಮೆ ವಿಶ್ವಾಸಾರ್ಹತೆಯ OCR ದಾಖಲೆಗಳು ಪರಿಶೀಲನೆಗೆ ಬಾಕಿಯಿಲ್ಲ.',
      ml: 'നിലവിൽ പരിശോധനയ്ക്കായി കുറഞ്ഞ വിശ്വാസ്യതയുള്ള OCR രേഖകളൊന്നും ശേഷിക്കുന്നില്ല.'
    }[language] || 'No low-confidence OCR records currently pending review.',
    lowConfidenceFlag: {
      en: 'Low Confidence Flagged',
      ta: 'குறைந்த நம்பகத்தன்மை கொடியிடப்பட்டது',
      hi: 'कम विश्वसनीयता चिह्नित',
      te: 'తక్కువ విశ్వసనీయత ఫ్లాగ్ చేయబడింది',
      kn: 'ಕಡಿಮೆ ವಿಶ್ವಾಸಾರ್ಹತೆ ಗುರುತಿಸಲಾಗಿದೆ',
      ml: 'കുറഞ്ഞ വിശ്വാസ്യത രേഖപ്പെടുത്തി'
    }[language] || 'Low Confidence Flagged',
    inspectAndCorrect: {
      en: 'Inspect & Correct',
      ta: 'ஆய்வு செய்து சரிசெய்',
      hi: 'निरीक्षण और सुधार करें',
      te: 'తనిఖీ చేసి సరిదిద్దండి',
      kn: 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸರಿಪಡಿಸಿ',
      ml: 'പരിശോധിച്ച് തിരുത്തുക'
    }[language] || 'Inspect & Correct'
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-gov-navy">{i18n.title}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {i18n.subtitle}
        </p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-bold">{t.compulsoryOfficerInspection}</div>
          <p className="text-[11px] text-amber-800 mt-0.5">
            {i18n.ruleNotice}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        {documents.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Eye className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-bold">{i18n.noDocs}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">{t.documentNumber}</th>
                  <th className="px-4 py-3 text-left">{t.documentTitle}</th>
                  <th className="px-4 py-3 text-left">{t.documentType}</th>
                  <th className="px-4 py-3 text-left">{t.status}</th>
                  <th className="px-4 py-3 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{doc.document_number}</td>
                    <td className="px-4 py-3 text-slate-900">{doc.title}</td>
                    <td className="px-4 py-3 text-slate-600">{doc.document_type}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <AlertTriangle className="w-3 h-3 text-amber-600" /> {i18n.lowConfidenceFlag}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/officer/verification?reviewDocId=${doc.id}`}
                        className="px-3.5 py-1.5 bg-gov-navy hover:bg-gov-navyDark text-white font-bold rounded-lg transition inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-gov-goldLight" />
                        <span>{i18n.inspectAndCorrect}</span>
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

