import { apiClient } from './apiClient';
import {
  PilotoDTO,
  EscuderiaDTO,
  CircuitoDTO,
  TemporadaDTO,
  GranPremioDTO,
  ResultadoCarreraAdminDTO,
  ResultadoClasificacionAdminDTO,
  ContratoDTO,
  PuntosResultadoAdminDTO,
} from '../../types';

// ─── Pilotos ────────────────────────────────────────────────────────────────

export type PilotoCreateDTO = Omit<
  PilotoDTO,
  'urlFoto' | 'temporadaRetiro' | 'escuderiaActual' | 'escuderiaId'
>;

export type PilotoUpdateDTO = Partial<PilotoCreateDTO>;

export class AdminPilotosService {
  static async create(data: PilotoCreateDTO): Promise<PilotoDTO> {
    const res = await apiClient.post('/pilotos', data);
    return res.data;
  }

  static async update(
    tipoDoc: string,
    numDoc: string,
    data: PilotoUpdateDTO
  ): Promise<PilotoDTO> {
    const res = await apiClient.put(`/pilotos/${tipoDoc}/${numDoc}`, data);
    return res.data;
  }

  static async delete(tipoDoc: string, numDoc: string): Promise<void> {
    await apiClient.delete(`/pilotos/${tipoDoc}/${numDoc}`);
  }
}

// ─── Escuderías ─────────────────────────────────────────────────────────────

export type EscuderiaCreateDTO = Omit<EscuderiaDTO, 'idEquipo' | 'urlFoto'>;

export type EscuderiaUpdateDTO = Partial<EscuderiaCreateDTO>;

export class AdminEscuderiasService {
  static async create(data: EscuderiaCreateDTO): Promise<EscuderiaDTO> {
    const res = await apiClient.post('/escuderias', data);
    return res.data;
  }

  static async update(id: number, data: EscuderiaUpdateDTO): Promise<EscuderiaDTO> {
    const res = await apiClient.put(`/escuderias/${id}`, data);
    return res.data;
  }

  static async delete(id: number): Promise<void> {
    await apiClient.delete(`/escuderias/${id}`);
  }
}

// ─── Circuitos ──────────────────────────────────────────────────────────────

export type CircuitoCreateDTO = Omit<
  CircuitoDTO,
  'idCircuito' | 'longitudKm' | 'numCurvas' | 'sentido' | 'tipoCircuito'
>;

export type CircuitoUpdateDTO = Partial<CircuitoCreateDTO>;

export class AdminCircuitosService {
  static async create(data: CircuitoCreateDTO): Promise<CircuitoDTO> {
    const res = await apiClient.post('/circuitos', data);
    return res.data;
  }

  static async update(id: number, data: CircuitoUpdateDTO): Promise<CircuitoDTO> {
    const res = await apiClient.put(`/circuitos/${id}`, data);
    return res.data;
  }

  static async delete(id: number): Promise<void> {
    await apiClient.delete(`/circuitos/${id}`);
  }
}

// ─── Temporadas ─────────────────────────────────────────────────────────────

export type TemporadaCreateDTO = Omit<TemporadaDTO, 'idTemporada'>;

export type TemporadaUpdateDTO = Partial<TemporadaCreateDTO>;

export class AdminTemporadasService {
  static async create(data: TemporadaCreateDTO): Promise<TemporadaDTO> {
    const res = await apiClient.post('/temporadas', data);
    return res.data;
  }

  static async update(anio: number, data: TemporadaUpdateDTO): Promise<TemporadaDTO> {
    const res = await apiClient.put(`/temporadas/${anio}`, data);
    return res.data;
  }

  static async delete(anio: number): Promise<void> {
    await apiClient.delete(`/temporadas/${anio}`);
  }
}

// ─── GPs ────────────────────────────────────────────────────────────────────

export interface GpCreateDTO {
  nombreOficial: string;
  numRonda: number;
  estado: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  anioTemporada?: number;
  idCircuito?: number;
}

export type GpUpdateDTO = Partial<GpCreateDTO>;

export class AdminGpsService {
  static async create(data: GpCreateDTO): Promise<GranPremioDTO> {
    const res = await apiClient.post('/gps', data);
    return res.data;
  }

  static async update(id: number, data: GpUpdateDTO): Promise<GranPremioDTO> {
    const res = await apiClient.put(`/gps/${id}`, data);
    return res.data;
  }

  static async delete(id: number): Promise<void> {
    await apiClient.delete(`/gps/${id}`);
  }
}

// ─── Resultados Carrera ──────────────────────────────────────────────────────

export class AdminResultadosCarreraService {
  static async getBySesion(idSesion: number): Promise<ResultadoCarreraAdminDTO[]> {
    const res = await apiClient.get(`/resultados/carrera/sesion/${idSesion}`);
    return res.data;
  }

  static async create(dto: ResultadoCarreraAdminDTO): Promise<ResultadoCarreraAdminDTO> {
    const res = await apiClient.post('/resultados/carrera', dto);
    return res.data;
  }

  static async update(id: number, dto: ResultadoCarreraAdminDTO): Promise<ResultadoCarreraAdminDTO> {
    const res = await apiClient.put(`/resultados/carrera/${id}`, dto);
    return res.data;
  }

  static async delete(id: number): Promise<void> {
    await apiClient.delete(`/resultados/carrera/${id}`);
  }
}

// ─── Resultados Clasificación ────────────────────────────────────────────────

export class AdminResultadosClasificacionService {
  static async getBySesion(idSesion: number): Promise<ResultadoClasificacionAdminDTO[]> {
    const res = await apiClient.get(`/resultados/clasificacion/sesion/${idSesion}`);
    return res.data;
  }

  static async create(dto: ResultadoClasificacionAdminDTO): Promise<ResultadoClasificacionAdminDTO> {
    const res = await apiClient.post('/resultados/clasificacion', dto);
    return res.data;
  }

  static async update(id: number, dto: ResultadoClasificacionAdminDTO): Promise<ResultadoClasificacionAdminDTO> {
    const res = await apiClient.put(`/resultados/clasificacion/${id}`, dto);
    return res.data;
  }

  static async delete(id: number): Promise<void> {
    await apiClient.delete(`/resultados/clasificacion/${id}`);
  }
}

// ─── Puntos Resultado ─────────────────────────────────────────────────────────

export class AdminPuntosResultadoService {
  static async getAll(): Promise<PuntosResultadoAdminDTO[]> {
    const res = await apiClient.get('/puntos-resultado');
    return res.data;
  }

  static async getByResultado(idResultado: number): Promise<PuntosResultadoAdminDTO[]> {
    const res = await apiClient.get(`/puntos-resultado/resultado/${idResultado}`);
    return res.data;
  }

  static async create(dto: PuntosResultadoAdminDTO): Promise<PuntosResultadoAdminDTO> {
    const res = await apiClient.post('/puntos-resultado', dto);
    return res.data;
  }

  static async update(id: number, dto: PuntosResultadoAdminDTO): Promise<PuntosResultadoAdminDTO> {
    const res = await apiClient.put(`/puntos-resultado/${id}`, dto);
    return res.data;
  }

  static async delete(id: number): Promise<void> {
    await apiClient.delete(`/puntos-resultado/${id}`);
  }
}

// ─── Contratos ───────────────────────────────────────────────────────────────

export interface ContratoCreateDTO {
  tipoDocumento: string;
  numDocumento: string;
  idEquipo: number;
  fechaInicio: string;
  fechaFin: string | null;
}

export class AdminContratosService {
  static async getAll(): Promise<ContratoDTO[]> {
    const res = await apiClient.get('/contratos');
    return res.data;
  }

  static async countPilotosByAnio(anio: number): Promise<number> {
    const res = await apiClient.get(`/contratos/count/anio/${anio}`);
    return res.data;
  }

  static async create(data: ContratoCreateDTO): Promise<ContratoDTO> {
    const res = await apiClient.post('/contratos', data);
    return res.data;
  }

  static async update(id: number, data: ContratoCreateDTO): Promise<ContratoDTO> {
    const res = await apiClient.put(`/contratos/${id}`, data);
    return res.data;
  }

  static async delete(id: number): Promise<void> {
    await apiClient.delete(`/contratos/${id}`);
  }
}
