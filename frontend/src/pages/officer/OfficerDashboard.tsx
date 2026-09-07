import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  CheckSquare, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  Eye, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Building
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { notificationService } from '../../services/notificationService';
import { verificationService } from '../../services/verificationService';
import { DocumentItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';

export const OfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t, language, formatStatus } = useTranslation();
  const [analytics, setAnalytics] = useState<any>(null);
  const [queue, setQueue] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, queueData] = await Promise.all([
          notificationService.getOfficerStats(),
          verificationService.getQueue()
        ]);
        setAnalytics(statsData);
        setQueue(queueData);
      } catch (err) {
        console.error('Failed to load officer dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const summary = analytics?.summary || {
    total_documents: 64,
    verified_documents: 56,
    pending_verification: 6,
    rejected_documents: 2,
    low_confidence_records: 4,
    duplicate_records: 2,
    validation_errors: 3
  };

  const charts = analytics?.charts || {
    district_progress: [
      { district: 'Chennai', count: 48 },
      { district: 'Coimbatore', count: 32 },
      { district: 'Madurai', count: 24 },
      { district: 'Salem', count: 18 },
      { district: 'Tiruchirappalli', count: 15 }
    ],
    status_breakdown: [
      { status: 'VERIFIED', count: 56 },
      { status: 'VERIFICATION_REQUIRED', count: 6 },
      { status: 'PENDING', count: 4 },
      { status: 'REJECTED', count: 2 }
    ],
    timeline: [
      { month: 'May', uploaded: 34, verified: 30, rejected: 2 },
      { month: 'Jun', uploaded: 45, verified: 40, rejected: 3 },
      { month: 'Jul', uploaded: 58, verified: 51, rejected: 4 },
      { month: 'Aug', uploaded: 64, verified: 56, rejected: 2 }
    ],
    error_statistics: [
      { category: 'Low Confidence (< 75%)', count: 4 },
      { category: 'Potential Duplicate Detected', count: 2 },
      { category: 'Survey Number Format Issue', count: 3 },
      { category: 'Area Variance Discrepancy', count: 2 }
    ]
  };

  const i18n = {
    officerConsoleBadge: {
      en: 'Revenue & Land Administration • Officer Console',
      ta: 'வருவாய் மற்றும் நில நிர்வாகம் • அதிகாரி மையம்',
      hi: 'राजस्व एवं भूमि प्रशासन • अधिकारी कंसोल',
      te: 'రెవెన్యూ మరియు భూమి పరిపాలన • అధికారి కన్సోల్',
      kn: 'ಕಂದಾಯ ಮತ್ತು ಭೂ ಆಡಳಿತ • ಅಧಿಕಾರಿ ಕನ್ಸೋಲ್',
      ml: 'റവന്യൂ & ലാൻഡ് അഡ്മിനിസ്ട്രേഷൻ • ഓഫീസർ കൺസോൾ'
    }[language] || 'Revenue & Land Administration • Officer Console',
    workbenchTitle: {
      en: 'Tahsildar Verification Workbench',
      ta: 'வட்டாட்சியர் சரிபார்ப்பு பணியகம்',
      hi: 'तहसीलदार सत्यापन कार्यक्षेत्र',
      te: 'తహశీల్దార్ ధృవీకరణ వర్క్‌బెంచ్',
      kn: 'ತಹಶೀಲ್ದಾರ್ ಪರಿಶೀಲನಾ ಕಾರ್ಯಕ್ಷೇತ್ರ',
      ml: 'തഹസിൽദാർ പരിശോധനാ വർക്ക്ബെഞ്ച്'
    }[language] || 'Tahsildar Verification Workbench',
    officerLabel: {
      en: 'Officer',
      ta: 'அதிகாரி',
      hi: 'अधिकारी',
      te: 'అధికారి',
      kn: 'ಅಧಿಕಾರಿ',
      ml: 'ഓഫീസർ'
    }[language] || 'Officer',
    jurisdictionLabel: {
      en: 'Jurisdiction',
      ta: 'அதிகார வரம்பு',
      hi: 'अधिकार क्षेत्र',
      te: 'అధికార పరిధి',
      kn: 'ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿ',
      ml: 'അധികാരപരിധി'
    }[language] || 'Jurisdiction',
    subdivision: {
      en: 'Chennai Sub-Division',
      ta: 'சென்னை உப-பிரிவு',
      hi: 'चेन्नई उप-मंडल',
      te: 'చెన్నై సబ్-డివిజన్',
      kn: 'ಚೆನ್ನೈ ಉಪ-ವಿಭಾಗ',
      ml: 'ചെന്നൈ സബ്-ഡിവിഷൻ'
    }[language] || 'Chennai Sub-Division',
    openQueue: {
      en: 'Open Verification Queue',
      ta: 'சரிபார்ப்பு வரிசையைத் திற',
      hi: 'सत्यापन कतार खोलें',
      te: 'ధృవీకరణ క్యూ తెరవండి',
      kn: 'ಪರಿಶೀಲನಾ ಸರತಿಯನ್ನು ತೆರೆಯಿರಿ',
      ml: 'പരിശോധനാ ക്യൂ തുറക്കുക'
    }[language] || 'Open Verification Queue',
    totalProcessed: {
      en: 'Total Processed',
      ta: 'மொத்தம் செயலாக்கப்பட்டது',
      hi: 'कुल संसाधित',
      te: 'మొత్తం ప్రాసెస్ చేయబడింది',
      kn: 'ಒಟ್ಟು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗಿದೆ',
      ml: 'ആകെ പ്രോസസ്സ് ചെയ്തു'
    }[language] || 'Total Processed',
    rejected: {
      en: 'Rejected',
      ta: 'நிராகரிக்கப்பட்டது',
      hi: 'अस्वीकृत',
      te: 'తిరస్కరించబడింది',
      kn: 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
      ml: 'നിരസിച്ചു'
    }[language] || 'Rejected',
    lowConfidence: {
      en: 'Low Confidence',
      ta: 'குறைந்த நம்பகத்தன்மை',
      hi: 'कम विश्वसनीयता',
      te: 'తక్కువ విశ్వసనీయత',
      kn: 'ಕಡಿಮೆ ವಿಶ್ವಾಸಾರ್ಹತೆ',
      ml: 'കുറഞ്ഞ വിശ്വാസ്യത'
    }[language] || 'Low Confidence',
    duplicates: {
      en: 'Duplicates',
      ta: 'நகல் ஆவணங்கள்',
      hi: 'डुप्लिकेट',
      te: 'నకిలీలు',
      kn: 'ನಕಲುಗಳು',
      ml: 'വ്യാജരേഖകൾ'
    }[language] || 'Duplicates',
    ruleErrors: {
      en: 'Rule Errors',
      ta: 'விதி முரண்பாடுகள்',
      hi: 'नियम त्रुटियां',
      te: 'నియమ లోపాలు',
      kn: 'ನಿಯಮ ದೋಷಗಳು',
      ml: 'നിയമ പിശകുകൾ'
    }[language] || 'Rule Errors',
    districtProgress: {
      en: 'District-wise Verification Progress',
      ta: 'மாவட்டம் வாரியாக சரிபார்ப்பு முன்னேற்றம்',
      hi: 'ज़िलेवार सत्यापन प्रगति',
      te: 'జిల్లా వారీగా ధృవీకరణ పురోగతి',
      kn: 'ಜಿಲ್ಲಾವಾರು ಪರಿಶೀಲನಾ ಪ್ರಗತಿ',
      ml: 'ജില്ലാടിസ്ഥാനത്തിലുള്ള പരിശോധനാ പുരോഗതി'
    }[language] || 'District-wise Verification Progress',
    cadastreLabel: {
      en: 'Tamil Nadu Cadastre',
      ta: 'தமிழ்நாடு நில அளவை',
      hi: 'तमिलनाडु भूकर',
      te: 'తమిళనాడు కాడాస్ట్రే',
      kn: 'ತಮಿಳುನಾಡು ಕ್ಯಾಡಾಸ್ಟ್ರೆ',
      ml: 'തമിഴ്നാട് കാഡസ്ട്രെ'
    }[language] || 'Tamil Nadu Cadastre',
    deedsCount: {
      en: 'Deeds',
      ta: 'பத்திரங்கள்',
      hi: 'दस्तावेज़',
      te: 'పత్రాలు',
      kn: 'ದಾಖಲೆಗಳು',
      ml: 'രേഖകൾ'
    }[language] || 'Deeds',
    validationAnomalies: {
      en: 'Validation & Anomaly Categories',
      ta: 'சரிபார்ப்பு மற்றும் முரண்பாட்டு வகைகள்',
      hi: 'सत्यापन और विसंगति श्रेणियां',
      te: 'ధృవీకరణ & వ్యత్యాస వర్గాలు',
      kn: 'ಪರಿಶೀಲನೆ ಮತ್ತು ವೈಪರೀತ್ಯ ವಿಭಾಗಗಳು',
      ml: 'പരിശോധന & വൈരുദ്ധ്യ വിഭാഗങ്ങൾ'
    }[language] || 'Validation & Anomaly Categories',
    aiDiagnostics: {
      en: 'AI Diagnostics',
      ta: 'AI பகுப்பாய்வு',
      hi: 'एआई डायग्नोस्टिक्स',
      te: 'AI విశ్లేషణ',
      kn: 'AI ರೋಗನಿರ್ಣಯ',
      ml: 'AI ഡയഗ്നോസ്റ്റിക്സ്'
    }[language] || 'AI Diagnostics',
    casesCount: {
      en: 'Cases',
      ta: 'வழக்குகள்',
      hi: 'मामले',
      te: 'కేసులు',
      kn: 'ಪ್ರಕರಣಗಳು',
      ml: 'കേസുകൾ'
    }[language] || 'Cases',
    urgentQueue: {
      en: 'Urgent Verification Queue',
      ta: 'அவசர சரிபார்ப்பு வரிசை',
      hi: 'अति आवश्यक सत्यापन कतार',
      te: 'అత్యవసర ధృవీకరణ క్యూ',
      kn: 'ತುರ್ತು ಪರಿಶೀಲನಾ ಸರತಿ',
      ml: 'അടിയന്തര പരിശോധനാ ക്യൂ'
    }[language] || 'Urgent Verification Queue',
    queueSubtitle: {
      en: 'Documents requiring authorized officer verdict',
      ta: 'அங்கீகரிக்கப்பட்ட அதிகாரியின் தீர்ப்பு தேவைப்படும் ஆவணங்கள்',
      hi: 'अधिकृत अधिकारी के फैसले की आवश्यकता वाले दस्तावेज़',
      te: 'అధికారిక అధికారి తీర్పు అవసరమయ్యే పత్రాలు',
      kn: 'ಅಧಿಕೃತ ಅಧಿಕಾರಿ ತೀರ್ಪು ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು',
      ml: 'അധികൃത ഉദ്യോഗസ്ഥന്റെ തീരുമാനം ആവശ്യമുള്ള രേഖകൾ'
    }[language] || 'Documents requiring authorized officer verdict',
    viewAllQueue: {
      en: 'View All Queue Items',
      ta: 'அனைத்து வரிசை உருப்படிகளையும் காண்க',
      hi: 'सभी कतार आइटम देखें',
      te: 'అన్ని క్యూ అంశాలను చూడండి',
      kn: 'ಎಲ್ಲಾ ಸರತಿ ಐಟಂಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
      ml: 'എല്ലാ ക്യൂ ഇനങ്ങളും കാണുക'
    }[language] || 'View All Queue Items'
  };

  return (
    <div className="space-y-6">
      
      {/* Officer Header Banner */}
      <div className="bg-gradient-to-r from-gov-navy to-slate-900 rounded-3xl p-6 text-white shadow-lg border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gov-goldLight text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{i18n.officerConsoleBadge}</span>
          </div>
          <h1 className="text-2xl font-black">{i18n.workbenchTitle}</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            {i18n.officerLabel}: <span className="font-bold text-white">{user?.full_name}</span> • {i18n.jurisdictionLabel}: <span className="text-gov-goldLight font-mono">{i18n.subdivision}</span>
          </p>
        </div>

        <Link
          to="/officer/verification"
          className="px-4 py-2.5 rounded-xl bg-gov-gold hover:bg-amber-600 text-white text-xs font-bold shadow-lg transition flex items-center gap-2"
        >
          <CheckSquare className="w-4 h-4" />
          <span>{i18n.openQueue} ({queue.length})</span>
        </Link>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatCard
          title={i18n.totalProcessed}
          value={summary.total_documents}
          icon={FileText}
          color="navy"
        />
        <StatCard
          title={t.pendingVerification}
          value={summary.pending_verification}
          icon={Clock}
          color="gold"
        />
        <StatCard
          title={t.verifiedRecords}
          value={summary.verified_documents}
          icon={CheckSquare}
          color="emerald"
        />
        <StatCard
          title={i18n.rejected}
          value={summary.rejected_documents}
          icon={XCircle}
          color="crimson"
        />
        <StatCard
          title={i18n.lowConfidence}
          value={summary.low_confidence_records}
          icon={Eye}
          color="blue"
        />
        <StatCard
          title={i18n.duplicates}
          value={summary.duplicate_records}
          icon={Copy}
          color="crimson"
        />
        <StatCard
          title={i18n.ruleErrors}
          value={summary.validation_errors}
          icon={AlertTriangle}
          color="gold"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* District-wise Progress Bar Visualizer */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-gov-navy flex items-center gap-2">
              <Building className="w-4 h-4 text-gov-gold" />
              <span>{i18n.districtProgress}</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">{i18n.cadastreLabel}</span>
          </div>

          <div className="space-y-3">
            {charts.district_progress.map((d: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{d.district}</span>
                  <span className="font-mono">{d.count} {i18n.deedsCount}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-gov-navy h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((d.count / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error & Anomaly Statistics */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-gov-navy flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{i18n.validationAnomalies}</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">{i18n.aiDiagnostics}</span>
          </div>

          <div className="space-y-3">
            {charts.error_statistics.map((err: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">{err.category}</span>
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300 font-mono">
                  {err.count} {i18n.casesCount}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Active Verification Queue Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-sm text-gov-navy">{i18n.urgentQueue}</h3>
            <p className="text-xs text-slate-500">{i18n.queueSubtitle}</p>
          </div>

          <Link
            to="/officer/verification"
            className="text-xs font-bold text-gov-navy hover:underline flex items-center gap-1"
          >
            <span>{i18n.viewAllQueue}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead className="bg-slate-50 text-slate-700">
              <tr className="text-left font-bold uppercase tracking-wider">
                <th className="px-4 py-3">{t.documentNumber}</th>
                <th className="px-4 py-3">{t.documentTitle} & {t.documentType}</th>
                <th className="px-4 py-3">{t.version}</th>
                <th className="px-4 py-3">{t.status}</th>
                <th className="px-4 py-3 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {queue.slice(0, 5).map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{doc.document_number}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{doc.title}</div>
                    <div className="text-[11px] text-slate-500">{doc.document_type}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-800">
                      v{doc.current_version}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/officer/verification?reviewDocId=${doc.id}`}
                      className="px-3 py-1.5 bg-gov-navy hover:bg-gov-navyDark text-white text-[11px] font-bold rounded-lg transition inline-flex items-center gap-1 shadow-sm"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-gov-goldLight" />
                      <span>{t.splitScreenReview}</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

