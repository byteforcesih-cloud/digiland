import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Loader2, 
  Layers, 
  ChevronRight,
  UserCheck,
  Send,
  Sparkles
} from 'lucide-react';
import { fraudService } from '../../services/fraudService';
import { FraudAnalysisResult } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

export const FraudReviewQueue: React.FC = () => {
  const { t, language, formatStatus } = useTranslation();
  const [queue, setQueue] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<FraudAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [analysisLoading, setAnalysisLoading] = useState<boolean>(false);
  
  // Officer Review
  const [officerRemarks, setOfficerRemarks] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const data = await fraudService.getReviewQueue(25);
      setQueue(data);
      if (data.length > 0 && !selectedDocId) {
        handleSelectDoc(data[0].document_id);
      }
    } catch (err) {
      console.error('Failed to load fraud queue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleSelectDoc = async (docId: number) => {
    setSelectedDocId(docId);
    try {
      setAnalysisLoading(true);
      const res = await fraudService.getAnalysis(docId);
      setAnalysis(res);
      setOfficerRemarks(res.officer_remarks || '');
    } catch (err) {
      console.error('Failed to load fraud analysis', err);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocId) return;
    setIsSubmitting(true);
    try {
      await fraudService.submitOfficerReview(selectedDocId, officerRemarks);
      setReviewSuccess(true);
      await fetchQueue();
      setTimeout(() => setReviewSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to submit officer review', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRiskBadgeColor = (score: number) => {
    if (score <= 30) return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    if (score <= 60) return 'bg-amber-50 text-amber-800 border-amber-300';
    if (score <= 80) return 'bg-orange-50 text-orange-800 border-orange-300';
    return 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse';
  };

  const i18n = {
    badge: {
      en: 'AI Document Tampering & Anomaly Queue',
      ta: 'AI ஆவண திருத்தம் & முரண்பாடு வரிசை',
      hi: 'एआई दस्तावेज़ छेड़छाड़ और विसंगति कतार',
      te: 'AI పత్రాల అవకతవకలు & వ్యత్యాసాల క్యూ',
      kn: 'AI ದಾಖಲೆ ತಿದ್ದುಪಡಿ ಮತ್ತು ವೈಪರೀತ್ಯ ಸರತಿ',
      ml: 'AI രേഖ തിരുത്തൽ & വൈരുദ്ധ്യ ക്യൂ'
    }[language] || 'AI Document Tampering & Anomaly Queue',
    anomalousDocs: {
      en: 'Anomalous Documents',
      ta: 'முரண்பாடான ஆவணங்கள்',
      hi: 'विसंगत दस्तावेज़',
      te: 'వ్యత్యాస పత్రాలు',
      kn: 'ವೈಪರೀತ್ಯದ ದಾಖಲೆಗಳು',
      ml: 'വൈരുദ്ധ്യമുള്ള രേഖകൾ'
    }[language] || 'Anomalous Documents',
    flaggedCount: {
      en: 'Flagged',
      ta: 'கொடியிடப்பட்டது',
      hi: 'चिह्नित',
      te: 'ఫ్లాగ్ చేయబడింది',
      kn: 'ಗುರುತಿಸಲಾಗಿದೆ',
      ml: 'ഫ്ലാഗ് ചെയ്തു'
    }[language] || 'Flagged',
    loadingQueue: {
      en: 'Loading anomalous queue...',
      ta: 'முரண்பாட்டு வரிசை ஏற்றப்படுகிறது...',
      hi: 'विसंगति कतार लोड हो रही है...',
      te: 'వ్యత్యాస క్యూ లోడ్ అవుతోంది...',
      kn: 'ವೈಪರೀತ್ಯ ಸರತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
      ml: 'ക്യൂ ലോഡ് ചെയ്യുന്നു...'
    }[language] || 'Loading anomalous queue...',
    zeroFlags: {
      en: 'Zero High-Risk Tampering Flags',
      ta: 'உயர் ஆபத்து திருத்த கொடிகள் எதுவும் இல்லை',
      hi: 'शून्य उच्च-जोखिम छेड़छाड़ फ़्लैग',
      te: 'సున్నా అధిక-ప్రమాద అవకతవకల ఫ్లాగ్‌లు',
      kn: 'ಶೂನ್ಯ ಹೆಚ್ಚಿನ ಅಪಾಯದ ತಿದ್ದುಪಡಿ ಫ್ಲ್ಯಾಗ್‌ಗಳು',
      ml: 'ഉയർന്ന അപകടസാധ്യതയുള്ള തിരുത്തലുകൾ ഒന്നുമില്ല'
    }[language] || 'Zero High-Risk Tampering Flags',
    allMeetStandards: {
      en: 'All submitted deeds meet cryptographic and layer consistency standards.',
      ta: 'சமர்ப்பிக்கப்பட்ட அனைத்து பத்திரங்களும் தரநிலைகளைப் பூர்த்தி செய்கின்றன.',
      hi: 'सभी प्रस्तुत विलेख मानकों को पूरा करते हैं।',
      te: 'సమర్పించిన అన్ని పత్రాలు ప్రమాణాలకు అనుగుణంగా ఉన్నాయి.',
      kn: 'ಸಲ್ಲಿಸಲಾದ ಎಲ್ಲಾ ದಾಖಲೆಗಳು ಮಾನದಂಡಗಳನ್ನು ಪೂರೈಸುತ್ತವೆ.',
      ml: 'സമർപ്പിച്ച എല്ലാ ആധാരങ്ങളും മാനദണ്ഡങ്ങൾ പാലിക്കുന്നു.'
    }[language] || 'All submitted deeds meet cryptographic and layer consistency standards.',
    riskScore: {
      en: 'Risk Score',
      ta: 'ஆபத்து மதிப்பெண்',
      hi: 'जोखिम स्कोर',
      te: 'ప్రమాద స్కోరు',
      kn: 'ಅಪಾಯದ ಸ್ಕೋರ್',
      ml: 'അപകടസാധ്യത സ്കോർ'
    }[language] || 'Risk Score',
    officerReviewed: {
      en: 'Officer Reviewed',
      ta: 'அதிகாரியால் மதிப்பாய்வு செய்யப்பட்டது',
      hi: 'अधिकारी द्वारा समीक्षित',
      te: 'అధికారి సమీక్షించారు',
      kn: 'ಅಧಿಕಾರಿ ಪರಿಶೀಲಿಸಿದ್ದಾರೆ',
      ml: 'ഉദ്യോഗസ്ഥൻ പരിശോധിച്ചു'
    }[language] || 'Officer Reviewed',
    deepInference: {
      en: 'Running deep anomaly inference...',
      ta: 'ஆழமான முரண்பாடு ஆய்வு செய்யப்படுகிறது...',
      hi: 'गहन विसंगति अनुमान चल रहा है...',
      te: 'లోతైన వ్యత్యాస విశ్లేషణ జరుగుతోంది...',
      kn: 'ಆಳವಾದ ವೈಪರೀತ್ಯ ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ...',
      ml: 'വിശകലനം പുരോഗമിക്കുന്നു...'
    }[language] || 'Running deep anomaly inference...',
    anomalyDetectedBanner: {
      en: 'Potential Document Anomaly Detected — Requires Human Review',
      ta: 'சாத்தியமான ஆவண முரண்பாடு கண்டறியப்பட்டது — மனித மதிப்பாய்வு தேவை',
      hi: 'संभावित दस्तावेज़ विसंगति का पता चला - मानव समीक्षा की आवश्यकता है',
      te: 'సంభావ్య పత్ర వ్యత్యాసం కనుగొనబడింది - మానవ సమీక్ష అవసరం',
      kn: 'ಸಂಭಾವ್ಯ ದಾಖಲೆ ವೈಪರೀತ್ಯ ಪತ್ತೆಯಾಗಿದೆ - ಮಾನವ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ',
      ml: 'രേഖാ വൈരുദ്ധ്യം കണ്ടെത്തി - മാനുഷിക പരിശോധന ആവശ്യമാണ്'
    }[language] || 'Potential Document Anomaly Detected — Requires Human Review',
    bannerSub: {
      en: 'Automated heuristic analysis detected statistical variance in font thickness, metadata creator tags, or layer alignment.',
      ta: 'தானியங்கி பகுப்பாய்வு எழுத்துரு தடிமன், மெட்டாடேட்டா அல்லது அடுக்கு சீரமைப்பில் மாறுபாட்டைக் கண்டறிந்துள்ளது.',
      hi: 'स्वचालित विश्लेषण ने फ़ॉन्ट मोटाई, मेटाडेटा या लेयर संरेखण में सांख्यिकीय भिन्नता का पता लगाया।',
      te: 'ఆటోమేటెడ్ విశ్లేషణ ఫాంట్ మందం, మెటాడేటా లేదా లేయర్ అమరికలో వ్యత్యాసాన్ని గుర్తించింది.',
      kn: 'ಸ್ವಯಂಚಾಲಿತ ವಿಶ್ಲೇಷಣೆಯು ಫಾಂಟ್ ದಪ್ಪ, ಮೆಟಾಡೇಟಾ ಅಥವಾ ಲೇಯರ್ ಜೋಡಣೆಯಲ್ಲಿ ವ್ಯತ್ಯಾಸವನ್ನು ಪತ್ತೆ ಮಾಡಿದೆ.',
      ml: 'ഫോണ്ട് കനം, മെറ്റാഡാറ്റ അല്ലെങ്കിൽ ലെയർ അലൈൻമെന്റിൽ വ്യത്യാസം കണ്ടെത്തി.'
    }[language] || 'Automated heuristic analysis detected statistical variance in font thickness, metadata creator tags, or layer alignment.',
    compositeRisk: {
      en: 'Composite Risk',
      ta: 'கூட்டு ஆபத்து',
      hi: 'समग्र जोखिम',
      te: 'మొత్తం ప్రమాదం',
      kn: 'ಸಂಯೋಜಿತ ಅಪಾಯ',
      ml: 'സംയോജിത അപകടസാധ്യത'
    }[language] || 'Composite Risk',
    imageTamperIndex: {
      en: 'Image Tamper Index',
      ta: 'பட திருத்தக் குறியீடு',
      hi: 'छवि छेड़छाड़ सूचकांक',
      te: 'చిత్ర అవకతవకల సూచిక',
      kn: 'ಚಿತ್ರ ತಿದ್ದುಪಡಿ ಸೂಚ್ಯಂಕ',
      ml: 'ചിത്ര തിരുത്തൽ സൂചിക'
    }[language] || 'Image Tamper Index',
    spliceHeuristic: {
      en: 'Splice / Clone heuristic',
      ta: 'ஒட்டுதல் / நகல் ஆய்வு',
      hi: 'स्प्लिस / क्लोन अनुमान',
      te: 'స్ప్లైస్ / క్లోన్ విశ్లేషణ',
      kn: 'ಸ್ಪ್ಲೈಸ್ / ಕ್ಲೋನ್ ವಿಶ್ಲೇಷಣೆ',
      ml: 'സ്പ്ലൈസ് / ക്ലോൺ പരിശോധന'
    }[language] || 'Splice / Clone heuristic',
    ocrConsistency: {
      en: 'OCR Consistency',
      ta: 'OCR சீரான தன்மை',
      hi: 'ओसीआर निरंतरता',
      te: 'OCR స్థిరత్వం',
      kn: 'OCR ಸ್ಥಿರತೆ',
      ml: 'OCR സ്ഥിരത'
    }[language] || 'OCR Consistency',
    fontGlyph: {
      en: 'Font glyph match',
      ta: 'எழுத்துரு உருவப் பொருத்தம்',
      hi: 'फ़ॉन्ट ग्लिफ़ मिलान',
      te: 'ఫాంట్ గ్లిఫ్ సరిపోలిక',
      kn: 'ಫಾಂಟ್ ಗ್ಲಿಫ್ ಹೊಂದಾಣಿಕೆ',
      ml: 'ഫോണ്ട് ഗ്ലിഫ് പൊരുത്തം'
    }[language] || 'Font glyph match',
    metadataAnomaly: {
      en: 'Metadata Anomaly',
      ta: 'மெட்டாடேட்டா முரண்பாடு',
      hi: 'मेटाडेटा विसंगति',
      te: 'మెటాడేటా వ్యత్యాసం',
      kn: 'ಮೆಟಾಡೇಟಾ ವೈಪರೀತ್ಯ',
      ml: 'മെറ്റാഡാറ്റ വൈരുദ്ധ്യം'
    }[language] || 'Metadata Anomaly',
    exifTool: {
      en: 'EXIF / Creator tool',
      ta: 'EXIF / உருவாக்கிய கருவி',
      hi: 'EXIF / निर्माता उपकरण',
      te: 'EXIF / సృష్టికర్త సాధనం',
      kn: 'EXIF / ರಚನೆಕಾರ ಸಾಧನ',
      ml: 'EXIF / ക്രിയേറ്റർ ടൂൾ'
    }[language] || 'EXIF / Creator tool',
    detectedFlags: {
      en: 'Detected Anomaly Flags',
      ta: 'கண்டறியப்பட்ட முரண்பாட்டுக் கொடிகள்',
      hi: 'पहचाने गए विसंगति फ़्लैग',
      te: 'గుర్తించబడిన వ్యత్యాసాల ఫ్లాగ్‌లు',
      kn: 'ಪತ್ತೆಯಾದ ವೈಪರೀತ್ಯ ಫ್ಲ್ಯಾಗ್‌ಗಳು',
      ml: 'കണ്ടെത്തിയ വൈരുദ്ധ്യ ഫ്ലാഗുകൾ'
    }[language] || 'Detected Anomaly Flags',
    officerRemarksTitle: {
      en: 'Officer Review Conclusion & Remarks',
      ta: 'அதிகாரி மதிப்பாய்வு முடிவு & குறிப்புகள்',
      hi: 'अधिकारी समीक्षा निष्कर्ष और टिप्पणियां',
      te: 'అధికారి సమీక్ష ముగింపు & వ్యాఖ్యలు',
      kn: 'ಅಧಿಕಾರಿ ಪರಿಶೀಲನಾ ತೀರ್ಮಾನ ಮತ್ತು ಟಿಪ್ಪಣಿಗಳು',
      ml: 'ഉദ്യോഗസ്ഥ പരിശോധനാ നിഗമനങ്ങളും കുറിപ്പുകളും'
    }[language] || 'Officer Review Conclusion & Remarks',
    placeholderRemarks: {
      en: 'Enter manual inspection findings, physically verified patta schedule notes...',
      ta: 'கள ஆய்வு கண்டுபிடிப்புகள், சரிபார்க்கப்பட்ட பட்டா அட்டவணை குறிப்புகளை உள்ளிடவும்...',
      hi: 'मैन्युअल निरीक्षण निष्कर्ष, भौतिक रूप से सत्यापित पट्टा अनुसूची नोट्स दर्ज करें...',
      te: 'మాన్యువల్ తనిఖీ ఫలితాలు, ధృవీకరించబడిన పట్టా నోట్లను నమోదు చేయండి...',
      kn: 'ಹಸ್ತಚಾಲಿತ ತಪಾಸಣೆ ಸಂಶೋಧನೆಗಳು, ಪರಿಶೀಲಿಸಿದ ಪಟ್ಟಾ ಟಿಪ್ಪಣಿಗಳನ್ನು ನಮೂದಿಸಿ...',
      ml: 'പരിശോധനാ കണ്ടെത്തലുകൾ, നേരിട്ട് പരിശോധിച്ച പട്ട കുറിപ്പുകൾ രേഖപ്പെടുത്തുക...'
    }[language] || 'Enter manual inspection findings, physically verified patta schedule notes...',
    orderLogged: {
      en: 'Inspection Order Logged!',
      ta: 'ஆய்வு உத்தரவு பதிவு செய்யப்பட்டது!',
      hi: 'निरीक्षण आदेश दर्ज किया गया!',
      te: 'తనిఖీ ఉత్తర్వు నమోదు చేయబడింది!',
      kn: 'ತಪಾಸಣಾ ಆದೇಶ ದಾಖಲಾಗಿದೆ!',
      ml: 'പരിശോധനാ ഉത്തരവ് രേഖപ്പെടുത്തി!'
    }[language] || 'Inspection Order Logged!',
    saveRemarksBtn: {
      en: 'Save Officer Inspection Remarks',
      ta: 'அதிகாரி ஆய்வு குறிப்புகளைச் சேமிக்கவும்',
      hi: 'अधिकारी निरीक्षण टिप्पणियां सहेजें',
      te: 'అధికారి తనిఖీ వ్యాఖ్యలను సేవ్ చేయండి',
      kn: 'ಅಧಿಕಾರಿ ತಪಾಸಣಾ ಟಿಪ್ಪಣಿಗಳನ್ನು ಉಳಿಸಿ',
      ml: 'ഉദ്യോഗസ്ഥ പരിശോധനാ കുറിപ്പുകൾ സേവ് ചെയ്യുക'
    }[language] || 'Save Officer Inspection Remarks',
    selectPrompt: {
      en: 'Select a document from the left queue to inspect AI anomaly scores.',
      ta: 'AI முரண்பாட்டு மதிப்பெண்களை ஆய்வு செய்ய இடதுபுற வரிசையிலிருந்து ஒரு ஆவணத்தைத் தேர்ந்தெடுக்கவும்.',
      hi: 'एआई विसंगति स्कोर का निरीक्षण करने के लिए बाईं कतार से एक दस्तावेज़ चुनें।',
      te: 'AI వ్యత్యాస స్కోర్‌లను పరిశీలించడానికి ఎడమ క్యూ నుండి పత్రాన్ని ఎంచుకోండి.',
      kn: 'AI ವೈಪರೀತ್ಯ ಸ್ಕೋರ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಎಡ ಸರತಿಯಿಂದ ದಾಖಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      ml: 'AI സ്കോറുകൾ പരിശോധിക്കാൻ ഇടതുവശത്തെ ക്യൂവിൽ നിന്ന് രേഖ തിരഞ്ഞെടുക്കുക.'
    }[language] || 'Select a document from the left queue to inspect AI anomaly scores.'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            {i18n.badge}
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {t.fraudReviewTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.fraudReviewSubtitle}
          </p>
        </div>
      </div>

      {/* Grid: Left Document Queue | Right AI Tamper Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Columns: Suspicious Documents Queue */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-slate-700 px-1">
            {i18n.anomalousDocs} ({queue.length} {i18n.flaggedCount})
          </span>

          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-rose-600 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">{i18n.loadingQueue}</p>
            </div>
          ) : queue.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-xs text-slate-600 font-bold">{i18n.zeroFlags}</p>
              <p className="text-[11px] text-slate-400">{i18n.allMeetStandards}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queue.map((item) => {
                const isSelected = selectedDocId === item.document_id;
                return (
                  <div
                    key={item.document_id}
                    onClick={() => handleSelectDoc(item.document_id)}
                    className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all shadow-sm ${
                      isSelected
                        ? 'border-rose-600 ring-2 ring-rose-50 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold font-mono text-slate-900">
                        {item.document_number}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getRiskBadgeColor(item.overall_risk_score)}`}>
                        {i18n.riskScore}: {item.overall_risk_score}/100
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">{item.title}</h3>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                      <span>{t.documentType}: {item.document_type}</span>
                      <span className={item.is_reviewed ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                        {item.is_reviewed ? i18n.officerReviewed : t.statusPending}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 7 Columns: AI Tamper Inspection & Review Form */}
        <div className="lg:col-span-7">
          {analysisLoading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-rose-600 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">{i18n.deepInference}</p>
            </div>
          ) : analysis ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Mandatory Anomaly Banner */}
              <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-amber-950">
                    {i18n.anomalyDetectedBanner}
                  </h3>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    {i18n.bannerSub}
                  </p>
                </div>
              </div>

              {/* Granular Factors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">{i18n.compositeRisk}</span>
                  <span className="text-base font-extrabold text-rose-600">{analysis.overall_risk_score}/100</span>
                  <span className="text-[10px] block font-semibold text-slate-600">{analysis.risk_level}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">{i18n.imageTamperIndex}</span>
                  <span className="text-base font-bold text-slate-800">{analysis.image_tamper_score?.toFixed(1)}%</span>
                  <span className="text-[10px] text-slate-500 block">{i18n.spliceHeuristic}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">{i18n.ocrConsistency}</span>
                  <span className="text-base font-bold text-slate-800">{analysis.ocr_consistency_score?.toFixed(1)}%</span>
                  <span className="text-[10px] text-slate-500 block">{i18n.fontGlyph}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">{i18n.metadataAnomaly}</span>
                  <span className="text-base font-bold text-slate-800">{analysis.metadata_inconsistency_score?.toFixed(1)}%</span>
                  <span className="text-[10px] text-slate-500 block">{i18n.exifTool}</span>
                </div>
              </div>

              {/* Detected Flags */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  {i18n.detectedFlags} ({analysis.anomaly_flags?.length || 0})
                </span>
                <div className="flex flex-wrap gap-2">
                  {analysis.anomaly_flags?.map((flag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-semibold"
                    >
                      ⚠️ {flag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Officer Decision Form */}
              <form onSubmit={handleSubmitReview} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-700" />
                  {i18n.officerRemarksTitle}
                </h3>

                <div>
                  <textarea
                    rows={2}
                    required
                    placeholder={i18n.placeholderRemarks}
                    value={officerRemarks}
                    onChange={(e) => setOfficerRemarks(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  {reviewSuccess && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> {i18n.orderLogged}
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    {i18n.saveRemarksBtn}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
              {i18n.selectPrompt}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

