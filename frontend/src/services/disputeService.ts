import api from './api';
import { DisputeCase } from '../types';

export const disputeService = {
  createDispute: async (payload: {
    title: string;
    description: string;
    category: string;
    survey_number: string;
    village: string;
    taluk: string;
    district: string;
    state?: string;
    priority?: string;
  }): Promise<any> => {
    const res = await api.post('/disputes/create', payload);
    return res.data;
  },

  getMyDisputes: async (): Promise<DisputeCase[]> => {
    const res = await api.get('/disputes/my-disputes');
    return res.data;
  },

  getOfficerQueue: async (statusFilter?: string): Promise<DisputeCase[]> => {
    const url = statusFilter ? `/disputes/officer/queue?status_filter=${encodeURIComponent(statusFilter)}` : '/disputes/officer/queue';
    const res = await api.get(url);
    return res.data;
  },

  getDisputeDetails: async (disputeId: number): Promise<DisputeCase> => {
    const res = await api.get(`/disputes/${disputeId}`);
    return res.data;
  },

  updateStatus: async (
    disputeId: number,
    newStatus: string,
    remarks: string,
    resolutionNotes?: string
  ): Promise<any> => {
    const res = await api.post(`/disputes/${disputeId}/update-status`, {
      new_status: newStatus,
      remarks,
      resolution_notes: resolutionNotes
    });
    return res.data;
  }
};
