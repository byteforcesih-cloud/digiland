import api from './api';
import { GISParcel, LandRecord } from '../types';

export const gisService = {
  getParcels: async (params?: {
    district?: string;
    taluk?: string;
    village?: string;
    survey_number?: string;
  }): Promise<GISParcel[]> => {
    const res = await api.get<GISParcel[]>('/gis/parcels', { params });
    return res.data;
  },

  searchLand: async (params?: {
    q?: string;
    owner_name?: string;
    survey_number?: string;
    patta_number?: string;
    khasra_number?: string;
    khata_number?: string;
    village?: string;
    taluk?: string;
    district?: string;
  }): Promise<LandRecord[]> => {
    const res = await api.get<LandRecord[]>('/gis/search', { params });
    return res.data;
  }
};
