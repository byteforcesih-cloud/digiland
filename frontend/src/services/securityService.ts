import api from './api';
import { DeviceSessionItem, LoginHistoryItem, FeatureAccessItem } from '../types';

export const securityService = {
  getActiveSessions: async (): Promise<DeviceSessionItem[]> => {
    const res = await api.get('/security/sessions');
    return res.data;
  },

  revokeSession: async (sessionId: number): Promise<any> => {
    const res = await api.delete(`/security/sessions/${sessionId}`);
    return res.data;
  },

  getLoginHistory: async (): Promise<LoginHistoryItem[]> => {
    const res = await api.get('/security/login-history');
    return res.data;
  },

  getSecurityEvents: async (severity?: string): Promise<any[]> => {
    const url = severity ? `/security/events?severity=${severity}` : '/security/events';
    const res = await api.get(url);
    return res.data;
  },

  getMyAccessibleFeatures: async (): Promise<{
    user_role: string;
    verification_status: string;
    is_verified: boolean;
    account_status: string;
    features: FeatureAccessItem[];
  }> => {
    const res = await api.get('/security/feature-access');
    return res.data;
  }
};
