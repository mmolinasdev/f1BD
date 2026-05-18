import { PaisDTO, CiudadDTO } from '../../types';
import { apiClient } from './apiClient';

export class PaisesService {
  static async getAll(): Promise<PaisDTO[]> {
    const res = await apiClient.get('/paises');
    return res.data;
  }
}

export class CiudadesService {
  static async getAll(): Promise<CiudadDTO[]> {
    const res = await apiClient.get('/ciudades');
    return res.data;
  }

  static async getByPais(idPais: number): Promise<CiudadDTO[]> {
    const res = await apiClient.get('/ciudades', { params: { idPais } });
    return res.data;
  }
}
