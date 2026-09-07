import api from './api';
import { IntegrityBlock } from '../types';

export const integrityService = {
  verifyDocument: async (documentId: number): Promise<{ is_intact: boolean; integrity_status: string; total_blocks: number; blocks: IntegrityBlock[] }> => {
    const res = await api.get(`/integrity/verify/${documentId}`);
    return res.data.data;
  },

  getAuditChain: async (documentId: number): Promise<{ document_id: number; document_number: string; blocks: IntegrityBlock[] }> => {
    const res = await api.get(`/integrity/audit-chain/${documentId}`);
    return res.data;
  }
};
