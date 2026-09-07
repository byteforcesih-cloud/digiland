import api from './api';

export const locationService = {
  getStates: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/locations/states');
    return response.data;
  },

  getDistricts: async (state: string): Promise<string[]> => {
    const response = await api.get<string[]>('/locations/districts', { params: { state } });
    return response.data;
  },

  getTaluks: async (district: string, state: string = 'Tamil Nadu'): Promise<string[]> => {
    const response = await api.get<string[]>('/locations/taluks', { params: { district, state } });
    return response.data;
  },

  getVillages: async (taluk: string, district: string, state: string = 'Tamil Nadu'): Promise<string[]> => {
    const response = await api.get<string[]>('/locations/villages', { params: { taluk, district, state } });
    return response.data;
  },

  getSuggestions: async (query: string, field?: string): Promise<string[]> => {
    const response = await api.get<string[]>('/locations/suggestions', { params: { q: query, field } });
    return response.data;
  },
};
