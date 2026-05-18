export interface PilotoDTO {
  tipoDocumento: string;
  numDocumento: string;
  nombre: string;
  apellidos: string;
  nacionalidad: string;
  fechaNacimiento: string;
  alias: string;
  numParrillaPermanente: number | null;
  urlFoto: string | null;
  estado: string; // ACTIVO | RETIRADO | SUSPENDIDO | INACTIVO
  temporadaRetiro: number | null;
  escuderiaActual: string | null;
  escuderiaId: number | null;
}

export interface PaisDTO {
  idPais: number;
  nombre: string;
}

export interface CiudadDTO {
  idCiudad: number;
  nombre: string;
  idPais: number;
  nombrePais: string;
}

export interface EscuderiaDTO {
  idEquipo: number;
  nombreOficial: string;
  codigo: string;
  nacionalidad: string;
  estado: string;
  paisSede: string | null;
  ciudadSede: string | null;
  urlFoto: string | null;
}

export interface TemporadaDTO {
  idTemporada: number;
  anio: number;
  estado: string; // PLANIFICADA | EN_CURSO | FINALIZADA
  numGps: number | null;
  fechaInicio: string | null;
  fechaFin: string | null;
}

export interface CircuitoDTO {
  idCircuito: number;
  nombreOficial: string;
  descripcion: string | null;
  pais: string;
  ciudad: string | null;
  estado: string;
  longitudKm: number | null;
  numCurvas: number | null;
  sentido: string | null; // HORARIO | ANTIHORARIO
  tipoCircuito: string | null; // PERMANENTE | CALLEJERO | MIXTO
}

export interface GranPremioDTO {
  idEvento: number;
  nombreOficial: string;
  numRonda: number;
  anioTemporada: number;
  nombreCircuito: string;
  paisCircuito: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  estado: string;
  longitudKm: number | null;
}

export interface ClasificacionDTO {
  posicion: number;
  nombre: string;
  aliasOCodigo: string;
  escuderia: string | null;
  puntosTotales: number;
  victorias: number;
  podios: number;
  poles: number;
}

export interface ResultadoCarreraDTO {
  idResultado: number;
  posicionFinal: number | null;
  nombrePiloto: string;
  alias: string;
  nombreEscuderia: string;
  tiempoTotal: string | null;
  vueltasCompletadas: number | null;
  estadoFinalizacion: string;
  puntos: number;
  vueltaRapida: boolean;
  posSalida: number | null;
}

export interface PenalizacionDTO {
  idPenalizacion: number;
  nombrePiloto: string;
  alias: string;
  tipo: string;
  motivo: string | null;
  magnitud: number | null;
  fechaResolucion: string | null;
}

export interface PaginatedResponse<T> {
  content: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}

export interface SesionDTO {
  idSesion: number;
  idEvento: number;
  nombreGP: string;
  tipoSesion: string;
  orden: number;
  fechaProgramada: string | null;
  estado: string;
  condicionPista: string | null;
  numVueltas: number | null;
}

export interface ResultadoCarreraAdminDTO {
  idResultado?: number;
  idSesion: number;
  tipoDocumento: string;
  numDocumento: string;
  nombrePiloto?: string | null;
  alias?: string | null;
  posicionFinal: number | null;
  tiempoTotal: string;
  vueltasCompletadas: number | null;
  estadoFinalizacion: string;
  puntos: number;
  vueltaRapida: boolean;
  posSalida: number | null;
  numParadasBoxes?: number | null;
  vueltasLideradas?: number | null;
}

export interface ContratoDTO {
  idContrato?: number;
  tipoDocumento: string;
  numDocumento: string;
  nombrePiloto?: string | null;
  alias?: string | null;
  idEquipo: number;
  nombreEscuderia?: string | null;
  fechaInicio: string;
  fechaFin: string | null;
}

export interface ResultadoClasificacionDTO {
  posicionParrilla: number | null;
  nombrePiloto: string;
  alias: string;
  nombreEscuderia: string | null;
  tiempoQ1: string | null;
  tiempoQ2: string | null;
  tiempoQ3: string | null;
  faseEliminacion: string | null;
}

export interface PuntosResultadoAdminDTO {
  idPuntos?: number;
  idResultado: number;
  idRegla: number;
  puntos: number;
  nombrePiloto?: string | null;
  alias?: string | null;
  tipoSesion?: string | null;
  posicion?: number | null;
}

export interface ResultadoClasificacionAdminDTO {
  idResultadoClas?: number;
  idSesion: number;
  tipoDocumento: string;
  numDocumento: string;
  nombrePiloto?: string | null;
  alias?: string | null;
  posicionParrilla: number | null;
  tiempoQ1: string;
  tiempoQ2: string;
  tiempoQ3: string;
  faseEliminacion: string;
}
