import React, { useState, useEffect } from 'react';
import { Copy, AlertTriangle, CheckCircle, ShieldAlert, XCircle, ArrowRight } from 'lucide-react';
import { verificationService } from '../../services/verificationService';
import { DuplicateRecord } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

export const DuplicateDetection: React.FC = () => {
  const { t, language, formatStatus } = useTranslation();
  const [duplicates, setDuplicates] = useState<DuplicateRecord[]>([]);
  const [selectedDup, setSelectedDup] = useState<DuplicateRecord | null>(null);
  const [remarks, setRemarks] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchDuplicates = async () => {
    try {
      const data = await verificationService.getDuplicates();
      setDuplicates(data);
      if (data.length > 0) {
        setSelectedDup(data[0]);
      }
    } catch (err) {
      console.error('Failed to load duplicates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDuplicates();
  }, []);

  const handleResolve = async (status: string) => {
    if (!selectedDup) return;
    try {
      await verificationService.resolveDuplicate({
        duplicate_id: selectedDup.id,
        status,
        resolution_remarks: remarks || `Officer resolved status as: ${status}`
      });
      fetchDuplicates();
    } catch (err) {
      console.error('Resolution failure:', err);
    }
  };

  const i18n = {
    flaggedClaims: {
      en: 'Flagged Duplicate Claims',
      ta: 'கொடியிடப்பட்ட நகல் உரிமைகோரல்கள்',
      hi: 'चिह्नित डुप्लिकेट दावे',
      te: 'ఫ్లాగ్ చేయబడిన నకిలీ క్లెయిమ్‌లు',
      kn: 'ಗುರುತಿಸಲಾದ ನಕಲಿ ಹಕ್ಕುಗಳು',
      ml: 'ഫ്ലാഗ് ചെയ്ത വ്യാജ അവകാശവാദങ്ങൾ'
    }[language] || 'Flagged Duplicate Claims',
    noDuplicates: {
      en: 'No potential duplicates detected.',
      ta: 'சாத்தியமான நகல் ஆவணங்கள் எதுவும் கண்டறியப்படவில்லை.',
      hi: 'कोई संभावित डुप्लिकेट नहीं मिला।',
      te: 'ఎటువంటి సంభావ్య నకిలీలు కనుగొనబడలేదు.',
      kn: 'ಯಾವುದೇ ಸಂಭಾವ್ಯ ನಕಲುಗಳು ಪತ್ತೆಯಾಗಿಲ್ಲ.',
      ml: 'സാധ്യതയുള്ള വ്യാജരേഖകളൊന്നും കണ്ടെത്തിയില്ല.'
    }[language] || 'No potential duplicates detected.',
    matchScore: {
      en: 'Match',
      ta: 'பொருத்தம்',
      hi: 'मिलान',
      te: 'సరిపోలిక',
      kn: 'ಹೊಂದಾಣಿಕೆ',
      ml: 'പൊരുത്തം'
    }[language] || 'Match',
    matchedOn: {
      en: 'Matched on',
      ta: 'பொருந்திய புலங்கள்',
      hi: 'मिलान फ़ील्ड',
      te: 'సరిపోలిన ఫీల్డ్‌లు',
      kn: 'ಹೊಂದಿಕೆಯಾದ ಕ್ಷೇತ್ರಗಳು',
      ml: 'പൊരുത്തപ്പെട്ട ഫീൽഡുകൾ'
    }[language] || 'Matched on',
    potentialDupDetected: {
      en: 'Potential Duplicate Record Detected',
      ta: 'சாத்தியமான நகல் பதிவு கண்டறியப்பட்டது',
      hi: 'संभावित डुप्लिकेट रिकॉर्ड का पता चला',
      te: 'సంభావ్య నకిలీ రికార్డు కనుగొనబడింది',
      kn: 'ಸಂಭಾವ್ಯ ನಕಲಿ ದಾಖಲೆ ಪತ್ತೆಯಾಗಿದೆ',
      ml: 'സാധ്യതയുള്ള വ്യാജരേഖ കണ്ടെത്തി'
    }[language] || 'Potential Duplicate Record Detected',
    similarity: {
      en: 'Similarity',
      ta: 'ஒற்றுமை',
      hi: 'समानता',
      te: 'సారూప్యత',
      kn: 'ಹೋಲಿಕೆ',
      ml: 'സമാനത'
    }[language] || 'Similarity',
    crossCompareDesc: {
      en: 'Cross-comparison of identifiers against prior registration archives',
      ta: 'முந்தைய பதிவு காப்பகங்களுடன் அடையாளங்காட்டிகளின் ஒப்பீடு',
      hi: 'पूर्व पंजीकरण अभिलेखागार के साथ पहचानकर्ताओं की क्रॉस-तुलना',
      te: 'మునుపటి రిజిస్ట్రేషన్ ఆర్కైవ్‌లతో ఐడెంటిఫైయర్‌ల క్రాస్ పోలిక',
      kn: 'ಹಿಂದಿನ ನೋಂದಣಿ ದಾಖಲೆಗಳೊಂದಿಗೆ ಗುರುತಿಸುವಿಕೆಗಳ ಹೋಲಿಕೆ',
      ml: 'മുൻകാല രജിസ്ട്രേഷൻ ആർക്കൈവുകളുമായി ഐഡന്റിഫയറുകൾ താരതമ്യം ചെയ്യൽ'
    }[language] || 'Cross-comparison of identifiers against prior registration archives',
    newlyUploaded: {
      en: 'Newly Uploaded Record',
      ta: 'புதிதாக பதிவேற்றப்பட்ட பதிவு',
      hi: 'नया अपलोड किया गया रिकॉर्ड',
      te: 'కొత్తగా అప్‌లోడ్ చేసిన రికార్డు',
      kn: 'ಹೊಸದಾಗಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆ',
      ml: 'പുതുതായി അപ്‌ലോഡ് ചെയ്ത രേഖ'
    }[language] || 'Newly Uploaded Record',
    flagNote: {
      en: 'High similarity score indicating potential double conveyance.',
      ta: 'சாத்தியமான இரட்டைப் பதிவைக் குறிக்கும் உயர் ஒற்றுமை மதிப்பெண்.',
      hi: 'उच्च समानता स्कोर संभावित दोहरे हस्तांतरण का संकेत देता है।',
      te: 'సంభావ్య డబుల్ రిజిస్ట్రేషన్‌ను సూచించే అధిక సారూప్యత స్కోరు.',
      kn: 'ಸಂಭಾವ್ಯ ಡಬಲ್ ನೋಂದಣಿಯನ್ನು ಸೂಚಿಸುವ ಹೆಚ್ಚಿನ ಹೋಲಿಕೆ ಸ್ಕೋರ್.',
      ml: 'ഇരട്ട രജിസ്ട്രേഷൻ സാധ്യത സൂചിപ്പിക്കുന്ന ഉയർന്ന സമാനതാ സ്കോർ.'
    }[language] || 'High similarity score indicating potential double conveyance.',
    priorDeed: {
      en: 'Prior Registered Deed',
      ta: 'முன்பு பதிவு செய்யப்பட்ட பத்திரம்',
      hi: 'पूर्व पंजीकृत विलेख',
      te: 'మునుపు నమోదు చేయబడిన దస్తావేజు',
      kn: 'ಹಿಂದೆ ನೋಂದಾಯಿಸಿದ ಪತ್ರ',
      ml: 'മുമ്പ് രജിസ്റ്റർ ചെയ്ത ആധാരം'
    }[language] || 'Prior Registered Deed',
    conflictType: {
      en: 'Conflict Type',
      ta: 'முரண்பாட்டு வகை',
      hi: 'संघर्ष प्रकार',
      te: 'వివాద రకం',
      kn: 'ಸಂಘರ್ಷ ಪ್ರಕಾರ',
      ml: 'വൈരുദ്ധ്യ തരം'
    }[language] || 'Conflict Type',
    conflictDesc: {
      en: 'Identical Survey Number and Cadastral Zone.',
      ta: 'ஒரே சர்வே எண் மற்றும் நில அளவை மண்டலம்.',
      hi: 'समान सर्वेक्षण संख्या और भूकर क्षेत्र।',
      te: 'ఒకే సర్వే సంఖ్య మరియు కాడాస్ట్రల్ జోన్.',
      kn: 'ಒಂದೇ ಸರ್ವೆ ಸಂಖ್ಯೆ ಮತ್ತು ವಲಯ.',
      ml: 'സമാനമായ സർവേ നമ്പറും സോണും.'
    }[language] || 'Identical Survey Number and Cadastral Zone.',
    recommendation: {
      en: 'Recommendation',
      ta: 'பரிந்துரை',
      hi: 'सिफ़ारिश',
      te: 'సిఫార్సు',
      kn: 'ಶಿಫಾರಸು',
      ml: 'ശുപാർശ'
    }[language] || 'Recommendation',
    recommendationDesc: {
      en: 'Sub-Registrar Volume inspection required.',
      ta: 'சார்பதிவாளர் புத்தக ஆய்வு தேவை.',
      hi: 'उप-पंजीयक वॉल्यूम निरीक्षण आवश्यक है।',
      te: 'సబ్-రిజిస్ట్రార్ వాల్యూమ్ తనిఖీ అవసరం.',
      kn: 'ಉಪನೋಂದಣಾಧಿಕಾರಿ ಸಂಪುಟ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ.',
      ml: 'സബ് രജിസ്ട്രാർ വോളിയം പരിശോധന ആവശ്യമാണ്.'
    }[language] || 'Sub-Registrar Volume inspection required.',
    dismissFlagBtn: {
      en: 'Dismiss Flag (Legitimate Parcel)',
      ta: 'கொடியை நிராகரி (சட்டப்பூர்வ நிலம்)',
      hi: 'फ़्लैग खारिज करें (वैध पार्सल)',
      te: 'ఫ్లాగ్‌ను రద్దు చేయి (చట్టబద్ధమైన భూమి)',
      kn: 'ಫ್ಲ್ಯಾಗ್ ವಜಾಗೊಳಿಸಿ (ಕಾನೂನುಬದ್ಧ ಪಾರ್ಸೆಲ್)',
      ml: 'ഫ്ലാഗ് നിരസിക്കുക (നിയമപരമായ ഭൂമി)'
    }[language] || 'Dismiss Flag (Legitimate Parcel)',
    confirmDupBtn: {
      en: 'Confirm Duplicate (Reject & Flag)',
      ta: 'நகலை உறுதிசெய் (நிராகரி & கொடியிடு)',
      hi: 'डुप्लिकेट की पुष्टि करें (अस्वीकार और फ़्लैग करें)',
      te: 'నకిలీని నిర్ధారించండి (తిరస్కరించి ఫ్లాగ్ చేయండి)',
      kn: 'ನಕಲು ದೃಢೀಕರಿಸಿ (ತಿರಸ್ಕರಿಸಿ & ಫ್ಲ್ಯಾಗ್ ಮಾಡಿ)',
      ml: 'വ്യാജരേഖ സ്ഥിരീകരിക്കുക (നിരസിക്കുക)'
    }[language] || 'Confirm Duplicate (Reject & Flag)',
    markInvestigateBtn: {
      en: 'Mark Under Investigation',
      ta: 'விசாரணையின் கீழ் குறிக்கவும்',
      hi: 'जांच के तहत चिह्नित करें',
      te: 'విచారణలో ఉన్నట్లు గుర్తించు',
      kn: 'ತನಿಖೆಯಲ್ಲಿದೆ ಎಂದು ಗುರುತಿಸಿ',
      ml: 'അന്വേഷണത്തിലാണെന്ന് രേഖപ്പെടുത്തുക'
    }[language] || 'Mark Under Investigation',
    remarksPlaceholder: {
      en: 'e.g. Valid separate subdivision parcel 142/3A-1 partitioned legally.',
      ta: 'எ.கா. தனி உட்பிரிவு நிலம் 142/3A-1 சட்டப்பூர்வமாக பிரிக்கப்பட்டுள்ளது.',
      hi: 'उदा. वैध अलग उप-विभाजन पार्सल 142/3A-1 कानूनी रूप से विभाजित।',
      te: 'ఉదా. చెల్లుబాటు అయ్యే ప్రత్యేక సబ్-డివిజన్ పార్సెల్ 142/3A-1 చట్టబద్ధంగా విభజించబడింది.',
      kn: 'ಉದಾ. ಪ್ರತ್ಯೇಕ ಉಪ-ವಿಭಾಗ ಪಾರ್ಸೆಲ್ 142/3A-1 ಕಾನೂನುಬದ್ಧವಾಗಿ ವಿಭಜಿಸಲಾಗಿದೆ.',
      ml: 'ഉദാ. നിയമപരമായി വിഭജിച്ച പ്രത്യേക പാർസൽ 142/3A-1.'
    }[language] || 'e.g. Valid separate subdivision parcel 142/3A-1 partitioned legally.',
    selectPrompt: {
      en: 'Select a duplicate detection entry to inspect side-by-side comparison details.',
      ta: 'ஒப்பீட்டு விவரங்களை ஆய்வு செய்ய நகல் கண்டறிதல் உருப்படியைத் தேர்ந்தெடுக்கவும்.',
      hi: 'तुलना विवरण का निरीक्षण करने के लिए डुप्लिकेट प्रविष्टि चुनें।',
      te: 'పోలిక వివరాలను పరిశీలించడానికి నకిలీ గుర్తింపు నమోదును ఎంచుకోండి.',
      kn: 'ಹೋಲಿಕೆ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ನಕಲಿ ಪತ್ತೆ ನಮೂದನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      ml: 'താരതമ്യ വിശദാംശങ്ങൾ പരിശോധിക്കാൻ ഒരു എൻട്രി തിരഞ്ഞെടുക്കുക.'
    }[language] || 'Select a duplicate detection entry to inspect side-by-side comparison details.'
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-gov-navy">{t.duplicateDetectionTitle}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.duplicateDetectionSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Flagged Duplicates List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
            {i18n.flaggedClaims}
          </h3>

          <div className="space-y-2 text-xs">
            {duplicates.length === 0 ? (
              <p className="text-slate-400 p-4 text-center">{i18n.noDuplicates}</p>
            ) : (
              duplicates.map((dup) => (
                <button
                  key={dup.id}
                  onClick={() => setSelectedDup(dup)}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    selectedDup?.id === dup.id
                      ? 'border-red-500 bg-red-50/60 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Doc #{dup.document_id} vs #{dup.matched_document_id}</span>
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-red-100 text-red-800 text-[10px]">
                      {dup.similarity_score}% {i18n.matchScore}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {i18n.matchedOn}: {dup.matched_fields?.join(', ') || 'Survey / Patta'}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Side-by-Side Comparison Workspace */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          {selectedDup ? (
            <>
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-gov-navy flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span>{i18n.potentialDupDetected} ({selectedDup.similarity_score}% {i18n.similarity})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {i18n.crossCompareDesc}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                  {formatStatus(selectedDup.status)}
                </span>
              </div>

              {/* Side-by-Side Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Current Upload */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-gov-navy border-b pb-1 flex justify-between">
                    <span>{i18n.newlyUploaded}</span>
                    <span className="font-mono">Doc #{selectedDup.document_id}</span>
                  </div>
                  <div className="space-y-1 text-slate-700 text-[11px]">
                    <div><strong>{t.matchedFields}:</strong> {selectedDup.matched_fields.join(', ')}</div>
                    <div><strong>Flag:</strong> {i18n.flagNote}</div>
                  </div>
                </div>

                {/* Existing Archive Record */}
                <div className="p-4 bg-red-50/50 border border-red-200 rounded-xl space-y-2">
                  <div className="font-bold text-red-900 border-b border-red-200 pb-1 flex justify-between">
                    <span>{i18n.priorDeed}</span>
                    <span className="font-mono">Doc #{selectedDup.matched_document_id}</span>
                  </div>
                  <div className="space-y-1 text-red-800 text-[11px]">
                    <div><strong>{i18n.conflictType}:</strong> {i18n.conflictDesc}</div>
                    <div><strong>{i18n.recommendation}:</strong> {i18n.recommendationDesc}</div>
                  </div>
                </div>

              </div>

              {/* Resolution Remarks & Actions */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  {t.duplicateResolutionRemarks}
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={i18n.remarksPlaceholder}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-gov-navy focus:outline-none"
                />

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => handleResolve('DISMISSED')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{i18n.dismissFlagBtn}</span>
                  </button>

                  <button
                    onClick={() => handleResolve('CONFIRMED_FRAUD')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{i18n.confirmDupBtn}</span>
                  </button>

                  <button
                    onClick={() => handleResolve('UNDER_INVESTIGATION')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>{i18n.markInvestigateBtn}</span>
                  </button>
                </div>
              </div>

            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              {i18n.selectPrompt}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

