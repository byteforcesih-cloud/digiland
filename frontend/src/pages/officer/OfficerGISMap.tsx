import React, { useState, useEffect } from 'react';
import { GISParcelMap } from '../../components/gis/GISParcelMap';
import { gisService } from '../../services/gisService';
import { GISParcel } from '../../types';
import { Layers, Building, ShieldCheck, MapPin } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export const OfficerGISMap: React.FC = () => {
  const { t, language } = useTranslation();
  const [parcels, setParcels] = useState<GISParcel[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<GISParcel | null>(null);
  const [districtFilter, setDistrictFilter] = useState('');
  const [surveyFilter, setSurveyFilter] = useState('');

  useEffect(() => {
    const loadParcels = async () => {
      try {
        const data = await gisService.getParcels({
          district: districtFilter || undefined,
          survey_number: surveyFilter || undefined
        });
        setParcels(data);
      } catch (err) {
        console.error('Failed to load officer GIS data:', err);
      }
    };
    loadParcels();
  }, [districtFilter, surveyFilter]);

  const i18n = {
    title: {
      en: 'Jurisdiction GIS Cadastral Management',
      ta: 'அதிகார வரம்பு GIS நில வரைபட மேலாண்மை',
      hi: 'अधिकार क्षेत्र जीआईएस भूकर प्रबंधन',
      te: 'అధికార పరిధి GIS కాడాస్ట్రల్ నిర్వహణ',
      kn: 'ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿ GIS ಕ್ಯಾಡಾಸ್ಟ್ರಲ್ ನಿರ್ವಹಣೆ',
      ml: 'അധികാരപരിധി GIS കാഡസ്ട്രൽ മാനേജ്‌മെന്റ്'
    }[language] || 'Jurisdiction GIS Cadastral Management',
    subtitle: {
      en: 'Geospatial inspection of revenue village boundaries, agricultural subdivisions, and residential zones.',
      ta: 'வருவாய் கிராம எல்லைகள், விவசாய உட்பிரிவுகள் மற்றும் குடியிருப்பு மண்டலங்களின் புவிசார் ஆய்வு.',
      hi: 'राजस्व ग्राम सीमाओं, कृषि उप-विभाजनों और आवासीय क्षेत्रों का भू-स्थानिक निरीक्षण।',
      te: 'రెవెన్యూ గ్రామాల సరిహద్దులు, వ్యవసాయ ఉప-విభాగాలు మరియు నివాస మండలాల జియోస్పేషియల్ తనిఖీ.',
      kn: 'ಕಂದಾಯ ಗ್ರಾಮದ ಗಡಿಗಳು, ಕೃಷಿ ಉಪ-ವಿಭಾಗಗಳು ಮತ್ತು ವಸತಿ ವಲಯಗಳ ಜಿಯೋಸ್ಪೇಷಿಯಲ್ ಪರಿಶೀಲನೆ.',
      ml: 'റവന്യൂ വില്ലേജ് അതിർത്തികൾ, കാർഷിക ഉപവിഭാഗങ്ങൾ, പാർപ്പിട മേഖലകൾ എന്നിവയുടെ പരിശോധന.'
    }[language] || 'Geospatial inspection of revenue village boundaries, agricultural subdivisions, and residential zones.',
    surveyPlaceholder: {
      en: 'Survey No (e.g. 142/3A)',
      ta: 'சர்வே எண் (எ.கா. 142/3A)',
      hi: 'सर्वे नंबर (उदा. 142/3A)',
      te: 'సర్వే నంబర్ (ఉదా. 142/3A)',
      kn: 'ಸರ್ವೆ ಸಂಖ್ಯೆ (ಉದಾ. 142/3A)',
      ml: 'സർവേ നമ്പർ (ഉദാ. 142/3A)'
    }[language] || 'Survey No (e.g. 142/3A)',
    districtPlaceholder: {
      en: 'District (e.g. Chennai)',
      ta: 'மாவட்டம் (எ.கா. சென்னை)',
      hi: 'ज़िला (उदा. चेन्नई)',
      te: 'జిల్లా (ఉదా. చెన్నై)',
      kn: 'ಜಿಲ್ಲೆ (ಉದಾ. ಚೆನ್ನೈ)',
      ml: 'ജില്ല (ഉദാ. ചെന്നൈ)'
    }[language] || 'District (e.g. Chennai)',
    subdivisionParcels: {
      en: 'Sub-division Parcels',
      ta: 'உட்பிரிவு நிலங்கள்',
      hi: 'उप-विभाजन पार्सल',
      te: 'సబ్-డివిజన్ పార్సెల్స్',
      kn: 'ಉಪ-ವಿಭಾಗ ಪಾರ್ಸೆಲ್‌ಗಳು',
      ml: 'ഉപവിഭാഗ പാർസലുകൾ'
    }[language] || 'Sub-division Parcels',
    attributesTitle: {
      en: 'Cadastral Attributes & Zoning',
      ta: 'நில அளவை பண்புக்கூறுகள் & மண்டலம்',
      hi: 'भूकर विशेषताएं और ज़ोनिंग',
      te: 'కాడాస్ట్రల్ లక్షణాలు & జోనింగ్',
      kn: 'ಕ್ಯಾಡಾಸ್ಟ್ರಲ್ ಗುಣಲಕ್ಷಣಗಳು & ವಲಯ',
      ml: 'കാഡസ്ട്രൽ വിവരങ്ങളും സോണിംഗും'
    }[language] || 'Cadastral Attributes & Zoning',
    revenueVillage: {
      en: 'Revenue Village',
      ta: 'வருவாய் கிராமம்',
      hi: 'राजस्व ग्राम',
      te: 'రెవెన్యూ గ్రామం',
      kn: 'ಕಂದಾಯ ಗ್ರಾಮ',
      ml: 'റവന്യൂ വില്ലേജ്'
    }[language] || 'Revenue Village',
    taluk: {
      en: 'Taluk',
      ta: 'வட்டம்',
      hi: 'तालुक',
      te: 'తాలూకా',
      kn: 'ತಾಲೂಕು',
      ml: 'താലൂക്ക്'
    }[language] || 'Taluk',
    district: {
      en: 'District',
      ta: 'மாவட்டம்',
      hi: 'ज़िला',
      te: 'జిల్లా',
      kn: 'ಜಿಲ್ಲೆ',
      ml: 'ജില്ല'
    }[language] || 'District',
    totalArea: {
      en: 'Total Area',
      ta: 'மொத்த பரப்பளவு',
      hi: 'कुल क्षेत्रफल',
      te: 'మొత్తం వైశాల్యం',
      kn: 'ಒಟ್ಟು ವಿಸ್ತೀರ್ಣ',
      ml: 'ആകെ വിസ്തീർണം'
    }[language] || 'Total Area',
    zoning: {
      en: 'Zoning',
      ta: 'மண்டலம்',
      hi: 'ज़ोनिंग',
      te: 'జోనింగ్',
      kn: 'ವಲಯ',
      ml: 'സോണിംഗ്'
    }[language] || 'Zoning',
    wgsCoords: {
      en: 'WGS84 Coordinates',
      ta: 'WGS84 ஆயத்தொலைவுகள்',
      hi: 'WGS84 निर्देशांक',
      te: 'WGS84 కోఆర్డినేట్లు',
      kn: 'WGS84 ನಿರ್ದೇಶಾಂಕಗಳು',
      ml: 'WGS84 കോർഡിനേറ്റുകൾ'
    }[language] || 'WGS84 Coordinates',
    selectPrompt: {
      en: 'Select any parcel polygon on the map to inspect revenue attributes and boundaries.',
      ta: 'வருவாய் பண்புக்கூறுகள் மற்றும் எல்லைகளை ஆய்வு செய்ய வரைபடத்தில் ஏதேனும் நிலப்பரப்பு பலகோணத்தைத் தேர்ந்தெடுக்கவும்.',
      hi: 'राजस्व विशेषताओं और सीमाओं का निरीक्षण करने के लिए मानचित्र पर किसी भी पार्सल बहुभुज का चयन करें।',
      te: 'రెవెన్యూ లక్షణాలు మరియు సరిహద్దులను పరిశీలించడానికి మ్యాప్‌లో ఏదైనా పార్సెల్ బహుభుజిని ఎంచుకోండి.',
      kn: 'ಕಂದಾಯ ಗುಣಲಕ್ಷಣಗಳು ಮತ್ತು ಗಡಿಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ನಕ್ಷೆಯಲ್ಲಿ ಯಾವುದೇ ಪಾರ್ಸೆಲ್ ಬಹುಭುಜಾಕೃತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      ml: 'റവന്യൂ വിവരങ്ങളും അതിർത്തികളും പരിശോധിക്കാൻ മാപ്പിലെ ഏതെങ്കിലും പോളിഗോൺ തിരഞ്ഞെടുക്കുക.'
    }[language] || 'Select any parcel polygon on the map to inspect revenue attributes and boundaries.'
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-gov-navy">{i18n.title}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {i18n.subtitle}
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={surveyFilter}
            onChange={(e) => setSurveyFilter(e.target.value)}
            placeholder={i18n.surveyPlaceholder}
            className="px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gov-navy"
          />
          <input
            type="text"
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            placeholder={i18n.districtPlaceholder}
            className="px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-gov-navy"
          />
        </div>

        <div className="text-slate-500 font-medium">
          {i18n.subdivisionParcels}: <span className="font-bold text-slate-900">{parcels.length}</span>
        </div>
      </div>

      {/* Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GISParcelMap
            parcels={parcels}
            selectedParcel={selectedParcel}
            onParcelSelect={(p) => setSelectedParcel(p)}
          />
        </div>

        {/* Cadastral Details Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-gov-navy flex items-center gap-2">
            <Building className="w-4 h-4 text-gov-gold" />
            <span>{i18n.attributesTitle}</span>
          </h3>

          {selectedParcel ? (
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">{t.surveyNumber}:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedParcel.survey_number}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">{t.pattaNumber}:</span>
                  <span className="font-bold">{selectedParcel.patta_number || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">{i18n.revenueVillage}:</span>
                  <span>{selectedParcel.village}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">{i18n.taluk}:</span>
                  <span>{selectedParcel.taluk}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">{i18n.district}:</span>
                  <span>{selectedParcel.district}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">{i18n.totalArea}:</span>
                  <span className="font-bold text-emerald-700">{selectedParcel.area_sqft} Sq.Ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{i18n.zoning}:</span>
                  <span className="font-bold text-blue-700">{selectedParcel.zone_type}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 space-y-1 font-mono">
                <div>{i18n.wgsCoords}:</div>
                <div>Lat: {selectedParcel.latitude.toFixed(6)}</div>
                <div>Lon: {selectedParcel.longitude.toFixed(6)}</div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              {i18n.selectPrompt}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

