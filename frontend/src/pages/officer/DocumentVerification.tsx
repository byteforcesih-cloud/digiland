import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckSquare, ArrowLeft, Eye, RefreshCw, Filter } from 'lucide-react';
import { verificationService } from '../../services/verificationService';
import { DocumentItem } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { SplitScreenVerifier } from '../../components/verification/SplitScreenVerifier';
import { useTranslation } from '../../context/LanguageContext';

export const DocumentVerification: React.FC = () => {
  const { t, language, formatDate } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const reviewDocId = searchParams.get('reviewDocId');

  const [queue, setQueue] = useState<DocumentItem[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [activeReviewData, setActiveReviewData] = useState<any>(null);
  const [isLoadingReview, setIsLoadingReview] = useState(false);

  const fetchQueue = async () => {
    try {
      const data = await verificationService.getQueue(statusFilter || undefined);
      setQueue(data);
    } catch (err) {
      console.error('Failed to load queue:', err);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [statusFilter]);

  useEffect(() => {
    if (reviewDocId) {
      loadReviewData(Number(reviewDocId));
    } else {
      setActiveReviewData(null);
    }
  }, [reviewDocId]);

  const loadReviewData = async (docId: number) => {
    setIsLoadingReview(true);
    try {
      const data = await verificationService.getReviewData(docId);
      setActiveReviewData(data);
    } catch (err) {
      console.error('Failed to load review data:', err);
    } finally {
      setIsLoadingReview(false);
    }
  };

  const handleActionDone = () => {
    setActiveReviewData(null);
    setSearchParams({});
    fetchQueue();
  };

  const i18n = {
    backToQueue: {
      en: 'Back to Queue',
      ta: 'சரிபார்ப்பு வரிசைக்கு திரும்பு',
      hi: 'कतार पर वापस जाएं',
      te: 'క్యూకి తిరిగి వెళ్ళండి',
      kn: 'ಸರತಿಗೆ ಹಿಂತಿರುಗಿ',
      ml: 'ക്യൂവിലേക്ക് മടങ്ങുക'
    }[language] || 'Back to Queue',
    filterStatus: {
      en: 'Filter Status',
      ta: 'நிலையை வடிகட்டவும்',
      hi: 'स्थिति फ़िल्टर करें',
      te: 'స్థితిని ఫిల్టర్ చేయండి',
      kn: 'ಸ್ಥಿತಿ ಫಿಲ್ಟರ್ ಮಾಡಿ',
      ml: 'നില ഫിൽട്ടർ ചെയ്യുക'
    }[language] || 'Filter Status',
    allRequired: {
      en: 'All Verification Required',
      ta: 'அனைத்து சரிபார்ப்பு தேவைப்படுபவை',
      hi: 'सभी सत्यापन आवश्यक',
      te: 'అన్ని ధృవీకరణ అవసరమైనవి',
      kn: 'ಎಲ್ಲಾ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿರುವವು',
      ml: 'എല്ലാ പരിശോധനയും ആവശ്യമായവ'
    }[language] || 'All Verification Required',
    potentiallyAltered: {
      en: 'Potentially Altered',
      ta: 'மாற்றப்பட்டிருக்க வாய்ப்புள்ளது',
      hi: 'संभावित रूप से बदला गया',
      te: 'మార్చబడిన అవకాశం ఉంది',
      kn: 'ಬದಲಾಯಿಸಲಾದ ಸಾಧ್ಯತೆ',
      ml: 'മാറ്റം വരുത്താൻ സാധ്യതയുള്ളത്'
    }[language] || 'Potentially Altered',
    queueCount: {
      en: 'Queue Count',
      ta: 'வரிசை எண்ணிக்கை',
      hi: 'कतार संख्या',
      te: 'క్యూ సంఖ్య',
      kn: 'ಸರತಿ ಎಣಿಕೆ',
      ml: 'ക്യൂ എണ്ണം'
    }[language] || 'Queue Count',
    documentsCount: {
      en: 'documents',
      ta: 'ஆவணங்கள்',
      hi: 'दस्तावेज़',
      te: 'పత్రాలు',
      kn: 'ದಾಖಲೆಗಳು',
      ml: 'രേഖകൾ'
    }[language] || 'documents',
    noPendingDocs: {
      en: 'No documents currently pending verification.',
      ta: 'தற்போது எந்த ஆவணங்களும் சரிபார்ப்பிற்கு நிலுவையில் இல்லை.',
      hi: 'वर्तमान में कोई दस्तावेज़ सत्यापन के लिए लंबित नहीं है।',
      te: 'ప్రస్తుతం ఎటువంటి పత్రాలు ధృవీకరణ కోసం పెండింగ్‌లో లేవు.',
      kn: 'ಪ್ರಸ್ತುತ ಯಾವುದೇ ದಾಖಲೆಗಳು ಪರಿಶೀಲನೆಗೆ ಬಾಕಿಯಿಲ್ಲ.',
      ml: 'നിലവിൽ പരിശോധനയ്ക്കായി രേഖകളൊന്നും ശേഷിക്കുന്നില്ല.'
    }[language] || 'No documents currently pending verification.'
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-gov-navy">{t.verificationQueueTitle}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.verificationQueueSubtitle}
          </p>
        </div>

        {activeReviewData && (
          <button
            onClick={() => {
              setActiveReviewData(null);
              setSearchParams({});
            }}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{i18n.backToQueue}</span>
          </button>
        )}
      </div>

      {activeReviewData ? (
        /* Split Screen Verifier Mode */
        <SplitScreenVerifier
          data={activeReviewData}
          onActionComplete={handleActionDone}
        />
      ) : (
        /* Queue Table Mode */
        <div className="space-y-4">
          
          {/* Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-700">{i18n.filterStatus}:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gov-navy bg-white font-medium"
              >
                <option value="">{i18n.allRequired}</option>
                <option value="VERIFICATION_REQUIRED">{t.statusVerificationRequired}</option>
                <option value="PENDING">{t.statusPending}</option>
                <option value="DUPLICATE_SUSPECTED">{t.statusDuplicateSuspected}</option>
                <option value="POTENTIALLY_ALTERED">{i18n.potentiallyAltered}</option>
              </select>
            </div>

            <div className="text-slate-500 font-medium">
              {i18n.queueCount}: <span className="font-bold text-slate-900">{queue.length}</span> {i18n.documentsCount}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
            {queue.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <CheckSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-bold">{i18n.noPendingDocs}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left">{t.documentNumber}</th>
                      <th className="px-4 py-3 text-left">{t.documentTitle}</th>
                      <th className="px-4 py-3 text-left">{t.documentType}</th>
                      <th className="px-4 py-3 text-left">{t.version}</th>
                      <th className="px-4 py-3 text-left">{t.uploadedOn}</th>
                      <th className="px-4 py-3 text-left">{t.status}</th>
                      <th className="px-4 py-3 text-right">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {queue.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">{doc.document_number}</td>
                        <td className="px-4 py-3 text-slate-900">{doc.title}</td>
                        <td className="px-4 py-3 text-slate-600">{doc.document_type}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-800">
                            v{doc.current_version}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {formatDate(doc.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={doc.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => loadReviewData(doc.id)}
                            className="px-3 py-1.5 bg-gov-navy hover:bg-gov-navyDark text-white font-bold rounded-lg transition inline-flex items-center gap-1.5 shadow-sm"
                          >
                            <CheckSquare className="w-3.5 h-3.5 text-gov-goldLight" />
                            <span>{t.splitScreenReview}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

