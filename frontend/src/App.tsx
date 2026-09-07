import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { AIAssistantChatbot } from './components/chat/AIAssistantChatbot';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { MyDocuments } from './pages/citizen/MyDocuments';
import { UploadDocument } from './pages/citizen/UploadDocument';
import { ScanDocument } from './pages/citizen/ScanDocument';
import { UpdateDocument } from './pages/citizen/UpdateDocument';
import { DownloadDocument } from './pages/citizen/DownloadDocument';
import { LandSearch } from './pages/citizen/LandSearch';
import { GISMap } from './pages/citizen/GISMap';
import { VerificationStatus } from './pages/citizen/VerificationStatus';
import { Notifications } from './pages/citizen/Notifications';
import { Profile } from './pages/citizen/Profile';
import { AuditHistory } from './pages/citizen/AuditHistory';
import { IdentityVerification } from './pages/citizen/IdentityVerification';
import { MyStorage } from './pages/citizen/MyStorage';
import { Disputes } from './pages/citizen/Disputes';

// Officer Pages
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { CitizenRecords } from './pages/officer/CitizenRecords';
import { DocumentVerification } from './pages/officer/DocumentVerification';
import { OCRReview } from './pages/officer/OCRReview';
import { DataValidation } from './pages/officer/DataValidation';
import { DuplicateDetection } from './pages/officer/DuplicateDetection';
import { OfficerGISMap } from './pages/officer/OfficerGISMap';
import { AuditLogs } from './pages/officer/AuditLogs';
import { FraudReviewQueue } from './pages/officer/FraudReviewQueue';
import { OfficerDisputes } from './pages/officer/OfficerDisputes';

// Public Verification Page
import { PublicQRVerify } from './pages/public/PublicQRVerify';

// Route Guard Components
const ProtectedRoute: React.FC<{ allowedRoles?: string[] }> = ({ allowedRoles }) => {
  const { isAuthenticated, role, user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-amber-400 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700">Verifying DigiLand Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'GOVERNMENT_OFFICER' ? '/officer/dashboard' : '/citizen/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:pl-64 w-full overflow-hidden transition-all duration-200">
          <Outlet />
        </main>
      </div>

      <AIAssistantChatbot />
      <Footer />
    </div>
  );
};

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <AIAssistantChatbot />
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify/qr/:token" element={<PublicQRVerify />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Route>

              {/* Citizen Routes */}
              <Route element={<ProtectedRoute allowedRoles={['CITIZEN', 'ADMIN']} />}>
                <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
                <Route path="/citizen/identity-verification" element={<IdentityVerification />} />
                <Route path="/citizen/storage" element={<MyStorage />} />
                <Route path="/citizen/documents" element={<MyDocuments />} />
                <Route path="/citizen/upload" element={<UploadDocument />} />
                <Route path="/citizen/scan" element={<ScanDocument />} />
                <Route path="/citizen/update" element={<UpdateDocument />} />
                <Route path="/citizen/download" element={<DownloadDocument />} />
                <Route path="/citizen/search" element={<LandSearch />} />
                <Route path="/citizen/gis" element={<GISMap />} />
                <Route path="/citizen/disputes" element={<Disputes />} />
                <Route path="/citizen/status" element={<VerificationStatus />} />
                <Route path="/citizen/notifications" element={<Notifications />} />
                <Route path="/citizen/profile" element={<Profile />} />
                <Route path="/citizen/audit" element={<AuditHistory />} />
              </Route>

              {/* Government Officer Routes */}
              <Route element={<ProtectedRoute allowedRoles={['GOVERNMENT_OFFICER', 'ADMIN']} />}>
                <Route path="/officer/dashboard" element={<OfficerDashboard />} />
                <Route path="/officer/citizen-records" element={<CitizenRecords />} />
                <Route path="/officer/verification" element={<DocumentVerification />} />
                <Route path="/officer/fraud-review" element={<FraudReviewQueue />} />
                <Route path="/officer/disputes" element={<OfficerDisputes />} />
                <Route path="/officer/ocr-review" element={<OCRReview />} />
                <Route path="/officer/validation" element={<DataValidation />} />
                <Route path="/officer/duplicate-detection" element={<DuplicateDetection />} />
                <Route path="/officer/gis" element={<OfficerGISMap />} />
                <Route path="/officer/audit" element={<AuditLogs />} />
                <Route path="/officer/notifications" element={<Notifications />} />
                <Route path="/officer/profile" element={<Profile />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
