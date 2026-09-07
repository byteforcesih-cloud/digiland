import api from './api';
import { IdentityStatus, MockAadhaarProfile, OTPRequestResponse, OTPConfirmResponse } from '../types';

export const identityService = {
  getIdentityStatus: async (): Promise<IdentityStatus> => {
    const response = await api.get<IdentityStatus>('/identity/status');
    return response.data;
  },

  getDemoProfiles: async (): Promise<MockAadhaarProfile[]> => {
    const response = await api.get<MockAadhaarProfile[]>('/identity/demo-profiles');
    return response.data;
  },

  requestOTP: async (aadhaar_number: string, captcha_token?: string, captcha_answer?: string): Promise<OTPRequestResponse> => {
    const response = await api.post<OTPRequestResponse>('/identity/aadhaar/request-otp', {
      aadhaar_number,
      captcha_token,
      captcha_answer,
    });
    return response.data;
  },

  confirmOTP: async (session_id: string, otp_code: string): Promise<OTPConfirmResponse> => {
    const response = await api.post<OTPConfirmResponse>('/identity/aadhaar/confirm-otp', {
      session_id,
      otp_code,
    });
    return response.data;
  },
};
