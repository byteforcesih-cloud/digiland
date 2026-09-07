import api from './api';
import { FraudAnalysisResult } from '../types';

export const fraudService = {
  analyzeDocument: async (documentId: number): Promise<FraudAnalysisResult> => {
    const res = await api.post(`/fraud/analyze/${documentId}`);
    return res.data.data;
  },

  getAnalysis: async (documentId: number): Promise<FraudAnalysisResult> => {
    const res = await api.get(`/fraud/analysis/${documentId}`);
    return res.data.data;
  },

  getReviewQueue: async (minRisk: number = 30): Promise<any[]> => {
    const res = await api.get(`/fraud/review-queue?min_risk=${minRisk}`);
    return res.data;
  },

  submitOfficerReview: async (documentId: number, remarks: string, decisionOverride?: string): Promise<any> => {
    const res = await api.post(`/fraud/review/${documentId}`, { remarks, decision_override: decisionOverride });
    return res.data;
  }
};
