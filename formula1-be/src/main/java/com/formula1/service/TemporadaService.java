package com.formula1.service;

import com.formula1.exception.ResourceNotFoundException;
import com.formula1.model.dto.ClasificacionDTO;
import com.formula1.model.dto.TemporadaDTO;
import com.formula1.model.entity.ClasificacionCampeonato;
import com.formula1.model.entity.Temporada;
import com.formula1.repository.ClasificacionCampeonatoRepository;
import com.formula1.repository.TemporadaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TemporadaService {

    @Autowired
    private TemporadaRepository temporadaRepository;

    @Autowired
    private ClasificacionCampeonatoRepository clasificacionCampeonatoRepository;

    public List<TemporadaDTO> getAll() {
        return temporadaRepository.findAllByOrderByAnioDesc()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public TemporadaDTO getByAnio(Integer anio) {
        Temporada t = temporadaRepository.findByAnio(anio)
                .orElseThrow(() -> new ResourceNotFoundException("Temporada no encontrada: " + anio));
        return toDTO(t);
    }

    public List<ClasificacionDTO> getClasificacionPilotos(Integer anio) {
        return clasificacionCampeonatoRepository
                .findByTemporadaAnioAndTipoOrderByPosicionAsc(anio, "PILOTOS")
                .stream().map(this::toClasificacionDTO).collect(Collectors.toList());
    }

    public List<ClasificacionDTO> getClasificacionConstructores(Integer anio) {
        return clasificacionCampeonatoRepository
                .findByTemporadaAnioAndTipoOrderByPosicionAsc(anio, "CONSTRUCTORES")
                .stream().map(this::toClasificacionDTO).collect(Collectors.toList());
    }

    @Transactional
    public TemporadaDTO create(TemporadaDTO dto) {
        Temporada t = new Temporada();
        t.setAnio(dto.getAnio());
        t.setEstado(dto.getEstado() != null ? dto.getEstado() : "PLANIFICADA");
        t.setNumGps(dto.getNumGps());
        t.setFechaInicio(dto.getFechaInicio());
        t.setFechaFin(dto.getFechaFin());
        return toDTO(temporadaRepository.save(t));
    }

    @Transactional
    public TemporadaDTO update(Integer anio, TemporadaDTO dto) {
        Temporada t = temporadaRepository.findByAnio(anio)
                .orElseThrow(() -> new ResourceNotFoundException("Temporada no encontrada: " + anio));
        if (dto.getEstado() != null) t.setEstado(dto.getEstado());
        if (dto.getNumGps() != null) t.setNumGps(dto.getNumGps());
        if (dto.getFechaInicio() != null) t.setFechaInicio(dto.getFechaInicio());
        if (dto.getFechaFin() != null) t.setFechaFin(dto.getFechaFin());
        return toDTO(temporadaRepository.save(t));
    }

    @Transactional
    public void delete(Integer anio) {
        Temporada t = temporadaRepository.findByAnio(anio)
                .orElseThrow(() -> new ResourceNotFoundException("Temporada no encontrada: " + anio));
        temporadaRepository.delete(t);
    }

    private TemporadaDTO toDTO(Temporada t) {
        return new TemporadaDTO(
                t.getIdTemporada(),
                t.getAnio(),
                t.getEstado(),
                t.getNumGps(),
                t.getFechaInicio(),
                t.getFechaFin()
        );
    }

    private ClasificacionDTO toClasificacionDTO(ClasificacionCampeonato c) {
        String nombre = "";
        String aliasOCodigo = "";
        String escuderia = null;

        if (c.getPiloto() != null) {
            if (c.getPiloto().getPersona() != null) {
                nombre = c.getPiloto().getPersona().getNombre() + " " + c.getPiloto().getPersona().getApellidos();
            }
            aliasOCodigo = c.getPiloto().getAlias();
            if (c.getEscuderia() != null) {
                escuderia = c.getEscuderia().getNombreOficial();
            }
        } else if (c.getEscuderia() != null) {
            nombre = c.getEscuderia().getNombreOficial();
            aliasOCodigo = c.getEscuderia().getCodigo();
        }

        return new ClasificacionDTO(
                c.getPosicion(),
                nombre,
                aliasOCodigo,
                escuderia,
                c.getPuntosTotales(),
                c.getVictorias(),
                c.getPodios(),
                c.getPoles()
        );
    }
}
