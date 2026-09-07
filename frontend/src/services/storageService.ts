import api from './api';
import { StorageFile, StorageUsage } from '../types';

export const storageService = {
  getStorageUsage: async (): Promise<StorageUsage> => {
    const response = await api.get<StorageUsage>('/storage/usage');
    return response.data;
  },

  getFiles: async (category?: string): Promise<StorageFile[]> => {
    const params = category && category !== 'All' ? { category } : {};
    const response = await api.get<StorageFile[]>('/storage/files', { params });
    return response.data;
  },

  uploadFile: async (file: File, folderCategory: string, description?: string): Promise<StorageFile> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder_category', folderCategory);
    if (description) {
      formData.append('description', description);
    }
    const response = await api.post<StorageFile>('/storage/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  downloadFile: async (fileId: number, filename: string): Promise<void> => {
    const response = await api.get(`/storage/files/${fileId}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  deleteFile: async (fileId: number): Promise<void> => {
    await api.delete(`/storage/files/${fileId}`);
  },
};
