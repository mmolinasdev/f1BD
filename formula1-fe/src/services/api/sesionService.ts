import { SesionDTO } from '../../types';
import { apiClient } from './apiClient';

export class SesionService {
  static async getAll(): Promise<SesionDTO[]> {
    const res = await apiClient.get('/sesiones');
    return res.data;
  }

  static async getByGP(idGP: number): Promise<SesionDTO[]> {
    const res = await apiClient.get(`/sesiones/gp/${idGP}`);
    return res.data;
  }

  static async getById(id: number): Promise<SesionDTO> {
    const res = await apiClient.get(`/sesiones/${id}`);
    return res.data;
  }

  static async create(dto: Omit<SesionDTO, 'idSesion' | 'nombreGP'>): Promise<SesionDTO> {
    const res = await apiClient.post('/sesiones', dto);
    return res.data;
  }

  static async update(id: number, dto: Partial<SesionDTO>): Promise<SesionDTO> {
    const res = await apiClient.put(`/sesiones/${id}`, dto);
    return res.data;
  }

  static async delete(id: number): Promise<void> {
    await apiClient.delete(`/sesiones/${id}`);
  }
}
