import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  UploadCloud, 
  Search, 
  Map, 
  ArrowRight, 
  ShieldCheck, 
  ChevronRight, 
  Camera, 
  FolderLock
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { notificationService } from '../../services/notificationService';
import { storageService } from '../../services/storageService';
import { identityService } from '../../services/identityService';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { IdentityStatus, StorageUsage } from '../../types';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [identityStatus, setIdentityStatus] = useState<IdentityStatus | null>(null);
  const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await notificationService.getCitizenStats();
        setStats(data);
        const ident = await identityService.getIdentityStatus();
        setIdentityStatus(ident);
        const storage = await storageService.getStorageUsage();
        setStorageUsage(storage);
      } catch (err) {
        console.error('Failed to load citizen stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const metrics = stats?.metrics || {
    total_documents: 2,
    processing_documents: 0,
    verified_records: 1,
    pending_verification: 1,
    issues_detected: 0
  };

  const recentDocs = stats?.recent_documents || [];
  const isVerified = identityStatus?.verification_status === 'VERIFIED';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gov-navy to-blue-900 rounded-3xl p-6 text-white shadow-md border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gov-goldLight text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.brandName} • {t.roleCitizen}</span>
          </div>
          <h1 className="text-2xl font-black">{t.welcomeBack}, {user?.full_name}</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {t.portalOverview}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/citizen/scan"
            className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white text-xs font-bold border border-slate-600 transition flex items-center gap-2"
          >
            <Camera className="w-4 h-4 text-gov-goldLight" />
            <span>{t.scanDocument}</span>
          </Link>
          <Link
            to="/citizen/upload"
            className="px-4 py-2.5 rounded-xl bg-gov-gold hover:bg-amber-600 text-white text-xs font-bold shadow-lg transition flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t.uploadDocument}</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title={t.totalDocuments}
          value={metrics.total_documents}
          icon={FileText}
          color="navy"
          subtitle={t.myDocuments}
        />
        <StatCard
          title={t.processingDocuments}
          value={metrics.processing_documents}
          icon={Clock}
          color="blue"
          subtitle={t.ocrReview}
        />
        <StatCard
          title={t.verifiedRecords}
          value={metrics.verified_records}
          icon={CheckCircle}
          color="emerald"
          subtitle={t.statusVerified}
        />
        <StatCard
          title={t.pendingVerification}
          value={metrics.pending_verification}
          icon={Clock}
          color="gold"
          subtitle={t.statusPending}
        />
        <StatCard
          title={t.issuesDetected}
          value={metrics.issues_detected}
          icon={AlertTriangle}
          color="crimson"
          subtitle={t.requiresHumanVerification}
        />
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/citizen/storage"
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.mySecureStorage}</h4>
              <p className="text-[11px] text-slate-500">
                {storageUsage ? `${storageUsage.used_mb} MB / ${storageUsage.quota_mb} MB` : '1 GB Free Vault'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/citizen/search"
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-blue-50 text-gov-navy group-hover:bg-gov-navy group-hover:text-white transition">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.landSearch}</h4>
              <p className="text-[11px] text-slate-500">{t.cascadingLocationFilter}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/citizen/gis"
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.gisMap}</h4>
              <p className="text-[11px] text-slate-500">{t.gisCadastralViewer}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/citizen/identity-verification"
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{t.identityVerification}</h4>
              <p className="text-[11px] text-slate-500">
                {isVerified ? `✓ ${t.statusVerified}` : t.statusPending}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recent Land Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-extrabold text-sm text-gov-navy">{t.recentDocuments}</h3>
            <p className="text-xs text-slate-500">{t.portalOverview}</p>
          </div>
          <Link to="/citizen/documents" className="text-xs font-bold text-gov-navy hover:underline flex items-center gap-1">
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentDocs.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">{t.noData}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{t.uploadDocument}</p>
            <Link
              to="/citizen/upload"
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gov-navy text-white text-xs font-bold rounded-lg"
            >
              <UploadCloud className="w-3.5 h-3.5" /> {t.upload}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-xs">
              <thead>
                <tr className="text-left text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3">{t.documentNumber}</th>
                  <th className="pb-3">{t.documentTitle}</th>
                  <th className="pb-3">{t.documentType}</th>
                  <th className="pb-3">{t.version}</th>
                  <th className="pb-3">{t.status}</th>
                  <th className="pb-3 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentDocs.map((doc: any) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-mono font-bold text-slate-800">{doc.document_number}</td>
                    <td className="py-3 text-slate-900">{doc.title}</td>
                    <td className="py-3 text-slate-600">{doc.document_type}</td>
                    <td className="py-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                        v{doc.current_version}
                      </span>
                    </td>
                    <td className="py-3">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <Link
                        to={`/citizen/download?docId=${doc.id}`}
                        className="text-blue-600 hover:underline font-bold text-[11px]"
                      >
                        {t.downloadCertificate}
                      </Link>
                      <Link
                        to={`/citizen/update?docId=${doc.id}`}
                        className="text-purple-600 hover:underline font-bold text-[11px]"
                      >
                        {t.edit}
                      </Link>
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
