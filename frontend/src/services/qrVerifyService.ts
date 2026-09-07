import api from './api';

export const qrVerifyService = {
  generateQRToken: async (documentId: number): Promise<{ verification_token: string; verification_url: string }> => {
    const res = await api.post(`/qr/generate/${documentId}`);
    return res.data;
  },

  resolvePublicToken: async (token: string): Promise<any> => {
    const res = await api.get(`/qr/public/resolve/${token}`);
    return res.data;
  }
};
