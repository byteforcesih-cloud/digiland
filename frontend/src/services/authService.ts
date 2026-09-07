import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  login: async (email_or_phone: string, password: string):Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', { email_or_phone, password });
    return res.data;
  },

  register: async (data: any): Promise<User> => {
    const res = await api.post<User>('/auth/register', data);
    return res.data;
  },

  getProfile: async (): Promise<User> => {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },

  forgotPassword: async (email: string): Promise<any> => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (email: string, token: string, new_password: string, confirm_new_password: string): Promise<any> => {
    const res = await api.post('/auth/reset-password', { email, token, new_password, confirm_new_password });
    return res.data;
  }
};
