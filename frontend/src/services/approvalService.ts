import api from './api';

export const approvalService = {
  getWorkflows: async (level?: number, statusFilter?: string): Promise<any[]> => {
    let url = '/approval/workflows';
    const params: string[] = [];
    if (level) params.push(`level=${level}`);
    if (statusFilter) params.push(`status_filter=${encodeURIComponent(statusFilter)}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    const res = await api.get(url);
    return res.data;
  },

  submitDecision: async (
    documentId: number,
    decision: 'APPROVE' | 'REJECT' | 'REQUEST_CORRECTION' | 'ESCALATE_TO_LEVEL_2',
    remarks: string,
    rejectionReasonCategory?: string
  ): Promise<any> => {
    const res = await api.post(`/approval/${documentId}/decision`, {
      decision,
      remarks,
      rejection_reason_category: rejectionReasonCategory
    });
    return res.data;
  },

  getHistory: async (documentId: number): Promise<any[]> => {
    const res = await api.get(`/approval/${documentId}/history`);
    return res.data;
  }
};
