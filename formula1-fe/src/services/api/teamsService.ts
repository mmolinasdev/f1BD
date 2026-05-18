import { EscuderiaDTO, PilotoDTO, PaginatedResponse } from '../../types';
import { apiClient, USE_MOCKS } from './apiClient';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class TeamsService {
  static async getAll(page = 0, size = 20, anio?: number): Promise<PaginatedResponse<EscuderiaDTO>> {
    if (USE_MOCKS) {
      await delay(300);
      return { content: [], total: 0, page, size, totalPages: 0 };
    }
    const res = await apiClient.get('/escuderias', { params: { page, size, ...(anio ? { anio } : {}) } });
    return res.data;
  }

  static async getById(id: number): Promise<EscuderiaDTO> {
    if (USE_MOCKS) {
      await delay(200);
      throw new Error('Team not found');
    }
    const res = await apiClient.get(`/escuderias/${id}`);
    return res.data;
  }

  static async getPilotos(id: number, anio?: number): Promise<PilotoDTO[]> {
    if (USE_MOCKS) {
      await delay(300);
      return [];
    }
    const res = await apiClient.get(`/escuderias/${id}/pilotos`, {
      params: anio ? { anio } : {},
    });
    return res.data;
  }
}
