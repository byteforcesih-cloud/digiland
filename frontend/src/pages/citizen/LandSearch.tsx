import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building, Map, RotateCcw } from 'lucide-react';
import { gisService } from '../../services/gisService';
import { locationService } from '../../services/locationService';
import { LandRecord } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { useTranslation } from '../../context/LanguageContext';

export const LandSearch: React.FC = () => {
  const { t } = useTranslation();

  const [params, setParams] = useState({
    state: 'Tamil Nadu',
    district: '',
    taluk: '',
    village: '',
    owner_name: '',
    survey_number: '',
    patta_number: '',
    khasra_number: '',
    khata_number: '',
  });

  // Cascading Location Lists
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [taluks, setTaluks] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);

  const [results, setResults] = useState<LandRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load States on mount
  useEffect(() => {
    const initStates = async () => {
      try {
        const sList = await locationService.getStates();
        setStates(sList);
      } catch (err) {
        setStates(['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Kerala', 'Andhra Pradesh', 'Telangana']);
      }
    };
    initStates();
  }, []);

  // Update Districts on State Change
  useEffect(() => {
    const loadDistricts = async () => {
      if (!params.state) return;
      try {
        const dList = await locationService.getDistricts(params.state);
        setDistricts(dList);
        setTaluks([]);
        setVillages([]);
      } catch (err) {
        setDistricts([]);
      }
    };
    loadDistricts();
  }, [params.state]);

  // Update Taluks on District Change
  useEffect(() => {
    const loadTaluks = async () => {
      if (!params.district) return;
      try {
        const tList = await locationService.getTaluks(params.district, params.state);
        setTaluks(tList);
        setVillages([]);
      } catch (err) {
        setTaluks([]);
      }
    };
    loadTaluks();
  }, [params.district, params.state]);

  // Update Villages on Taluk Change
  useEffect(() => {
    const loadVillages = async () => {
      if (!params.taluk || !params.district) return;
      try {
        const vList = await locationService.getVillages(params.taluk, params.district, params.state);
        setVillages(vList);
      } catch (err) {
        setVillages([]);
      }
    };
    loadVillages();
  }, [params.taluk, params.district, params.state]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await gisService.searchLand(params);
      setResults(data);
      setHasSearched(true);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setParams({
      state: 'Tamil Nadu',
      district: '',
      taluk: '',
      village: '',
      owner_name: '',
      survey_number: '',
      patta_number: '',
      khasra_number: '',
      khata_number: '',
    });
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-gov-navy">{t.landSearchTitle}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.landSearchSubtitle}
        </p>
      </div>

      {/* Search Filter Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <form onSubmit={handleSearch} className="space-y-4 text-xs">
          {/* Cascading Location Dropdowns Hierarchy */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-indigo-600" />
              {t.cascadingLocationFilter}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">{t.selectState}</label>
                <select
                  value={params.state}
                  onChange={(e) => setParams({ ...params, state: e.target.value, district: '', taluk: '', village: '' })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-gov-navy outline-none"
                >
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">{t.selectDistrict}</label>
                <select
                  value={params.district}
                  onChange={(e) => setParams({ ...params, district: e.target.value, taluk: '', village: '' })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-gov-navy outline-none"
                >
                  <option value="">-- {t.selectDistrict} --</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">{t.selectTaluk}</label>
                <select
                  value={params.taluk}
                  onChange={(e) => setParams({ ...params, taluk: e.target.value, village: '' })}
                  disabled={!params.district}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-gov-navy outline-none disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">-- {t.selectTaluk} --</option>
                  {taluks.map((tItem) => (
                    <option key={tItem} value={tItem}>
                      {tItem}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">{t.selectVillage}</label>
                <select
                  value={params.village}
                  onChange={(e) => setParams({ ...params, village: e.target.value })}
                  disabled={!params.taluk}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-gov-navy outline-none disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">-- {t.selectVillage} --</option>
                  {villages.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Multi-parameter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="block font-bold text-slate-600 mb-1">{t.surveyNumber}</label>
              <input
                type="text"
                value={params.survey_number}
                onChange={(e) => setParams({ ...params, survey_number: e.target.value })}
                placeholder="e.g. 142/3A"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gov-navy outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">{t.pattaNumber}</label>
              <input
                type="text"
                value={params.patta_number}
                onChange={(e) => setParams({ ...params, patta_number: e.target.value })}
                placeholder="e.g. PATTA-4521"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gov-navy outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">{t.khasraNumber}</label>
              <input
                type="text"
                value={params.khasra_number}
                onChange={(e) => setParams({ ...params, khasra_number: e.target.value })}
                placeholder="e.g. KH-882"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gov-navy outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">{t.ownerName}</label>
              <input
                type="text"
                value={params.owner_name}
                onChange={(e) => setParams({ ...params, owner_name: e.target.value })}
                placeholder="e.g. Ramasamy"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gov-navy outline-none font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.reset}</span>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gov-navy hover:bg-gov-navyDark text-white font-bold rounded-xl shadow transition flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? t.processing : t.searchByParameters}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700">
              {t.matchingLandRecords} ({results.length})
            </h3>
          </div>

          {results.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs shadow-sm">
              <Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700">{t.noResultsFound}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((record) => (
                <div key={record.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 hover:border-slate-300 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900">{t.surveyNumber}: {record.survey_number}</h4>
                        {record.subdivision_number && (
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                            {t.subdivision}: {record.subdivision_number}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{t.pattaNumber}: {record.patta_number || 'N/A'}</p>
                    </div>
                    <StatusBadge status={record.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.ownerName}</span>
                      <span className="font-bold text-slate-800">{record.owner_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.extentArea}</span>
                      <span className="font-bold text-slate-800">{record.land_area} {record.area_unit || 'Sq.Ft'}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.parcelDetails}</span>
                      <span className="text-slate-700 font-medium">
                        {record.village}, {record.taluk}, {record.district}, {record.state}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-slate-400 font-mono">
                      ID: {record.land_parcel_id || `LP-TN-${record.id}`}
                    </span>
                    <Link
                      to={`/citizen/gis?survey_number=${encodeURIComponent(record.survey_number)}&district=${encodeURIComponent(record.district)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-navy hover:text-indigo-600 transition"
                    >
                      <Map className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{t.viewOnMap}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
