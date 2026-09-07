import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  FilePlus, 
  Clock, 
  CheckCircle, 
  FileText, 
  ShieldAlert, 
  ChevronRight, 
  Loader2, 
  Send,
  MapPin,
  Tag,
  Calendar,
  User,
  AlertTriangle
} from 'lucide-react';
import { disputeService } from '../../services/disputeService';
import { DisputeCase } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

export const Disputes: React.FC = () => {
  const { t, formatStatus, formatDate } = useTranslation();
  const [disputes, setDisputes] = useState<DisputeCase[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<DisputeCase | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Form State
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('BOUNDARY_DISPUTE');
  const [surveyNumber, setSurveyNumber] = useState<string>('142/3A');
  const [village, setVillage] = useState<string>('Mylapore');
  const [taluk, setTaluk] = useState<string>('Mylapore');
  const [district, setDistrict] = useState<string>('Chennai');
  const [priority, setPriority] = useState<string>('Medium');
  const [description, setDescription] = useState<string>('');

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const data = await disputeService.getMyDisputes();
      setDisputes(data);
      if (data.length > 0 && !selectedDispute) {
        const fullDetails = await disputeService.getDisputeDetails(data[0].id);
        setSelectedDispute(fullDetails);
      }
    } catch (err: any) {
      console.error('Failed to load disputes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleSelectDispute = async (d: DisputeCase) => {
    try {
      const full = await disputeService.getDisputeDetails(d.id);
      setSelectedDispute(full);
    } catch (err) {
      setSelectedDispute(d);
    }
  };

  const handleCreateDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await disputeService.createDispute({
        title,
        description,
        category,
        survey_number: surveyNumber,
        village,
        taluk,
        district,
        priority
      });
      setShowNewModal(false);
      setTitle('');
      setDescription('');
      await fetchDisputes();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to file dispute case.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
      case 'Evidence Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Resolved':
      case 'Closed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            {t.disputesTitle}
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {t.disputesSubtitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.officialGovtPortal}
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <FilePlus className="w-4 h-4" />
          {t.fileNewDispute}
        </button>
      </div>

      {/* Main Grid: Left Disputes List | Right Timeline & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Columns: Case Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700">{t.disputes} ({disputes.length})</span>
          </div>

          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">{t.processing}...</p>
            </div>
          ) : disputes.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-xs text-slate-600 font-bold">{t.noData}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {disputes.map((d) => {
                const isSelected = selectedDispute?.id === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => handleSelectDispute(d)}
                    className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all shadow-sm ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-50 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {d.case_number}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusColor(d.status)}`}>
                        {formatStatus(d.status)}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">{d.title}</h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {t.surveyNumber} {d.survey_number} - {d.village}, {d.district}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {d.category.replace('_', ' ')}
                      </span>
                      <span className="font-semibold text-rose-600">{d.priority}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 7 Columns: Dispute Timeline & Official Actions */}
        <div className="lg:col-span-7">
          {selectedDispute ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Header Info */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                    {t.details}: {selectedDispute.case_number}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${getStatusColor(selectedDispute.status)}`}>
                    {t.status}: {formatStatus(selectedDispute.status)}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900">{selectedDispute.title}</h2>
                <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  {selectedDispute.description}
                </p>
              </div>

              {/* Property & Assigned Officer Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">{t.surveyNumber}</span>
                  <span className="font-bold text-slate-800">{selectedDispute.survey_number}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">{t.selectVillage} / {t.selectDistrict}</span>
                  <span className="font-bold text-slate-800">{selectedDispute.village}, {selectedDispute.district}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">{t.disputeCategory}</span>
                  <span className="font-bold text-slate-800">{selectedDispute.category.replace('_', ' ')}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">{t.roleOfficer}</span>
                  <span className="font-bold text-indigo-700">{selectedDispute.assigned_officer || t.roleOfficer}</span>
                </div>
              </div>

              {/* Chronological Action Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  {t.recentActivity}
                </h3>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {(selectedDispute.timeline && selectedDispute.timeline.length > 0) ? (
                    selectedDispute.timeline.map((event, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-800">{event.action.replace('_', ' ')}</span>
                            <span className="text-slate-400">{event.timestamp?.split('T')[0]}</span>
                          </div>
                          <p className="text-[11px] text-slate-600">{event.remarks}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="relative">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">{t.statusSubmitted}</span>
                          <span className="text-slate-400">{selectedDispute.created_at?.split('T')[0]}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{t.statusPending}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-xs">
              {t.noData}
            </div>
          )}
        </div>
      </div>

      {/* New Dispute Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FilePlus className="w-4 h-4 text-rose-600" />
                {t.fileNewDispute}
              </h2>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateDispute} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.documentTitle}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Encroachment on southern boundary fence"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.disputeCategory}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none text-xs"
                  >
                    <option value="BOUNDARY_DISPUTE">Boundary Dispute</option>
                    <option value="ENCROACHMENT">Illegal Encroachment</option>
                    <option value="TITLE_DISPUTE">Title & Ownership Discrepancy</option>
                    <option value="FRAUDULENT_MUTATION">Fraudulent Mutation Grievance</option>
                    <option value="INHERITANCE_ISSUE">Inheritance Succession Issue</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.details}</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none text-xs"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.surveyNumber}</label>
                  <input
                    type="text"
                    required
                    value={surveyNumber}
                    onChange={(e) => setSurveyNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.selectVillage}</label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.details}</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the discrepancy, survey demarcations, and required remedy..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {t.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
