import React, { useState, useRef } from 'react';
import { UploadCloud, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { documentService } from '../../services/documentService';
import { DocumentItem } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

interface DropzoneUploadProps {
  onUploadSuccess: (doc: DocumentItem) => void;
}

export const DropzoneUpload: React.FC<DropzoneUploadProps> = ({ onUploadSuccess }) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('PATTA_CHITTA');
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMsg(null);
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg('Invalid file format. Only PDF, JPG, JPEG, and PNG files are supported.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File exceeds 25 MB size limit.');
      return;
    }
    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('document_type', documentType);
    formData.append('title', title || selectedFile.name);

    try {
      const result = await documentService.uploadDocument(formData);
      onUploadSuccess(result);
      setSelectedFile(null);
      setTitle('');
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMsg(err.response?.data?.detail || 'Failed to process and upload document.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Upload Region */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center ${
            dragActive
              ? 'border-gov-navy bg-blue-50/50 scale-[0.99]'
              : selectedFile
              ? 'border-emerald-400 bg-emerald-50/30'
              : 'border-slate-300 hover:border-gov-gold hover:bg-slate-50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
            className="hidden"
          />

          {selectedFile ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full">
                <File className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-slate-800">{selectedFile.name}</p>
              <p className="text-xs text-slate-500 font-mono">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Document'}
              </p>
              <span className="text-xs text-blue-600 font-semibold hover:underline">{t.edit}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="p-4 bg-gov-navy/10 text-gov-navy rounded-full">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                {t.dragAndDropFiles}, {t.orBrowseFiles}
              </p>
              <p className="text-xs text-slate-500">
                {t.supportedFormats} ({t.maxFileSize}: 25 MB)
              </p>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Metadata Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.documentType}
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy bg-white"
            >
              <option value="PATTA_CHITTA">Patta / Chitta Extract</option>
              <option value="SALE_DEED">Sale Deed Conveyance</option>
              <option value="KHASRA_KHATAUNI">Khasra / Khatauni Record</option>
              <option value="GIFT_DEED">Gift Deed</option>
              <option value="TITLE_DEED">Title Deed</option>
              <option value="ENCUMBRANCE_CERTIFICATE">Encumbrance Certificate (EC)</option>
              <option value="MUTATION_RECORD">Mutation Record</option>
              <option value="OTHER">Other Scanned Deed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.documentTitle}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Patta Survey 142/3A Mylapore"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-navy"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={!selectedFile || isUploading}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition ${
            !selectedFile || isUploading
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-gov-navy hover:bg-gov-navyDark text-white'
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-gov-gold" />
              <span>{t.processing}...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-gov-goldLight" />
              <span>{t.upload} & {t.verificationStatus}</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};
