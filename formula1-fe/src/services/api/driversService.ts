import { PilotoDTO, PaginatedResponse } from '../../types';
import { apiClient, USE_MOCKS } from './apiClient';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class DriversService {
  static async getAll(page = 0, size = 50, search?: string, anio?: number): Promise<PaginatedResponse<PilotoDTO>> {
    if (USE_MOCKS) {
      await delay(300);
      return { content: [], total: 0, page, size, totalPages: 0 };
    }
    const res = await apiClient.get('/pilotos', { params: { page, size, search, ...(anio ? { anio } : {}) } });
    return res.data;
  }

  static async getById(tipoDoc: string, numDoc: string): Promise<PilotoDTO> {
    if (USE_MOCKS) {
      await delay(200);
      throw new Error('Driver not found');
    }
    const res = await apiClient.get(`/pilotos/${tipoDoc}/${numDoc}`);
    return res.data;
  }
}
