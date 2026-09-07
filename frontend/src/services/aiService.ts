import api from './api';
import { ChatQueryResponse, AIReviewData } from '../types';

export const aiService = {
  chat: async (
    message: string,
    language: string = 'en',
    history: any[] = [],
    contextPath?: string
  ): Promise<ChatQueryResponse> => {
    const res = await api.post<ChatQueryResponse>('/chatbot/chat', {
      message,
      language,
      history,
      context_path: contextPath || (typeof window !== 'undefined' ? window.location.pathname : undefined)
    });
    return res.data;
  },

  getAIReview: async (documentId: number): Promise<AIReviewData> => {
    const res = await api.get<AIReviewData>(`/ai-review/${documentId}`);
    return res.data;
  },

  regenerateAIReview: async (documentId: number): Promise<AIReviewData> => {
    const res = await api.post<AIReviewData>(`/ai-review/${documentId}/regenerate`);
    return res.data;
  }
};
