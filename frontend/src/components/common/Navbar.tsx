import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Bell, 
  Globe, 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { LanguageCode } from '../../types';

export const Navbar: React.FC<{ onMenuToggle?: () => void }> = ({ onMenuToggle }) => {
  const { user, isAuthenticated, logout, role } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-gov-navy text-white shadow-md border-b-2 border-gov-gold">
      {/* Top Utility Bar */}
      <div className="bg-gov-navyDark text-slate-300 text-xs px-4 py-1 flex justify-between items-center border-b border-gov-navy">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-gov-goldLight">DIGILAND</span>
          <span className="text-slate-500">|</span>
          <span>{t.officialGovtPortal}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-emerald-400 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" /> {t.tamperProofBlockchainProtected}
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && onMenuToggle && (
              <button 
                onClick={onMenuToggle}
                className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gov-gold to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-xl tracking-tight text-white">{t.brandName}</span>
                  <span className="bg-gov-gold/20 text-gov-goldLight text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-gov-gold/40">
                    AI 2.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium hidden sm:block">
                  {t.brandTagline}
                </p>
              </div>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
              >
                <Globe className="w-4 h-4 text-gov-gold" />
                <span className="uppercase font-bold">{language}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-lg shadow-xl py-1 z-50 border border-slate-200 animate-in fade-in">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-100 ${
                        language === l.code ? 'font-bold text-gov-navy bg-slate-50' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.label}</span>
                      {language === l.code && <CheckCircle2 className="w-3.5 h-3.5 text-gov-emerald" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifMenu(!showNotifMenu)}
                    className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gov-crimson text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifMenu && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-800 rounded-lg shadow-2xl py-2 z-50 border border-slate-200">
                      <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                        <span className="font-bold text-sm text-gov-navy">{t.notifications}</span>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:underline font-medium"
                          >
                            {t.markAllRead}
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">
                            {t.noNotifications}
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              onClick={() => markAsRead(n.id)}
                              className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition ${!n.is_read ? 'bg-blue-50/60 font-medium' : ''}`}
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-semibold text-slate-900">{n.title}</span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-slate-100 text-center">
                        <Link 
                          to={role === 'GOVERNMENT_OFFICER' ? '/officer/notifications' : '/citizen/notifications'}
                          onClick={() => setShowNotifMenu(false)}
                          className="text-xs text-gov-navy font-semibold hover:underline"
                        >
                          {t.viewAll}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Role Badge & Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-xs text-white border border-slate-700 transition"
                  >
                    <div className="w-6 h-6 rounded-full bg-gov-gold/30 text-gov-goldLight font-bold flex items-center justify-center text-xs">
                      {user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="font-semibold truncate max-w-[120px]">{user?.full_name}</div>
                      <div className="text-[10px] text-gov-goldLight font-mono uppercase">
                        {role === 'GOVERNMENT_OFFICER' ? t.roleOfficer : t.roleCitizen}
                      </div>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-lg shadow-xl py-1 z-50 border border-slate-200">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="font-bold text-xs text-gov-navy">{user?.full_name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {role === 'GOVERNMENT_OFFICER' ? t.roleOfficer : t.roleCitizen}
                        </span>
                      </div>
                      
                      <Link
                        to={role === 'GOVERNMENT_OFFICER' ? '/officer/profile' : '/citizen/profile'}
                        onClick={() => setShowUserMenu(false)}
                        className="w-full text-left px-4 py-2 text-xs flex items-center space-x-2 text-slate-700 hover:bg-slate-100"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>{t.profile}</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs flex items-center space-x-2 text-gov-crimson hover:bg-red-50 border-t border-slate-100"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t.logout}</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-lg bg-gov-gold hover:bg-amber-600 text-white text-xs font-bold shadow transition"
                >
                  {t.login}
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-block px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                >
                  {t.register}
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
