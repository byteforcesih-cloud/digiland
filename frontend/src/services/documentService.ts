import api from './api';
import { DocumentItem, ScanQualityResult } from '../types';

export const documentService = {
  uploadDocument: async (formData: FormData): Promise<DocumentItem> => {
    const res = await api.post<DocumentItem>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getDocuments: async (): Promise<DocumentItem[]> => {
    const res = await api.get<DocumentItem[]>('/documents');
    return res.data;
  },

  getDocumentById: async (id: number): Promise<DocumentItem> => {
    const res = await api.get<DocumentItem>(`/documents/${id}`);
    return res.data;
  },

  updateDocumentVersion: async (id: number, formData: FormData): Promise<DocumentItem> => {
    const res = await api.post<DocumentItem>(`/documents/${id}/update-version`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  downloadCertificateUrl: (id: number): string => {
    return `http://127.0.0.1:8000/api/v1/documents/${id}/download-certificate`;
  },

  downloadProtectedPdf: async (id: number, docNumber: string): Promise<void> => {
    const res = await api.get(`/documents/${id}/download-protected-pdf`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DigiLand_${docNumber}_Protected.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  getPasswordHint: async (id: number): Promise<{
    document_number: string;
    survey_number: string;
    owner_name: string;
    password_hint: string;
    example_format: string;
  }> => {
    const res = await api.get(`/documents/${id}/password-hint`);
    return res.data;
  },

  evaluateScannerFrame: async (imageBlob: Blob): Promise<ScanQualityResult> => {
    const formData = new FormData();
    formData.append('file', imageBlob, 'frame.jpg');
    const res = await api.post<ScanQualityResult>('/scanner/evaluate-frame', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  evaluateScanQuality: async (imageBlob: Blob): Promise<ScanQualityResult> => {
    const formData = new FormData();
    formData.append('file', imageBlob, 'frame.jpg');
    const res = await api.post<ScanQualityResult>('/scanner/evaluate-frame', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  compileMultiPageScan: async (formData: FormData): Promise<DocumentItem> => {
    const res = await api.post<DocumentItem>('/scanner/compile-multipage', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  compileScannedPages: async (
    pageBlobs: Blob[],
    docTitle: string,
    docType: string
  ): Promise<{ success: boolean; document: DocumentItem }> => {
    const formData = new FormData();
    formData.append('title', docTitle);
    formData.append('document_type', docType);
    pageBlobs.forEach((b, idx) => {
      formData.append('files', b, `page_${idx + 1}.jpg`);
    });
    const res = await api.post<DocumentItem>('/scanner/compile-multipage', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, document: res.data };
  },

  processOCR: async (documentId: number): Promise<DocumentItem> => {
    const res = await api.post<DocumentItem>(`/documents/${documentId}/ocr`);
    return res.data;
  },
};
