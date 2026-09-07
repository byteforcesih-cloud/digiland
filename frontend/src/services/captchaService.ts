import api from './api';
import { CaptchaChallenge } from '../types';

export const captchaService = {
  getChallenge: async (actionType: string = 'SENSITIVE_ACTION'): Promise<CaptchaChallenge> => {
    const response = await api.get<CaptchaChallenge>('/captcha/challenge', {
      params: { action_type: actionType },
    });
    return response.data;
  },

  verifyChallenge: async (captchaToken: string, userAnswer: string): Promise<boolean> => {
    try {
      const response = await api.post('/captcha/verify', {
        captcha_token: captchaToken,
        user_answer: userAnswer,
      });
      return response.data?.status === 'SUCCESS';
    } catch {
      return false;
    }
  },
};
