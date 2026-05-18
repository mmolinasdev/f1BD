package com.formula1.service;

import com.formula1.exception.ResourceNotFoundException;
import com.formula1.model.dto.SesionDTO;
import com.formula1.model.entity.GranPremio;
import com.formula1.model.entity.Sesion;
import com.formula1.repository.GranPremioRepository;
import com.formula1.repository.SesionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SesionService {

    @Autowired
    private SesionRepository sesionRepository;

    @Autowired
    private GranPremioRepository granPremioRepository;

    public List<SesionDTO> getAll() {
        return sesionRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<SesionDTO> getByGranPremio(Long idEvento) {
        return sesionRepository.findByGranPremioIdEvento(idEvento)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public SesionDTO getById(Long id) {
        Sesion sesion = sesionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada: " + id));
        return toDTO(sesion);
    }

    @Transactional
    public SesionDTO create(SesionDTO dto) {
        GranPremio gp = granPremioRepository.findById(dto.getIdEvento())
                .orElseThrow(() -> new ResourceNotFoundException("Gran Premio no encontrado: " + dto.getIdEvento()));
        Sesion sesion = new Sesion();
        sesion.setGranPremio(gp);
        sesion.setTipoSesion(dto.getTipoSesion());
        sesion.setOrden(dto.getOrden());
        if (dto.getFechaProgramada() != null && !dto.getFechaProgramada().isBlank()) {
            sesion.setFechaProgramada(LocalDate.parse(dto.getFechaProgramada()));
        }
        sesion.setEstado(dto.getEstado() != null ? dto.getEstado() : "PROGRAMADA");
        sesion.setCondicionPista(dto.getCondicionPista());
        sesion.setNumVueltas(dto.getNumVueltas());
        return toDTO(sesionRepository.save(sesion));
    }

    @Transactional
    public SesionDTO update(Long id, SesionDTO dto) {
        Sesion sesion = sesionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada: " + id));
        if (dto.getTipoSesion() != null) sesion.setTipoSesion(dto.getTipoSesion());
        if (dto.getOrden() != null) sesion.setOrden(dto.getOrden());
        if (dto.getFechaProgramada() != null && !dto.getFechaProgramada().isBlank()) {
            sesion.setFechaProgramada(LocalDate.parse(dto.getFechaProgramada()));
        }
        if (dto.getEstado() != null) sesion.setEstado(dto.getEstado());
        if (dto.getCondicionPista() != null) sesion.setCondicionPista(dto.getCondicionPista());
        if (dto.getNumVueltas() != null) sesion.setNumVueltas(dto.getNumVueltas());
        return toDTO(sesionRepository.save(sesion));
    }

    @Transactional
    public void delete(Long id) {
        Sesion sesion = sesionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada: " + id));
        sesionRepository.delete(sesion);
    }

    private SesionDTO toDTO(Sesion s) {
        String nombreGP = s.getGranPremio() != null ? s.getGranPremio().getNombreOficial() : null;
        Long idEvento = s.getGranPremio() != null ? s.getGranPremio().getIdEvento() : null;
        String fechaProgramada = s.getFechaProgramada() != null ? s.getFechaProgramada().toString() : null;
        return new SesionDTO(
                s.getIdSesion(),
                idEvento,
                nombreGP,
                s.getTipoSesion(),
                s.getOrden(),
                fechaProgramada,
                s.getEstado(),
                s.getCondicionPista(),
                s.getNumVueltas()
        );
    }
}
