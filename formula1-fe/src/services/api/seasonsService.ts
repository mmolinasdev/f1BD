import { TemporadaDTO, ClasificacionDTO } from '../../types';
import { apiClient, USE_MOCKS } from './apiClient';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class SeasonsService {
  static async getAll(): Promise<TemporadaDTO[]> {
    if (USE_MOCKS) {
      await delay(300);
      return [];
    }
    const res = await apiClient.get('/temporadas');
    return res.data;
  }

  static async getByYear(year: number): Promise<TemporadaDTO> {
    if (USE_MOCKS) {
      await delay(200);
      throw new Error('Season not found');
    }
    const res = await apiClient.get(`/temporadas/${year}`);
    return res.data;
  }

  static async getDriverStandings(year: number): Promise<ClasificacionDTO[]> {
    if (USE_MOCKS) {
      await delay(300);
      return [];
    }
    const res = await apiClient.get(`/temporadas/${year}/clasificacion/pilotos`);
    return res.data;
  }

  static async getConstructorStandings(year: number): Promise<ClasificacionDTO[]> {
    if (USE_MOCKS) {
      await delay(300);
      return [];
    }
    const res = await apiClient.get(`/temporadas/${year}/clasificacion/constructores`);
    return res.data;
  }
}
