package com.formula1.service;

import com.formula1.exception.ResourceNotFoundException;
import com.formula1.model.dto.GranPremioDTO;
import com.formula1.model.dto.PaginatedResponseDTO;
import com.formula1.model.dto.PenalizacionDTO;
import com.formula1.model.dto.ResultadoCarreraDTO;
import com.formula1.model.dto.ResultadoClasificacionDTO;
import com.formula1.model.entity.Contrato;
import com.formula1.model.entity.GranPremio;
import com.formula1.model.entity.Penalizacion;
import com.formula1.model.entity.ResultadoCarrera;
import com.formula1.model.entity.ResultadoClasificacion;
import com.formula1.model.entity.Sesion;
import com.formula1.model.entity.Temporada;
import com.formula1.model.entity.VarianteCircuito;
import com.formula1.repository.ContratoRepository;
import com.formula1.repository.GranPremioRepository;
import com.formula1.repository.PenalizacionRepository;
import com.formula1.repository.ResultadoCarreraRepository;
import com.formula1.repository.ResultadoClasificacionRepository;
import com.formula1.repository.SesionRepository;
import com.formula1.repository.TemporadaRepository;
import com.formula1.repository.VarianteCircuitoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GranPremioService {

    @Autowired
    private GranPremioRepository granPremioRepository;

    @Autowired
    private SesionRepository sesionRepository;

    @Autowired
    private ResultadoCarreraRepository resultadoCarreraRepository;

    @Autowired
    private ResultadoClasificacionRepository resultadoClasificacionRepository;

    @Autowired
    private ContratoRepository contratoRepository;

    @Autowired
    private TemporadaRepository temporadaRepository;

    @Autowired
    private VarianteCircuitoRepository varianteCircuitoRepository;

    @Autowired
    private PenalizacionRepository penalizacionRepository;

    public PaginatedResponseDTO<GranPremioDTO> getByTemporada(Integer anio, int page, int size) {
        List<GranPremio> all = granPremioRepository.findByTemporadaAnioOrderByNumRondaAsc(anio);
        long total = all.size();
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, all.size());
        List<GranPremio> paged = (fromIndex >= all.size()) ? List.of() : all.subList(fromIndex, toIndex);

        List<GranPremioDTO> dtos = paged.stream().map(this::toDTO).collect(Collectors.toList());
        return new PaginatedResponseDTO<>(dtos, total, page, size);
    }

    public GranPremioDTO getById(Long id) {
        GranPremio gp = granPremioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gran Premio no encontrado: " + id));
        return toDTO(gp);
    }

    public List<ResultadoCarreraDTO> getResultados(Long idEvento) {
        Optional<Sesion> sesion = sesionRepository.findByGranPremioIdEventoAndTipoSesion(idEvento, "CARRERA");
        if (sesion.isEmpty()) return List.of();
        return resultadoCarreraRepository
                .findBySesionIdSesionOrderByPosicionFinalAsc(sesion.get().getIdSesion())
                .stream().map(this::toResultadoCarreraDTO).collect(Collectors.toList());
    }

    public List<ResultadoClasificacionDTO> getClasificacion(Long idEvento) {
        Optional<Sesion> sesion = sesionRepository.findByGranPremioIdEventoAndTipoSesion(idEvento, "CLASIFICACION");
        if (sesion.isEmpty()) return List.of();
        return resultadoClasificacionRepository
                .findBySesionIdSesionOrderByPosicionParrillaAsc(sesion.get().getIdSesion())
                .stream().map(this::toResultadoClasificacionDTO).collect(Collectors.toList());
    }

    public List<PenalizacionDTO> getPenalizaciones(Long idEvento) {
        return penalizacionRepository.findByGranPremioId(idEvento)
                .stream().map(this::toPenalizacionDTO).collect(Collectors.toList());
    }

    @Transactional
    public GranPremioDTO create(GranPremioDTO dto) {
        GranPremio gp = new GranPremio();
        gp.setNombreOficial(dto.getNombreOficial());
        gp.setNumRonda(dto.getNumRonda());
        gp.setFechaInicio(dto.getFechaInicio());
        gp.setFechaFin(dto.getFechaFin());
        gp.setEstado(dto.getEstado() != null ? dto.getEstado() : "PROGRAMADO");
        if (dto.getAnioTemporada() != null) {
            Temporada t = temporadaRepository.findByAnio(dto.getAnioTemporada())
                    .orElseThrow(() -> new ResourceNotFoundException("Temporada no encontrada: " + dto.getAnioTemporada()));
            gp.setTemporada(t);
        }
        if (dto.getIdVariante() != null) {
            VarianteCircuito variante = varianteCircuitoRepository.findById(dto.getIdVariante())
                    .orElseThrow(() -> new ResourceNotFoundException("Variante no encontrada: " + dto.getIdVariante()));
            gp.setVariante(variante);
        }
        return toDTO(granPremioRepository.save(gp));
    }

    @Transactional
    public GranPremioDTO update(Long id, GranPremioDTO dto) {
        GranPremio gp = granPremioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gran Premio no encontrado: " + id));
        if (dto.getNombreOficial() != null) gp.setNombreOficial(dto.getNombreOficial());
        if (dto.getEstado() != null) gp.setEstado(dto.getEstado());
        if (dto.getFechaInicio() != null) gp.setFechaInicio(dto.getFechaInicio());
        if (dto.getFechaFin() != null) gp.setFechaFin(dto.getFechaFin());
        if (dto.getNumRonda() != null) gp.setNumRonda(dto.getNumRonda());
        return toDTO(granPremioRepository.save(gp));
    }

    @Transactional
    public void delete(Long id) {
        GranPremio gp = granPremioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gran Premio no encontrado: " + id));
        granPremioRepository.delete(gp);
    }

    private GranPremioDTO toDTO(GranPremio gp) {
        String nombreCircuito = null;
        String paisCircuito = null;
        java.math.BigDecimal longitudKm = null;

        if (gp.getVariante() != null) {
            longitudKm = gp.getVariante().getLongitudKm();
            if (gp.getVariante().getCircuito() != null) {
                nombreCircuito = gp.getVariante().getCircuito().getNombreOficial();
                paisCircuito = gp.getVariante().getCircuito().getPais();
            }
        }

        GranPremioDTO dto = new GranPremioDTO(
                gp.getIdEvento(),
                gp.getNombreOficial(),
                gp.getNumRonda(),
                gp.getTemporada() != null ? gp.getTemporada().getAnio() : null,
                nombreCircuito,
                paisCircuito,
                gp.getFechaInicio(),
                gp.getFechaFin(),
                gp.getEstado(),
                longitudKm
        );
        if (gp.getVariante() != null) {
            dto.setIdVariante(gp.getVariante().getIdVariante());
        }
        return dto;
    }

    private ResultadoCarreraDTO toResultadoCarreraDTO(ResultadoCarrera r) {
        String nombrePiloto = "";
        String alias = "";
        if (r.getPiloto() != null && r.getPiloto().getPersona() != null) {
            nombrePiloto = r.getPiloto().getPersona().getNombre() + " " + r.getPiloto().getPersona().getApellidos();
            alias = r.getPiloto().getAlias();
        }

        String nombreEscuderia = null;
        if (r.getContrato() != null && r.getContrato().getEscuderia() != null) {
            nombreEscuderia = r.getContrato().getEscuderia().getNombreOficial();
        } else if (r.getPiloto() != null) {
            Optional<Contrato> contrato = contratoRepository.findByPilotoIdAndFechaFinIsNull(r.getPiloto().getId());
            nombreEscuderia = contrato.map(c -> c.getEscuderia() != null ? c.getEscuderia().getNombreOficial() : null).orElse(null);
        }

        return new ResultadoCarreraDTO(
                r.getIdResultado(),
                r.getPosicionFinal(),
                nombrePiloto,
                alias,
                nombreEscuderia,
                r.getTiempoTotal(),
                r.getVueltasCompletadas(),
                r.getEstadoFinalizacion(),
                r.getPuntos(),
                r.getVueltaRapida(),
                r.getPosSalida()
        );
    }

    private PenalizacionDTO toPenalizacionDTO(Penalizacion p) {
        String nombrePiloto = "";
        String alias = "";
        if (p.getResultadoCarrera() != null && p.getResultadoCarrera().getPiloto() != null) {
            var piloto = p.getResultadoCarrera().getPiloto();
            if (piloto.getPersona() != null) {
                nombrePiloto = piloto.getPersona().getNombre() + " " + piloto.getPersona().getApellidos();
            }
            alias = piloto.getAlias();
        }
        return new PenalizacionDTO(
                p.getIdPenalizacion(),
                nombrePiloto,
                alias,
                p.getTipo(),
                p.getMotivo(),
                p.getMagnitud(),
                p.getFechaResolucion()
        );
    }

    private ResultadoClasificacionDTO toResultadoClasificacionDTO(ResultadoClasificacion rc) {
        String nombrePiloto = "";
        String alias = "";
        if (rc.getPiloto() != null && rc.getPiloto().getPersona() != null) {
            nombrePiloto = rc.getPiloto().getPersona().getNombre() + " " + rc.getPiloto().getPersona().getApellidos();
            alias = rc.getPiloto().getAlias();
        }

        String nombreEscuderia = null;
        if (rc.getPiloto() != null) {
            Optional<Contrato> contrato = contratoRepository.findByPilotoIdAndFechaFinIsNull(rc.getPiloto().getId());
            nombreEscuderia = contrato.map(c -> c.getEscuderia() != null ? c.getEscuderia().getNombreOficial() : null).orElse(null);
        }

        return new ResultadoClasificacionDTO(
                rc.getPosicionParrilla(),
                nombrePiloto,
                alias,
                nombreEscuderia,
                rc.getTiempoQ1(),
                rc.getTiempoQ2(),
                rc.getTiempoQ3(),
                rc.getFaseEliminacion()
        );
    }
}
