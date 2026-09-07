import React, { useState, useEffect } from 'react';
import { Database, Search, UserCheck, Eye, MapPin, Building } from 'lucide-react';
import { gisService } from '../../services/gisService';
import { LandRecord } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { useTranslation } from '../../context/LanguageContext';

export const CitizenRecords: React.FC = () => {
  const { t, language } = useTranslation();
  const [records, setRecords] = useState<LandRecord[]>([]);
  const [searchKw, setSearchKw] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const data = await gisService.searchLand({
        q: searchKw || undefined,
        district: districtFilter || undefined
      });
      setRecords(data);
    } catch (err) {
      console.error('Failed to fetch citizen records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [districtFilter]);

  const i18n = {
    title: {
      en: 'Authorized Citizen Land Registry Records',
      ta: 'அங்கீகரிக்கப்பட்ட குடிமக்கள் நிலப் பதிவேடுகள்',
      hi: 'अधिकृत नागरिक भूमि रजिस्ट्री रिकॉर्ड',
      te: 'అధీకృత పౌర భూమి రిజిస్ట్రీ రికార్డులు',
      kn: 'ಅಧಿಕೃತ ನಾಗರಿಕ ಭೂ ನೋಂದಣಿ ದಾಖಲೆಗಳು',
      ml: 'അംഗീകൃത പൗര ഭൂമി രജിസ്ട്രി രേഖകൾ'
    }[language] || 'Authorized Citizen Land Registry Records',
    subtitle: {
      en: 'Search and inspect authorized land titles, Pattas, and survey cadastre allocations within your jurisdiction.',
      ta: 'உங்கள் அதிகார வரம்பிற்குள் அங்கீகரிக்கப்பட்ட நிலப் பத்திரங்கள், பட்டாக்கள் மற்றும் சர்வே ஒதுக்கீடுகளைத் தேடி ஆய்வு செய்யுங்கள்.',
      hi: 'अपने अधिकार क्षेत्र के भीतर अधिकृत भूमि स्वामित्व, पट्टा और सर्वेक्षण आवंटन खोजें और निरीक्षण करें।',
      te: 'మీ అధికార పరిధిలోని అధీకృత భూమి హక్కులు, పట్టాలు మరియు సర్వే కేటాయింపులను శోధించండి మరియు తనిಖీ చేయండి.',
      kn: 'ನಿಮ್ಮ ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಅಧಿಕೃತ ಭೂಮಿ ಶೀರ್ಷಿಕೆಗಳು, ಪಟ್ಟಾಗಳು ಮತ್ತು ಸರ್ವೆ ಹಂಚಿಕೆಗಳನ್ನು ಹುಡುಕಿ ಮತ್ತು ಪರಿಶೀಲಿಸಿ.',
      ml: 'നിങ്ങളുടെ അധികാരപരിധിയിലെ ഭൂമി പട്ടയങ്ങൾ, പട്ടകൾ, സർവേ വിവരങ്ങൾ തിരയുക.'
    }[language] || 'Search and inspect authorized land titles, Pattas, and survey cadastre allocations within your jurisdiction.',
    searchPlaceholder: {
      en: 'Search by Citizen Name, Survey No, Patta No...',
      ta: 'குடிமகன் பெயர், சர்வே எண், பட்டா எண் மூலம் தேடவும்...',
      hi: 'नागरिक का नाम, सर्वे नंबर, पट्टा नंबर द्वारा खोजें...',
      te: 'పౌరుడి పేరు, సర్వే నంబర్, పట్టా నంబర్ ద్వారా శోధించండి...',
      kn: 'ನಾಗರಿಕನ ಹೆಸರು, ಸರ್ವೆ ಸಂಖ್ಯೆ, ಪಟ್ಟಾ ಸಂಖ್ಯೆಯ ಮೂಲಕ ಹುಡುಕಿ...',
      ml: 'പേര്, സർവേ നമ്പർ, പട്ട നമ്പർ വഴി തിരയുക...'
    }[language] || 'Search by Citizen Name, Survey No, Patta No...',
    totalRegistryRecords: {
      en: 'Total Registry Records',
      ta: 'மொத்த பதிவேடு பதிவுகள்',
      hi: 'कुल रजिस्ट्री रिकॉर्ड',
      te: 'మొత్తం రిజిస్ట్రీ రికార్డులు',
      kn: 'ಒಟ್ಟು ನೋಂದಣಿ ದಾಖಲೆಗಳು',
      ml: 'ആകെ രജിസ്ട്രി രേഖകൾ'
    }[language] || 'Total Registry Records',
    localityAndDistrict: {
      en: 'Locality & District',
      ta: 'பகுதி & மாவட்டம்',
      hi: 'इलाका और ज़िला',
      te: 'ప్రాంతం & జిల్లా',
      kn: 'ಪ್ರದೇಶ & ಜಿಲ್ಲೆ',
      ml: 'പ്രദേശം & ജില്ല'
    }[language] || 'Locality & District'
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-gov-navy">{i18n.title}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {i18n.subtitle}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchRecords();
          }}
          className="flex-1 flex gap-2 w-full sm:w-auto"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={searchKw}
              onChange={(e) => setSearchKw(e.target.value)}
              placeholder={i18n.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gov-navy"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-gov-navy hover:bg-gov-navyDark text-white font-bold rounded-xl shadow transition"
          >
            {t.search}
          </button>
        </form>

        <div className="text-slate-500 font-medium">
          {i18n.totalRegistryRecords}: <span className="font-bold text-slate-900">{records.length}</span>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        {records.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Database className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-bold">{t.noResultsFound}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">{t.ownerName}</th>
                  <th className="px-4 py-3 text-left">{t.surveyNumber}</th>
                  <th className="px-4 py-3 text-left">{t.pattaNumber} / {t.khasraNumber}</th>
                  <th className="px-4 py-3 text-left">{i18n.localityAndDistrict}</th>
                  <th className="px-4 py-3 text-left">{t.extentArea}</th>
                  <th className="px-4 py-3 text-left">{t.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{rec.owner_name}</td>
                    <td className="px-4 py-3 font-mono text-slate-900">{rec.survey_number}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">{rec.patta_number || rec.khasra_number || 'N/A'}</td>
                    <td className="px-4 py-3 text-slate-600">{rec.village}, {rec.district}</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">{rec.land_area} {rec.area_unit}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={rec.status} />
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

