import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  UploadCloud, 
  Camera, 
  RefreshCw, 
  Download, 
  Search, 
  Map, 
  Clock, 
  Bell, 
  User, 
  History,
  ShieldCheck,
  CheckSquare,
  Eye,
  AlertTriangle,
  Copy,
  Layers,
  Database,
  FolderLock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen = true, onClose }) => {
  const { role } = useAuth();
  const { t } = useTranslation();

  const citizenNav = [
    { name: t.dashboard, path: '/citizen/dashboard', icon: LayoutDashboard },
    { name: t.mySecureStorage, path: '/citizen/storage', icon: FolderLock },
    { name: t.myDocuments, path: '/citizen/documents', icon: FileText },
    { name: t.uploadDocument, path: '/citizen/upload', icon: UploadCloud },
    { name: t.scanDocument, path: '/citizen/scan', icon: Camera },
    { name: t.updateDocument, path: '/citizen/update', icon: RefreshCw },
    { name: t.downloadDocument, path: '/citizen/download', icon: Download },
    { name: t.landSearch, path: '/citizen/search', icon: Search },
    { name: t.gisMap, path: '/citizen/gis', icon: Map },
    { name: t.verificationStatus, path: '/citizen/status', icon: Clock },
    { name: t.disputes, path: '/citizen/disputes', icon: ShieldCheck },
    { name: t.notifications, path: '/citizen/notifications', icon: Bell },
    { name: t.profile, path: '/citizen/profile', icon: User },
    { name: t.auditHistory, path: '/citizen/audit', icon: History },
  ];

  const officerNav = [
    { name: t.dashboard, path: '/officer/dashboard', icon: LayoutDashboard },
    { name: t.citizenRecords, path: '/officer/citizen-records', icon: Database },
    { name: t.documentVerification, path: '/officer/verification', icon: CheckSquare },
    { name: t.fraudReviewQueue, path: '/officer/fraud-review', icon: ShieldCheck },
    { name: t.officerDisputes, path: '/officer/disputes', icon: AlertTriangle },
    { name: t.ocrReview, path: '/officer/ocr-review', icon: Eye },
    { name: t.dataValidation, path: '/officer/validation', icon: AlertTriangle },
    { name: t.duplicateDetection, path: '/officer/duplicate-detection', icon: Copy },
    { name: t.gisMap, path: '/officer/gis', icon: Layers },
    { name: t.auditLogs, path: '/officer/audit', icon: History },
    { name: t.notifications, path: '/officer/notifications', icon: Bell },
    { name: t.profile, path: '/officer/profile', icon: User },
  ];

  const navItems = role === 'GOVERNMENT_OFFICER' ? officerNav : citizenNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/40 lg:hidden" 
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-24 bottom-0 left-0 z-30 w-64 bg-white border-r border-slate-200 shadow-sm transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Header indicator */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              {role === 'GOVERNMENT_OFFICER' ? t.roleOfficer : t.roleCitizen}
            </span>
            <span className={`w-2 h-2 rounded-full ${role === 'GOVERNMENT_OFFICER' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'bg-gov-navy text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom Help Banner */}
          <div className="p-3 border-t border-slate-100 bg-slate-50">
            <div className="rounded-lg p-2.5 bg-blue-50 border border-blue-100 text-slate-700 text-[11px]">
              <div className="flex items-center space-x-1.5 font-bold text-gov-navy mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gov-gold" />
                <span>{t.brandName} Helpdesk</span>
              </div>
              <p className="text-slate-600 text-[10px]">Toll-Free: 1800-425-1333</p>
              <p className="text-slate-500 text-[10px]">Mon - Sat (9:30 AM - 6 PM)</p>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};
