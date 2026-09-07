import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  UserCheck, 
  MessageSquare, 
  ChevronRight, 
  Loader2, 
  Send,
  AlertTriangle,
  FileText,
  MapPin,
  Filter
} from 'lucide-react';
import { disputeService } from '../../services/disputeService';
import { DisputeCase } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

export const OfficerDisputes: React.FC = () => {
  const { t, language, formatStatus, formatDate } = useTranslation();
  const [cases, setCases] = useState<DisputeCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<DisputeCase | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  // Officer Action State
  const [newStatus, setNewStatus] = useState<string>('Under Review');
  const [officerRemarks, setOfficerRemarks] = useState<string>('');
  const [resolutionNotes, setResolutionNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<boolean>(false);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await disputeService.getOfficerQueue(statusFilter || undefined);
      setCases(data);
      if (data.length > 0 && !selectedCase) {
        const full = await disputeService.getDisputeDetails(data[0].id);
        setSelectedCase(full);
      }
    } catch (err) {
      console.error('Failed to load officer disputes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [statusFilter]);

  const handleSelectCase = async (c: DisputeCase) => {
    try {
      const full = await disputeService.getDisputeDetails(c.id);
      setSelectedCase(full);
      setNewStatus(full.status);
    } catch (err) {
      setSelectedCase(c);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    setIsUpdating(true);
    try {
      await disputeService.updateStatus(
        selectedCase.id,
        newStatus,
        officerRemarks,
        newStatus === 'Resolved' ? resolutionNotes : undefined
      );
      setActionSuccess(true);
      setOfficerRemarks('');
      await fetchCases();
      const full = await disputeService.getDisputeDetails(selectedCase.id);
      setSelectedCase(full);
      setTimeout(() => setActionSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to update dispute status', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const i18n = {
    badge: {
      en: 'Officer Dispute Review & Resolution Queue',
      ta: 'அதிகாரி தகராறு மதிப்பாய்வு மற்றும் தீர்வு வரிசை',
      hi: 'अधिकारी विवाद समीक्षा एवं समाधान कतार',
      te: 'అధికారి వివాదాల సమీక్ష మరియు పరిష్కార క్యూ',
      kn: 'ಅಧಿಕಾರಿ ವಿವಾದ ಪರಿಶೀಲನೆ ಮತ್ತು ಪರಿಹಾರ ಸರತಿ',
      ml: 'ഓഫീസർ തർക്ക പരിഹാര ക്യൂ'
    }[language] || 'Officer Dispute Review & Resolution Queue',
    queueTitle: {
      en: 'Grievance Queue',
      ta: 'குறைதீர்ப்பு வரிசை',
      hi: 'शिकायत कतार',
      te: 'ఫిర్యాదుల క్యూ',
      kn: 'ಕುಂದುಕೊರತೆ ಸರತಿ',
      ml: 'പരാതി ക്യൂ'
    }[language] || 'Grievance Queue',
    casesCount: {
      en: 'Cases',
      ta: 'வழக்குகள்',
      hi: 'मामले',
      te: 'కేసులు',
      kn: 'ಪ್ರಕರಣಗಳು',
      ml: 'കേസുകൾ'
    }[language] || 'Cases',
    loadingQueue: {
      en: 'Loading dispute queue...',
      ta: 'தகராறு வரிசை ஏற்றப்படுகிறது...',
      hi: 'विवाद कतार लोड हो रही है...',
      te: 'వివాదాల క్యూ లోడ్ అవుతోంది...',
      kn: 'ವಿವಾದ ಸರತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
      ml: 'തർക്ക ക്യൂ ലോഡ് ചെയ്യുന്നു...'
    }[language] || 'Loading dispute queue...',
    citizenLabel: {
      en: 'Citizen',
      ta: 'குடிமகன்',
      hi: 'नागरिक',
      te: 'పౌరుడు',
      kn: 'ನಾಗರಿಕ',
      ml: 'പൗരൻ'
    }[language] || 'Citizen',
    adjudicationTitle: {
      en: 'Official Adjudication & Status Update',
      ta: 'அதிகாரப்பூர்வ தீர்ப்பு மற்றும் நிலை புதுப்பிப்பு',
      hi: 'आधिकारिक निर्णय और स्थिति अद्यतन',
      te: 'అధికారిక తీర్పు & స్థితి నవీకరణ',
      kn: 'ಅಧಿಕೃತ ತೀರ್ಪು ಮತ್ತು ಸ್ಥಿತಿ ನವೀಕರಣ',
      ml: 'ഔദ്യോഗിക തീരുമാനവും നില അപ്‌ഡേറ്റും'
    }[language] || 'Official Adjudication & Status Update',
    newStatusLabel: {
      en: 'New Workflow Status',
      ta: 'புதிய பணிப்பாய்வு நிலை',
      hi: 'नई कार्यप्रवाह स्थिति',
      te: 'కొత్త వర్క్‌ఫ్లో స్థితి',
      kn: 'ಹೊಸ ಕೆಲಸದ ಹರಿವಿನ ಸ್ಥಿತಿ',
      ml: 'പുതിയ വർക്ക്ഫ്ലോ നില'
    }[language] || 'New Workflow Status',
    officerRemarksLabel: {
      en: 'Officer Remarks / Audit Entry',
      ta: 'அதிகாரி குறிப்புகள் / தணிக்கை பதிவு',
      hi: 'अधिकारी टिप्पणियां / ऑडिट प्रविष्टि',
      te: 'అధికారి వ్యాఖ్యలు / ఆడిట్ నమోదు',
      kn: 'ಅಧಿಕಾರಿ ಟಿಪ್ಪಣಿಗಳು / ಆಡಿಟ್ ಪ್ರವೇಶ',
      ml: 'ഉദ്യോഗസ്ഥ കുറിപ്പുകൾ / ഓഡിറ്റ് എൻട്രി'
    }[language] || 'Officer Remarks / Audit Entry',
    remarksPlaceholder: {
      en: 'e.g. Field inspection scheduled for survey bounds.',
      ta: 'எ.கா. எல்லைகளை சரிபார்க்க கள ஆய்வு திட்டமிடப்பட்டுள்ளது.',
      hi: 'उदा. सर्वेक्षण सीमाओं के लिए फील्ड निरीक्षण निर्धारित।',
      te: 'ఉదా. సర్వే సరిహద్దుల కోసం ఫీల్డ్ తనిఖీ షెడ్యూల్ చేయబడింది.',
      kn: 'ಉದಾ. ಸರ್ವೆ ಗಡಿಗಳಿಗಾಗಿ ಕ್ಷೇತ್ರ ತಪಾಸಣೆ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ.',
      ml: 'ഉദാ. ഫീൽഡ് പരിശോധന നിശ്ചയിച്ചു.'
    }[language] || 'e.g. Field inspection scheduled for survey bounds.',
    finalNotesLabel: {
      en: 'Final Resolution Notes',
      ta: 'இறுதி தீர்வு குறிப்புகள்',
      hi: 'अंतिम समाधान नोट्स',
      te: 'తుది పరిష్కార నోట్స్',
      kn: 'ಅಂತಿಮ ಪರಿಹಾರ ಟಿಪ್ಪಣಿಗಳು',
      ml: 'അന്തിമ പരിഹാര കുറിപ്പുകൾ'
    }[language] || 'Final Resolution Notes',
    finalNotesPlaceholder: {
      en: 'Official findings and mutation/boundary correction order reference...',
      ta: 'அதிகாரப்பூர்வ கண்டுபிடிப்புகள் மற்றும் பட்டா மாறுதல் உத்தரவு குறிப்பு...',
      hi: 'आधिकारिक निष्कर्ष और नामांतरण/सीमा सुधार आदेश संदर्भ...',
      te: 'అధికారిక పరిశీలనలు మరియు సరిహద్దు సవరణ ఉత్తర్వు రిఫరెన్స్...',
      kn: 'ಅಧಿಕೃತ ಸಂಶೋಧನೆಗಳು ಮತ್ತು ಗಡಿ ತಿದ್ದುಪಡಿ ಆದೇಶದ ಉಲ್ಲೇಖ...',
      ml: 'ഔദ്യോഗിക കണ്ടെത്തലുകളും അതിർത്തി തിരുത്തൽ ഉത്തരവ് റഫറൻസും...'
    }[language] || 'Official findings and mutation/boundary correction order reference...',
    orderSuccess: {
      en: 'Order Recorded Successfully!',
      ta: 'உத்தரவு வெற்றிகரமாக பதிவு செய்யப்பட்டது!',
      hi: 'आदेश सफलतापूर्वक दर्ज किया गया!',
      te: 'ఉత్తర్వు విజయవంతంగా నమోదు చేయబడింది!',
      kn: 'ಆದೇಶವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ!',
      ml: 'ഉത്തരവ് വിജയകരമായി രേഖപ്പെടുത്തി!'
    }[language] || 'Order Recorded Successfully!',
    submitOrderBtn: {
      en: 'Submit Official Order',
      ta: 'அதிகாரப்பூர்வ உத்தரவைச் சமர்ப்பிக்கவும்',
      hi: 'आधिकारिक आदेश जमा करें',
      te: 'అధికారిక ఉత్తర్వును సమర్పించండి',
      kn: 'ಅಧಿಕೃತ ಆದೇಶವನ್ನು ಸಲ್ಲಿಸಿ',
      ml: 'ഔദ്യോഗിക ഉത്തരവ് സമർപ്പിക്കുക'
    }[language] || 'Submit Official Order',
    timelineTitle: {
      en: 'Audit Timeline & Progression',
      ta: 'தணிக்கை காலவரிசை & முன்னேற்றம்',
      hi: 'ऑडिट समयरेखा और प्रगति',
      te: 'ఆడిట్ కాలక్రమం & పురోగతి',
      kn: 'ಆಡಿಟ್ ಟೈಮ್‌ಲೈನ್ ಮತ್ತು ಪ್ರಗತಿ',
      ml: 'ഓഡിറ്റ് ടൈംലൈൻ & പുരോഗതി'
    }[language] || 'Audit Timeline & Progression',
    selectPrompt: {
      en: 'Select a dispute from the left queue to review and adjudicate.',
      ta: 'மதிப்பாய்வு செய்து தீர்ப்பளிக்க இடதுபுற வரிசையிலிருந்து ஒரு தகராறைத் தேர்ந்தெடுக்கவும்.',
      hi: 'समीक्षा और निर्णय के लिए बाईं कतार से एक विवाद चुनें।',
      te: 'సమీక్షించి పరిష్కరించడానికి ఎడమ క్యూ నుండి వివాదాన్ని ఎంచుకోండి.',
      kn: 'ಪರಿಶೀಲಿಸಲು ಮತ್ತು ತೀರ್ಪು ನೀಡಲು ಎಡ ಸರತಿಯಿಂದ ವಿವಾದವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      ml: 'പരിശോധിച്ച് തീരുമാനമെടുക്കാൻ ഇടതുവശത്തെ ക്യൂവിൽ നിന്ന് തർക്കം തിരഞ്ഞെടുക്കുക.'
    }[language] || 'Select a dispute from the left queue to review and adjudicate.'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            {i18n.badge}
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {t.officerDisputes}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.disputesSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 font-semibold text-slate-700 outline-none"
          >
            <option value="">{t.all}</option>
            <option value="Submitted">{t.statusSubmitted}</option>
            <option value="Under Review">{t.statusUnderReview}</option>
            <option value="Evidence Review">{t.statusNeedsReview}</option>
            <option value="Resolved">{t.statusResolved}</option>
            <option value="Rejected">{t.statusRejected}</option>
          </select>
        </div>
      </div>

      {/* Grid: Left Dispute Queue | Right Details & Adjudication */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Columns: Case Cards */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-slate-700 px-1">{i18n.queueTitle} ({cases.length} {i18n.casesCount})</span>

          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">{i18n.loadingQueue}</p>
            </div>
          ) : cases.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs">
              {t.noResultsFound}
            </div>
          ) : (
            <div className="space-y-3">
              {cases.map((c) => {
                const isSelected = selectedCase?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCase(c)}
                    className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all shadow-sm ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-50 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {c.case_number}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {formatStatus(c.status)}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">{c.title}</h3>
                    <p className="text-[11px] text-slate-500 mb-2">{i18n.citizenLabel}: {c.citizen_name || 'Citizen'}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {t.surveyNumber} {c.survey_number}, {c.village}
                      </span>
                      <span className="font-semibold text-rose-600">{c.priority}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 7 Columns: Action Panel & Timeline */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                    {selectedCase.case_number}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                    {t.status}: {formatStatus(selectedCase.status)}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900">{selectedCase.title}</h2>
                <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedCase.description}
                </p>
              </div>

              {/* Action Update Form */}
              <form onSubmit={handleUpdateStatus} className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-700" />
                  {i18n.adjudicationTitle}
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">{i18n.newStatusLabel}</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-200 outline-none"
                    >
                      <option value="Under Review">{t.statusUnderReview}</option>
                      <option value="Evidence Review">{t.statusNeedsReview}</option>
                      <option value="Resolved">{t.statusResolved}</option>
                      <option value="Rejected">{t.statusRejected}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">{i18n.officerRemarksLabel}</label>
                    <input
                      type="text"
                      required
                      placeholder={i18n.remarksPlaceholder}
                      value={officerRemarks}
                      onChange={(e) => setOfficerRemarks(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                  </div>
                </div>

                {newStatus === 'Resolved' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">{i18n.finalNotesLabel}</label>
                    <textarea
                      rows={2}
                      placeholder={i18n.finalNotesPlaceholder}
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  {actionSuccess && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> {i18n.orderSuccess}
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="ml-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    {i18n.submitOrderBtn}
                  </button>
                </div>
              </form>

              {/* Timeline */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  {i18n.timelineTitle}
                </h3>

                <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedCase.timeline?.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-0.5">
                          <span>{item.actor_role}: {item.action.replace('_', ' ')}</span>
                          <span className="text-slate-400 font-normal">{formatDate(item.timestamp)}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{item.remarks}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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

