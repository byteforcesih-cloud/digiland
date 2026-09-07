import api from './api';
import { DocumentExtractedDetails } from '../types';

export const documentDetailsService = {
  extractDetails: async (documentId: number): Promise<DocumentExtractedDetails> => {
    const res = await api.post(`/documents/${documentId}/extract-details`);
    return res.data.data;
  },

  getExtractedDetails: async (documentId: number): Promise<DocumentExtractedDetails> => {
    const res = await api.get(`/documents/${documentId}/extracted-details`);
    return res.data.data;
  },

  saveConfirmedDetails: async (
    documentId: number,
    payload: {
      confirmed_fields: Record<string, string>;
      sync_to_land_record?: boolean;
    }
  ): Promise<{ success: boolean; message: string }> => {
    const res = await api.put(`/documents/${documentId}/details`, payload);
    return res.data;
  }
};
