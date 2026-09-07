import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, AlertTriangle, FileText, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { documentService } from '../../services/documentService';
import { DocumentItem } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { useTranslation } from '../../context/LanguageContext';

export const VerificationStatus: React.FC = () => {
  const { t, language, formatStatus } = useTranslation();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        const data = await documentService.getDocuments();
        setDocuments(data);
        if (data.length > 0) {
          setSelectedDoc(data[0]);
        }
      } catch (err) {
        console.error('Failed to load documents:', err);
      }
    };
    loadDocs();
  }, []);

  const stages = [
    {
      id: 1,
      title: {
        en: 'Document Uploaded',
        ta: 'ஆவணம் பதிவேற்றப்பட்டது',
        hi: 'दस्तावेज़ अपलोड किया गया',
        te: 'పత్రం అప్‌లోడ్ చేయబడింది',
        kn: 'ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ',
        ml: 'രേഖ അപ്‌ലോഡ് ചെയ്തു'
      }[language] || 'Document Uploaded',
      desc: {
        en: 'Secure hash & file archived in repository',
        ta: 'பாதுகாப்பான ஹாஷ் மற்றும் கோப்பு களஞ்சியத்தில் காப்பகப்படுத்தப்பட்டது',
        hi: 'सुरक्षित हैश और फ़ाइल रिपॉजिटरी में संग्रहीत',
        te: 'సురక్షిత హాష్ మరియు ఫైల్ నిల్వ చేయబడింది',
        kn: 'ಸುರಕ್ಷಿತ ಹ್ಯಾಶ್ ಮತ್ತು ಫೈಲ್ ರೆಪೊಸಿಟರಿಯಲ್ಲಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ',
        ml: 'സുരക്ഷിത ഹാഷും ഫയലും ശേഖരിച്ചു'
      }[language] || 'Secure hash & file archived in repository'
    },
    {
      id: 2,
      title: {
        en: 'AI OCR Extraction',
        ta: 'AI OCR பிரித்தெடுத்தல்',
        hi: 'एआई ओसीआर निष्कर्षण',
        te: 'AI OCR వెలికితీత',
        kn: 'AI OCR ಹೊರತೆಗೆಯುವಿಕೆ',
        ml: 'AI OCR വേർതിരിച്ചെടുക്കൽ'
      }[language] || 'AI OCR Extraction',
      desc: {
        en: '17 revenue fields parsed with confidence scoring',
        ta: 'நம்பகத்தன்மை மதிப்பெண்ணுடன் 17 வருவாய் புலங்கள் பிரித்தெடுக்கப்பட்டன',
        hi: 'विश्वसनीयता स्कोरिंग के साथ 17 राजस्व फ़ील्ड पार्स किए गए',
        te: 'విశ్వసనీయత స్కోరింగ్‌తో 17 రెవెన్యూ ఫీల్డ్‌లు పార్స్ చేయబడ్డాయి',
        kn: 'ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರಿಂಗ್‌ನೊಂದಿಗೆ 17 ಕಂದಾಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಪಾರ್ಸ್ ಮಾಡಲಾಗಿದೆ',
        ml: 'വിശ്വാസ്യത സ്‌കോറിംഗോടെ 17 റവന്യൂ ഫീൽഡുകൾ വേർതിരിച്ചു'
      }[language] || '17 revenue fields parsed with confidence scoring'
    },
    {
      id: 3,
      title: {
        en: 'Rule & Duplicate Validation',
        ta: 'விதிகள் மற்றும் நகல் சரிபார்ப்பு',
        hi: 'நियम और डुप्लिकेट सत्यापन',
        te: 'నియమాలు & నకిలీ ధృవీకరణ',
        kn: 'ನಿಯಮ ಮತ್ತು ನಕಲಿ ಪರಿಶೀಲನೆ',
        ml: 'നിയമങ്ങളും വ്യാജ പരിശോധനയും'
      }[language] || 'Rule & Duplicate Validation',
      desc: {
        en: 'Format and cross-registry conflict checks',
        ta: 'வடிவமைப்பு மற்றும் பதிவேட்டு முரண்பாடு சோதனைகள்',
        hi: 'प्रारूप और क्रॉस-रजिस्ट्री संघर्ष जांच',
        te: 'ఫార్మాట్ మరియు క్రాస్-రిజిస్ట్రీ వివాద తనిఖీలు',
        kn: 'ಫಾರ್ಮ್ಯಾಟ್ ಮತ್ತು ಕ್ರಾಸ್-ರಿಜಿಸ್ಟ್ರಿ ಸಂಘರ್ಷ ತಪಾಸಣೆಗಳು',
        ml: 'ഫോർമാറ്റും രജിസ്ട്രി വൈരുദ്ധ്യ പരിശോധനകളും'
      }[language] || 'Format and cross-registry conflict checks'
    },
    {
      id: 4,
      title: {
        en: 'Tahsildar / Officer Review',
        ta: 'வட்டாட்சியர் / அதிகாரி மதிப்பாய்வு',
        hi: 'तहसीलदार / अधिकारी समीक्षा',
        te: 'తహశీల్దార్ / అధికారి సమీక్ష',
        kn: 'ತಹಶೀಲ್ದಾರ್ / ಅಧಿಕಾರಿ ಪರಿಶೀಲನೆ',
        ml: 'തഹസിൽദാർ / ഓഫീസർ പരിശോധന'
      }[language] || 'Tahsildar / Officer Review',
      desc: {
        en: 'Human-in-the-loop verification against land book',
        ta: 'நிலப் பதிவேட்டுடன் மனித சரிபார்ப்பு',
        hi: 'भूमि पुस्तिका के साथ मानव-इन-द-लूप सत्यापन',
        te: 'భూమి పుస్తకంతో ప్రత్యక్ష అధికారి ధృవీకరణ',
        kn: 'ಭೂ ದಾಖಲೆಯೊಂದಿಗೆ ಮಾನವ ಪರಿಶೀಲನೆ',
        ml: 'ഭൂമി രേഖയുമായി നേരിട്ടുള്ള ഉദ്യോഗസ്ഥ പരിശോധന'
      }[language] || 'Human-in-the-loop verification against land book'
    },
    {
      id: 5,
      title: {
        en: 'Digitally Certified',
        ta: 'டிஜிட்டல் முறையில் சான்றளிக்கப்பட்டது',
        hi: 'डिजिटल रूप से प्रमाणित',
        te: 'డిజిటల్‌గా ధృవీకరించబడింది',
        kn: 'ಡಿಜಿಟಲ್ ಪ್ರಮಾಣೀಕೃತ',
        ml: 'ഡിജിറ്റലായി സാക്ഷ്യപ്പെടുത്തി'
      }[language] || 'Digitally Certified',
      desc: {
        en: 'Watermarked certificate ready for download',
        ta: 'பதிவிறக்கத்திற்கு தயாராக உள்ள நீர்முத்திரை சான்றிதழ்',
        hi: 'डाउनलोड के लिए तैयार वॉटरमार्क प्रमाण पत्र',
        te: 'డౌన్‌లోడ్ కోసం సిద్ధంగా ఉన్న వాటర్‌మార్క్ సర్టిఫికెట్',
        kn: 'ಡೌನ್‌ಲೋಡ್‌ಗಾಗಿ ಸಿದ್ಧವಾಗಿರುವ ವಾಟರ್‌ಮಾರ್ಕ್ ಪ್ರಮಾಣಪತ್ರ',
        ml: 'ഡൗൺലോഡ് ചെയ്യാൻ തയാറായ വാട്ടർമാർക്ക് സർട്ടിഫിക്കറ്റ്'
      }[language] || 'Watermarked certificate ready for download'
    }
  ];

  const getStageState = (stageId: number, status: string) => {
    if (status === 'VERIFIED') return 'completed';
    if (status === 'REJECTED' && stageId === 4) return 'rejected';

    if (stageId === 1) return 'completed';
    if (stageId === 2) return status === 'UPLOADED' ? 'active' : 'completed';
    if (stageId === 3) return status === 'PROCESSING' ? 'active' : 'completed';
    if (stageId === 4) return (status === 'PENDING' || status === 'VERIFICATION_REQUIRED') ? 'active' : 'pending';
    if (stageId === 5) return status === 'VERIFIED' ? 'completed' : 'pending';
    return 'pending';
  };

  const getStatusLabel = (state: string) => {
    if (state === 'completed') return t.statusCompleted;
    if (state === 'active') return t.statusActive;
    if (state === 'rejected') return t.statusEscalated;
    return t.statusPending;
  };

  const i18nTexts = {
    title: {
      en: 'Verification Status Tracker',
      ta: 'சரிபார்ப்பு நிலை கண்காணிப்பாளர்',
      hi: 'सत्यापन स्थिति ट्रैकर',
      te: 'ధృవీకరణ స్థితి ట్రాకర్',
      kn: 'ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕರ್',
      ml: 'പരിശോധനാ നില ട്രാക്കർ'
    }[language] || 'Verification Status Tracker',
    subtitle: {
      en: 'Follow the end-to-end lifecycle of your land document verification stages.',
      ta: 'உங்கள் நில ஆவண சரிபார்ப்பு கட்டங்களின் முழுமையான நிலையை அறியுங்கள்.',
      hi: 'अपने भूमि दस्तावेज़ सत्यापन चरणों के शुरू से अंत तक जीवन चक्र का पालन करें।',
      te: 'మీ భూమి పత్రాల ధృవీకరణ దశల సమగ్ర వివరాలను తెలుసుకోండి.',
      kn: 'ನಿಮ್ಮ ಭೂ ದಾಖಲೆ ಪರಿಶೀಲನಾ ಹಂತಗಳ ಸಂಪೂರ್ಣ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಅನುಸರಿಸಿ.',
      ml: 'നിങ്ങളുടെ ഭൂമി രേഖ പരിശോധനാ ഘട്ടങ്ങൾ ട്രാക്ക് ചെയ്യുക.'
    }[language] || 'Follow the end-to-end lifecycle of your land document verification stages.',
    selectRecord: {
      en: 'Select Land Record',
      ta: 'நிலப் பதிவேட்டைத் தேர்ந்தெடுக்கவும்',
      hi: 'भूमि रिकॉर्ड चुनें',
      te: 'భూమి రికార్డును ఎంచుకోండి',
      kn: 'ಭೂ ದಾಖಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      ml: 'ഭൂമി രേഖ തിരഞ്ഞെടുക്കുക'
    }[language] || 'Select Land Record',
    selectPrompt: {
      en: 'Select a document from the left to view verification pipeline progress.',
      ta: 'சரிபார்ப்பு முன்னேற்றத்தைக் காண இடதுபுறத்திலிருந்து ஒரு ஆவணத்தைத் தேர்ந்தெடுக்கவும்.',
      hi: 'सत्यापन प्रगति देखने के लिए बाईं ओर से एक दस्तावेज़ चुनें।',
      te: 'ధృవీకరణ పురోగతిని చూడటానికి ఎడమవైపు నుండి ఒక పత్రాన్ని ఎంచుకోండి.',
      kn: 'ಪರಿಶೀಲನಾ ಪ್ರಗತಿಯನ್ನು ವೀಕ್ಷಿಸಲು ಎಡಭಾಗದಿಂದ ದಾಖಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      ml: 'പരിശോധനാ പുരോഗതി കാണുന്നതിന് ഇടതുവശത്ത് നിന്ന് ഒരു രേഖ തിരഞ്ഞെടുക്കുക.'
    }[language] || 'Select a document from the left to view verification pipeline progress.',
    noticeTitle: {
      en: 'Human-in-the-Loop Governance Notice',
      ta: 'மனித மதிப்பாய்வு நிர்வாக அறிவிப்பு',
      hi: 'मानव-इन-द-लूप शासन सूचना',
      te: 'అధికారిక మానవ పరిశీలన విధానం',
      kn: 'ಮಾನವ ಪರಿಶೀಲನಾ ಆಡಳಿತ ಸೂಚನೆ',
      ml: 'ഹ്യൂമൻ-ഇൻ-ദി-ലൂപ്പ് ഭരണ അറിയിപ്പ്'
    }[language] || 'Human-in-the-Loop Governance Notice',
    noticeDesc: {
      en: 'Under DigiLand integrity rules, AI extracts and assesses document fields, but legal confirmation is always conducted by authorized Government Revenue Officers before certificate issuance.',
      ta: 'டிஜிலாண்ட் விதிகளின்படி, AI ஆவணத் தகவல்களைப் பிரித்தெடுத்து ஆய்வு செய்கிறது, ஆனால் சான்றிதழ் வழங்குவதற்கு முன் அங்கீகரிக்கப்பட்ட வருவாய்த்துறை அதிகாரிகளால் மட்டுமே இறுதி சட்டப்பூர்வ சரிபார்ப்பு நடத்தப்படுகிறது.',
      hi: 'डिजीलँड नियमों के तहत, एआई दस्तावेज़ फ़ील्ड को निकालता है, लेकिन प्रमाणपत्र जारी करने से पहले अधिकृत सरकारी राजस्व अधिकारियों द्वारा कानूनी पुष्टि की जाती है।',
      te: 'డిజిలాండ్ నిబంధనల ప్రకారం, AI పత్ర వివరాలను సేకరించి విశ్లేషిస్తుంది, అయితే సర్టిఫికెట్ జారీ చేయడానికి ముందు అధీకృత ప్రభుత్వ రెవెన్యూ అధికారుల ద్వారా మాత్రమే తుది ధృవీకరణ చేయబడుతుంది.',
      kn: 'ಡಿಜಿಲ್ಯಾಂಡ್ ನಿಯಮಗಳ ಪ್ರಕಾರ, AI ದಾಖಲೆ ಕ್ಷೇತ್ರಗಳನ್ನು ಹೊರತೆಗೆಯುತ್ತದೆ, ಆದರೆ ಪ್ರಮಾಣಪತ್ರ ನೀಡುವ ಮೊದಲು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಕಂದಾಯ ಅಧಿಕಾರಿಗಳು ಕಾನೂನು ದೃಢೀಕರಣವನ್ನು ನಡೆಸುತ್ತಾರೆ.',
      ml: 'ഡിജിലാൻഡ് സമഗ്രതാ നിയമങ്ങൾ പ്രകാരം, AI രേഖകൾ പരിശോധിക്കുന്നുണ്ടെങ്കിലും സർട്ടിഫിക്കറ്റ് നൽകുന്നതിന് മുമ്പ് റവന്യൂ ഉദ്യോഗസ്ഥർ നിയമപരമായ സ്ഥിരീകരണം നടത്തുന്നു.'
    }[language] || 'Under DigiLand integrity rules, AI extracts and assesses document fields, but legal confirmation is always conducted by authorized Government Revenue Officers before certificate issuance.'
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-gov-navy">{i18nTexts.title}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {i18nTexts.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Document Selection Column */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
            {i18nTexts.selectRecord}
          </h3>

          <div className="space-y-2">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                  selectedDoc?.id === doc.id
                    ? 'border-gov-navy bg-blue-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-900">{doc.title}</span>
                  <StatusBadge status={doc.status} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span className="font-mono">{doc.document_number}</span>
                  <span>v{doc.current_version}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Verification Timeline Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          {selectedDoc ? (
            <>
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-gov-navy">{selectedDoc.title}</h3>
                  <p className="text-xs text-slate-500 font-mono">{t.documentNumber}: {selectedDoc.document_number}</p>
                </div>
                <StatusBadge status={selectedDoc.status} />
              </div>

              {/* Timeline Steps */}
              <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-slate-200">
                {stages.map((stage) => {
                  const state = getStageState(stage.id, selectedDoc.status);
                  return (
                    <div key={stage.id} className="relative flex items-start space-x-4">
                      {/* Step Circle */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 ${
                          state === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : state === 'active'
                            ? 'bg-amber-500 text-white animate-pulse'
                            : state === 'rejected'
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {state === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          stage.id
                        )}
                      </div>

                      {/* Content */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex-1 text-xs">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-slate-900">{stage.title}</h4>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                              state === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : state === 'active'
                                ? 'bg-amber-100 text-amber-800'
                                : state === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {getStatusLabel(state)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{stage.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Note */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-gov-navy flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gov-navy">{i18nTexts.noticeTitle}</div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {i18nTexts.noticeDesc}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              {i18nTexts.selectPrompt}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
