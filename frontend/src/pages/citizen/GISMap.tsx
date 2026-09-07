import React, { useState, useEffect } from 'react';
import { GISParcelMap } from '../../components/gis/GISParcelMap';
import { gisService } from '../../services/gisService';
import { GISParcel } from '../../types';
import { MapPin, Search, Layers, Compass, Building } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export const GISMap: React.FC = () => {
  const { t, language } = useTranslation();
  const [parcels, setParcels] = useState<GISParcel[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<GISParcel | null>(null);
  const [districtFilter, setDistrictFilter] = useState('');
  const [surveyFilter, setSurveyFilter] = useState('');

  const loadParcels = async () => {
    try {
      const data = await gisService.getParcels({
        district: districtFilter || undefined,
        survey_number: surveyFilter || undefined
      });
      setParcels(data);
    } catch (err) {
      console.error('Failed to load GIS parcels:', err);
    }
  };

  useEffect(() => {
    loadParcels();
  }, [districtFilter, surveyFilter]);

  const i18n = {
    title: {
      en: 'GIS Cadastral Parcel Map',
      ta: 'GIS நிலப்பரப்பு வரைபடம்',
      hi: 'जीआईएस भूकर पार्सल मानचित्र',
      te: 'GIS కాడాస్ట్రల్ పార్సెల్ మ్యాప్',
      kn: 'GIS ಕ್ಯಾಡಾಸ್ಟ್ರಲ್ ಪಾರ್ಸೆಲ್ ನಕ್ಷೆ',
      ml: 'ജിഐഎസ് കാഡസ്ട്രൽ പാർസൽ മാപ്പ്'
    }[language] || 'GIS Cadastral Parcel Map',
    subtitle: {
      en: 'Interactive Geospatial Information System showing revenue boundary polygons, zoning classifications, and land coordinates.',
      ta: 'வருவாய் எல்லை பலகோணங்கள், மண்டல வகைப்பாடுகள் மற்றும் நில ஒருங்கிணைப்புகளைக் காட்டும் ஊடாடும் புவிசார் தகவல் அமைப்பு.',
      hi: 'राजस्व सीमा बहुभुज, ज़ोनिंग वर्गीकरण और भूमि निर्देशांक दिखाने वाली इंटरैक्टिव भू-स्थानिक सूचना प्रणाली।',
      te: 'రెవెన్యూ సరిహద్దులు, జోనింగ్ వర్గీకరణలు మరియు భూమి కోఆర్డినేట్‌లను చూపే ఇంటరాక్టివ్ జియోస్పేషియల్ సమాచార వ్యవస్థ.',
      kn: 'ಕಂದಾಯ ಗಡಿ ಬಹುಭುಜಾಕೃತಿಗಳು, ವಲಯ ವರ್ಗೀಕರಣಗಳು ಮತ್ತು ಭೂ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ತೋರಿಸುವ ಸಂವಾದಾತ್ಮಕ ಜಿಯೋಸ್ಪೇಷಿಯಲ್ ಮಾಹಿತಿ ವ್ಯವಸ್ಥೆ.',
      ml: 'റവന്യൂ അതിർത്തികൾ, സോണിംഗ് വർഗ്ഗീകരണങ്ങൾ, ഭൂമി കോർഡിനേറ്റുകൾ എന്നിവ കാണിക്കുന്ന ഇന്ററാക്ടീവ് ജിയോസ്പേഷ്യൽ സിസ്റ്റം.'
    }[language] || 'Interactive Geospatial Information System showing revenue boundary polygons, zoning classifications, and land coordinates.',
    surveyPlaceholder: {
      en: 'Filter by Survey No (e.g. 142/3A)',
      ta: 'சர்வே எண் மூலம் வடிகட்டவும் (எ.கா. 142/3A)',
      hi: 'सर्वे नंबर द्वारा फ़िल्टर करें (उदा. 142/3A)',
      te: 'సర్వే నంబర్ ద్వారా ఫిల్టర్ చేయండి (ఉదా. 142/3A)',
      kn: 'ಸರ್ವೆ ಸಂಖ್ಯೆಯ ಮೂಲಕ ಫಿಲ್ಟರ್ ಮಾಡಿ (ಉದಾ. 142/3A)',
      ml: 'സർവേ നമ്പർ വഴി ഫിൽട്ടർ ചെയ്യുക (ഉദാ. 142/3A)'
    }[language] || 'Filter by Survey No (e.g. 142/3A)',
    districtPlaceholder: {
      en: 'Filter District (e.g. Chennai)',
      ta: 'மாவட்டம் மூலம் வடிகட்டவும் (எ.கா. சென்னை)',
      hi: 'ज़िला फ़िल्टर करें (उदा. चेन्नई)',
      te: 'జిల్లా ఫిల్టర్ చేయండి (ఉదా. చెన్నై)',
      kn: 'ಜಿಲ್ಲೆಯನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಿ (ಉದಾ. ಚೆನ್ನೈ)',
      ml: 'ജില്ല ഫിൽട്ടർ ചെയ്യുക (ഉദാ. ചെന്നൈ)'
    }[language] || 'Filter District (e.g. Chennai)',
    showing: {
      en: 'Showing',
      ta: 'காட்டப்படுகிறது:',
      hi: 'दिखा रहा है',
      te: 'చూపిస్తోంది',
      kn: 'ತೋರಿಸಲಾಗುತ್ತಿದೆ',
      ml: 'കാണിക്കുന്നു'
    }[language] || 'Showing',
    polygons: {
      en: 'cadastral polygons',
      ta: 'நிலப்பரப்பு பலகோணங்கள்',
      hi: 'भूकर बहुभुज',
      te: 'కాడాస్ట్రల్ బహుభుజులు',
      kn: 'ಕ್ಯಾಡಾಸ್ಟ್ರಲ್ ಬಹುಭುಜಾಕೃತಿಗಳು',
      ml: 'കാഡസ്ട്രൽ പോളിഗോണുകൾ'
    }[language] || 'cadastral polygons',
    attributes: {
      en: 'Cadastral Parcel Attributes',
      ta: 'நிலப்பரப்பு பண்புக்கூறுகள்',
      hi: 'भूकर पार्सल विशेषताएं',
      te: 'పార్సెల్ లక్షణాలు',
      kn: 'ಪಾರ್ಸೆಲ್ ಗುಣಲಕ್ಷಣಗಳು',
      ml: 'പാർസൽ ആട്രിബ്യൂട്ടുകൾ'
    }[language] || 'Cadastral Parcel Attributes',
    street: {
      en: 'Street / Address',
      ta: 'தெரு / முகவரி',
      hi: 'सड़क / पता',
      te: 'వీధి / చిరునామా',
      kn: 'ರಸ್ತೆ / ವಿಳಾಸ',
      ml: 'തെരുവ് / വിലാസം'
    }[language] || 'Street / Address',
    locality: {
      en: 'Locality & Taluk',
      ta: 'பகுதி & வட்டம்',
      hi: 'इलाका और तालुक',
      te: 'ప్రాంతం & తాలూకా',
      kn: 'ಪ್ರದೇಶ & ತಾಲೂಕು',
      ml: 'പ്രദേശം & താലൂക്ക്'
    }[language] || 'Locality & Taluk',
    district: {
      en: 'District',
      ta: 'மாவட்டம்',
      hi: 'ज़िला',
      te: 'జిల్లా',
      kn: 'ಜಿಲ್ಲೆ',
      ml: 'ജില്ല'
    }[language] || 'District',
    extent: {
      en: 'Cadastral Extent',
      ta: 'நிலப்பரப்பு அளவு',
      hi: 'भूकर सीमा',
      te: 'విస్తీర్ణం',
      kn: 'ವಿಸ್ತೀರ್ಣ',
      ml: 'വിസ്തീർണം'
    }[language] || 'Cadastral Extent',
    parcelType: {
      en: 'Parcel Type',
      ta: 'நில வகை',
      hi: 'पार्सल प्रकार',
      te: 'పార్సెల్ రకం',
      kn: 'ಪಾರ್ಸೆಲ್ ಪ್ರಕಾರ',
      ml: 'പാർസൽ തരം'
    }[language] || 'Parcel Type',
    builtUp: {
      en: '🏛️ Built-up & Plot',
      ta: '🏛️ குடியிருப்பு மனை / கட்டிடம்',
      hi: '🏛️ निर्मित और प्लॉट',
      te: '🏛️ నివాస స్థలం & ప్లాట్',
      kn: '🏛️ ವಸತಿ ನಿವೇಶನ & ಪ್ಲಾಟ್',
      ml: '🏛️ പാർപ്പിട പ്ലോട്ട്'
    }[language] || '🏛️ Built-up & Plot',
    agricultural: {
      en: '🌾 Agricultural Land',
      ta: '🌾 விவசாய நிலம்',
      hi: '🌾 कृषि भूमि',
      te: '🌾 వ్యవసాయ భూమి',
      kn: '🌾 ಕೃಷಿ ಭೂಮಿ',
      ml: '🌾 കാർഷിക ഭൂമി'
    }[language] || '🌾 Agricultural Land',
    zoning: {
      en: 'Zoning Category',
      ta: 'மண்டல வகை',
      hi: 'ज़ोनिंग श्रेणी',
      te: 'జోనింగ్ వర్గం',
      kn: 'ವಲಯ ವರ್ಗ',
      ml: 'സോണിംഗ് വിഭാഗം'
    }[language] || 'Zoning Category',
    coordinates: {
      en: 'Geo-Coordinates (WGS84)',
      ta: 'புவியியல் ஆயத்தொலைவுகள் (WGS84)',
      hi: 'भू-निर्देशांक (WGS84)',
      te: 'జియో కోఆర్డినేట్స్ (WGS84)',
      kn: 'ಭೌಗೋಳಿಕ ನಿರ್ದೇಶಾಂಕಗಳು (WGS84)',
      ml: 'ജിയോ കോർഡിനേറ്റുകൾ (WGS84)'
    }[language] || 'Geo-Coordinates (WGS84)',
    lat: {
      en: 'Latitude',
      ta: 'அட்சரேகை',
      hi: 'अक्षांश',
      te: 'అక్షాంశం',
      kn: 'ಅಕ್ಷಾಂಶ',
      ml: 'അക്ഷാംശം'
    }[language] || 'Latitude',
    lng: {
      en: 'Longitude',
      ta: 'தீர்க்கரேகை',
      hi: 'देशांतर',
      te: 'రేఖాంశం',
      kn: 'ರೇಖಾಂಶ',
      ml: 'രേഖാംശം'
    }[language] || 'Longitude',
    emptyPrompt: {
      en: 'Click on any colored parcel polygon on the map to inspect survey boundaries and zoning particulars.',
      ta: 'சர்வே எல்லைகள் மற்றும் மண்டல விவரங்களை ஆய்வு செய்ய வரைபடத்தில் ஏதேனும் வண்ண நிலப்பரப்பு பலகோணத்தை சொடுக்கவும்.',
      hi: 'सर्वेक्षण सीमाओं और ज़ोनिंग विवरणों का निरीक्षण करने के लिए मानचित्र पर किसी भी रंगीन पार्सल बहुभुज पर क्लिक करें।',
      te: 'సర్వే సరిహద్దులు మరియు జోనింగ్ వివరాలను పరిశీలించడానికి మ్యాప్‌లో ఏదైనా రంగు పార్సెల్ బహుభుజిపై క్లిక్ చేయండి.',
      kn: 'ಸರ್ವೆ ಗಡಿಗಳು ಮತ್ತು ವಲಯ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ನಕ್ಷೆಯಲ್ಲಿನ ಯಾವುದೇ ಬಣ್ಣದ ಪಾರ್ಸೆಲ್ ಬಹುಭುಜಾಕೃತಿಯ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.',
      ml: 'സർവേ അതിർത്തികളും സോണിംഗ് വിവരങ്ങളും പരിശോധിക്കാൻ മാപ്പിലെ ഏതെങ്കിലും പോളിഗോണിൽ ക്ലിക്ക് ചെയ്യുക.'
    }[language] || 'Click on any colored parcel polygon on the map to inspect survey boundaries and zoning particulars.'
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
          {i18n.showing} <span className="font-bold text-slate-900">{parcels.length}</span> {i18n.polygons}
        </div>
      </div>

      {/* Map + Selected Parcel Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2">
          <GISParcelMap
            parcels={parcels}
            selectedParcel={selectedParcel}
            onParcelSelect={(p) => setSelectedParcel(p)}
          />
        </div>

        {/* Parcel Details Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-gov-navy flex items-center gap-2">
            <Building className="w-4 h-4 text-gov-gold" />
            <span>{i18n.attributes}</span>
          </h3>

          {selectedParcel ? (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">{t.surveyNumber}:</span>
                  <span className="font-mono font-bold text-indigo-700">{selectedParcel.survey_number}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">{t.pattaNumber}:</span>
                  <span className="font-bold text-slate-900">{selectedParcel.patta_number || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">{i18n.street}:</span>
                  <span className="font-semibold text-slate-800">{selectedParcel.street_name || `${selectedParcel.village} Main Road`}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">{i18n.locality}:</span>
                  <span>{selectedParcel.village}, {selectedParcel.taluk}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">{i18n.district}:</span>
                  <span>{selectedParcel.district}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">{i18n.extent}:</span>
                  <span className="font-bold text-emerald-700">{selectedParcel.area_sqft} Sq.Ft</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">{i18n.parcelType}:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedParcel.zone_type === 'Residential' || selectedParcel.zone_type === 'Commercial' ? i18n.builtUp : i18n.agricultural}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{i18n.zoning}:</span>
                  <span className="font-semibold text-blue-700">{selectedParcel.zone_type}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-blue-700" />
                  <span>{i18n.coordinates}:</span>
                </div>
                <p className="font-mono text-[10px]">
                  {i18n.lat}: {selectedParcel.latitude.toFixed(6)}° N<br />
                  {i18n.lng}: {selectedParcel.longitude.toFixed(6)}° E
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              {i18n.emptyPrompt}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

