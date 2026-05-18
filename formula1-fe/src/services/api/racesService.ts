import { GranPremioDTO, ResultadoCarreraDTO, ResultadoClasificacionDTO, PenalizacionDTO, PaginatedResponse } from '../../types';
import { apiClient, USE_MOCKS } from './apiClient';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class RacesService {
  static async getBySeason(year: number, page = 0, size = 25): Promise<PaginatedResponse<GranPremioDTO>> {
    if (USE_MOCKS) {
      await delay(300);
      return { content: [], total: 0, page, size, totalPages: 0 };
    }
    const res = await apiClient.get(`/temporadas/${year}/gps`, { params: { page, size } });
    return res.data;
  }

  static async getById(id: number): Promise<GranPremioDTO> {
    if (USE_MOCKS) {
      await delay(200);
      throw new Error('Race not found');
    }
    const res = await apiClient.get(`/gps/${id}`);
    return res.data;
  }

  static async getResults(raceId: number): Promise<ResultadoCarreraDTO[]> {
    if (USE_MOCKS) {
      await delay(300);
      return [];
    }
    const res = await apiClient.get(`/gps/${raceId}/resultados`);
    return res.data;
  }

  static async getClasificacion(raceId: number): Promise<ResultadoClasificacionDTO[]> {
    if (USE_MOCKS) {
      await delay(300);
      return [];
    }
    const res = await apiClient.get(`/gps/${raceId}/clasificacion`);
    return res.data;
  }

  static async getPenalties(raceId: number): Promise<PenalizacionDTO[]> {
    if (USE_MOCKS) {
      await delay(200);
      return [];
    }
    const res = await apiClient.get(`/gps/${raceId}/penalizaciones`);
    return res.data;
  }
}
