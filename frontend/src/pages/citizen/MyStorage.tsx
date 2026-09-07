import React, { useState, useEffect } from 'react';
import { 
  FolderLock, 
  HardDrive, 
  UploadCloud, 
  Download, 
  Trash2, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Folder, 
  Tag, 
  Search, 
  Filter 
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { StorageFile, StorageUsage } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

const CATEGORIES = [
  'All',
  'Land Documents',
  'Identity Documents',
  'Tax Receipts',
  'Mutation Papers',
  'Court Orders',
  'Survey Sketches',
];

export const MyStorage: React.FC = () => {
  const { t, formatDate } = useTranslation();
  const [usage, setUsage] = useState<StorageUsage | null>(null);
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState<string>('Land Documents');
  const [uploadDescription, setUploadDescription] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const loadStorageData = async () => {
    try {
      setLoading(true);
      const usageRes = await storageService.getStorageUsage();
      setUsage(usageRes);
      const filesRes = await storageService.getFiles(selectedCategory);
      setFiles(filesRes);
    } catch (err: any) {
      setError('Failed to load secure storage vault.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStorageData();
  }, [selectedCategory]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setError('Please select a file to upload.');
      return;
    }
    setError('');
    setSuccessMsg('');

    try {
      setUploading(true);
      await storageService.uploadFile(uploadFile, uploadCategory, uploadDescription);
      setSuccessMsg(`File "${uploadFile.name}" encrypted with AES-256 and stored successfully!`);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadDescription('');
      await loadStorageData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed. Ensure file is under 25MB and in valid format.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (file: StorageFile) => {
    try {
      await storageService.downloadFile(file.id, file.original_filename);
    } catch {
      setError(`Failed to download ${file.original_filename}.`);
    }
  };

  const handleDelete = async (fileId: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this encrypted file?')) {
      return;
    }
    try {
      await storageService.deleteFile(fileId);
      setSuccessMsg('File deleted successfully.');
      await loadStorageData();
    } catch {
      setError('Failed to delete file.');
    }
  };

  const filteredFiles = files.filter((f) =>
    f.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.description && f.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                <FolderLock className="w-6 h-6" />
              </span>
              <h1 className="text-2xl font-bold text-slate-800">{t.storageVaultTitle}</h1>
            </div>
            <p className="text-sm text-slate-500">
              {t.storageVaultSubtitle}
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t.uploadToVault}
          </button>
        </div>

        {/* Quota Progress Bar */}
        {usage && (
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-slate-500" />
                {t.quotaUsage}: {usage.used_mb} MB / {usage.quota_mb} MB ({usage.percentage_used}%)
              </span>
              <span className="text-slate-500">{usage.files_count} {t.encryptedWithAES256}</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  usage.percentage_used > 90
                    ? 'bg-red-500'
                    : usage.percentage_used > 70
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(usage.percentage_used, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-700 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Categories & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              {cat === 'All' ? t.all : cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`${t.search}...`}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Files Table / Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {filteredFiles.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FolderLock className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-medium">{t.noData}</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="text-xs text-emerald-600 hover:underline font-semibold"
            >
              {t.uploadToVault}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">{t.documentTitle}</th>
                  <th className="py-3.5 px-4">{t.folderCategory}</th>
                  <th className="py-3.5 px-4">{t.fileSize}</th>
                  <th className="py-3.5 px-4">{t.encryptedWithAES256}</th>
                  <th className="py-3.5 px-4">{t.uploadedOn}</th>
                  <th className="py-3.5 px-4 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFiles.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span>{f.original_filename}</span>
                          {f.description && (
                            <p className="text-[11px] text-slate-400 font-normal">{f.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                        {f.folder_category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono">
                      {f.file_size_formatted || `${(f.file_size / (1024 * 1024)).toFixed(2)} MB`}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        <Lock className="w-3 h-3" />
                        AES-256-GCM
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {formatDate(f.created_at)}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleDownload(f)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title={t.downloadDecryptedFile}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-600" />
                {t.uploadToVault}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.folderCategory}
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.supportedFormats} ({t.maxFileSize}: 25 MB)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.tiff,.tif"
                  onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.details}
                </label>
                <input
                  type="text"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="e.g. 2025 Property Tax Payment Receipt"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  {t.tamperProofBlockchainProtected}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-50"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors disabled:opacity-50"
                >
                  {uploading ? `${t.processing}...` : t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
