import api from './api';
import { NotificationItem, AuditLogItem } from '../types';

export const notificationService = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    const res = await api.get<NotificationItem[]>('/notifications');
    return res.data;
  },

  markAsRead: async (id: number): Promise<NotificationItem> => {
    const res = await api.patch<NotificationItem>(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async (): Promise<any> => {
    const res = await api.post('/notifications/read-all');
    return res.data;
  },

  getAuditLogs: async (params?: { action?: string; entity_type?: string }): Promise<AuditLogItem[]> => {
    const res = await api.get<AuditLogItem[]>('/audit', { params });
    return res.data;
  },

  getCitizenStats: async (): Promise<any> => {
    const res = await api.get('/analytics/citizen-dashboard');
    return res.data;
  },

  getOfficerStats: async (): Promise<any> => {
    const res = await api.get('/analytics/officer-dashboard');
    return res.data;
  }
};

export const aiService = {
  chat: async (message: string, language: string = 'en', history: any[] = []): Promise<any> => {
    const res = await api.post('/chatbot/chat', { message, language, history });
    return res.data;
  }
};
