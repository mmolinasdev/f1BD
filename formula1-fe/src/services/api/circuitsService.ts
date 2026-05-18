import { CircuitoDTO, PaginatedResponse } from '../../types';
import { apiClient, USE_MOCKS } from './apiClient';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class CircuitsService {
  static async getAll(page = 0, size = 30, anio?: number): Promise<PaginatedResponse<CircuitoDTO>> {
    if (USE_MOCKS) {
      await delay(300);
      return { content: [], total: 0, page, size, totalPages: 0 };
    }
    const res = await apiClient.get('/circuitos', { params: { page, size, ...(anio ? { anio } : {}) } });
    return res.data;
  }

  static async getById(id: number): Promise<CircuitoDTO> {
    if (USE_MOCKS) {
      await delay(200);
      throw new Error('Circuit not found');
    }
    const res = await apiClient.get(`/circuitos/${id}`);
    return res.data;
  }
}
