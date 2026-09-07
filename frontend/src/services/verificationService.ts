import api from './api';
import { DocumentItem, VerificationRecord, DuplicateRecord, ValidationResult } from '../types';

export const verificationService = {
  getQueue: async (statusFilter?: string): Promise<DocumentItem[]> => {
    const res = await api.get<DocumentItem[]>('/verification/queue', {
      params: { filter_status: statusFilter }
    });
    return res.data;
  },

  getReviewData: async (documentId: number): Promise<any> => {
    const res = await api.get(`/verification/review/${documentId}`);
    return res.data;
  },

  submitDecision: async (data: {
    document_id: number;
    decision: string;
    remarks?: string;
    correction_instructions?: string;
    field_adjustments?: Record<string, string>;
  }): Promise<VerificationRecord> => {
    const res = await api.post<VerificationRecord>('/verification/submit', data);
    return res.data;
  },

  getDuplicates: async (): Promise<DuplicateRecord[]> => {
    const res = await api.get<DuplicateRecord[]>('/duplicate');
    return res.data;
  },

  resolveDuplicate: async (data: {
    duplicate_id: number;
    status: string;
    resolution_remarks: string;
  }): Promise<DuplicateRecord> => {
    const res = await api.post<DuplicateRecord>('/duplicate/resolve', data);
    return res.data;
  },

  getValidations: async (): Promise<ValidationResult[]> => {
    const res = await api.get<ValidationResult[]>('/validation');
    return res.data;
  }
};
