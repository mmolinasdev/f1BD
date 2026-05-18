package com.formula1.service;

import com.formula1.exception.ResourceNotFoundException;
import com.formula1.model.dto.CircuitoDTO;
import com.formula1.model.dto.PaginatedResponseDTO;
import com.formula1.model.entity.Circuito;
import com.formula1.model.entity.VarianteCircuito;
import com.formula1.repository.CircuitoRepository;
import com.formula1.repository.VarianteCircuitoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CircuitoService {

    @Autowired private CircuitoRepository circuitoRepository;
    @Autowired private VarianteCircuitoRepository varianteCircuitoRepository;

    public PaginatedResponseDTO<CircuitoDTO> getAll(int page, int size, Integer anio) {
        List<Circuito> all = (anio != null)
                ? circuitoRepository.findByAnio(anio)
                : circuitoRepository.findAll();
        long total = all.size();
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, all.size());
        List<Circuito> paged = (fromIndex >= all.size()) ? List.of() : all.subList(fromIndex, toIndex);

        List<CircuitoDTO> dtos = paged.stream()
                .map(c -> toDTO(c, getLatestVariante(c.getIdCircuito())))
                .collect(Collectors.toList());
        return new PaginatedResponseDTO<>(dtos, total, page, size);
    }

    public CircuitoDTO getById(Long id) {
        Circuito c = circuitoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Circuito no encontrado: " + id));
        return toDTO(c, getLatestVariante(id));
    }

    @Transactional
    public CircuitoDTO create(CircuitoDTO dto) {
        Circuito c = new Circuito();
        c.setNombreOficial(dto.getNombreOficial());
        c.setDescripcion(dto.getDescripcion());
        c.setPais(dto.getPais());
        c.setCiudad(dto.getCiudad());
        c.setEstado(dto.getEstado() != null ? dto.getEstado() : "ACTIVO");
        return toDTO(circuitoRepository.save(c), Optional.empty());
    }

    @Transactional
    public CircuitoDTO update(Long id, CircuitoDTO dto) {
        Circuito c = circuitoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Circuito no encontrado: " + id));
        if (dto.getNombreOficial() != null) c.setNombreOficial(dto.getNombreOficial());
        if (dto.getDescripcion() != null) c.setDescripcion(dto.getDescripcion());
        if (dto.getPais() != null) c.setPais(dto.getPais());
        if (dto.getCiudad() != null) c.setCiudad(dto.getCiudad());
        if (dto.getEstado() != null) c.setEstado(dto.getEstado());
        return toDTO(circuitoRepository.save(c), getLatestVariante(c.getIdCircuito()));
    }

    @Transactional
    public void delete(Long id) {
        Circuito c = circuitoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Circuito no encontrado: " + id));
        circuitoRepository.delete(c);
    }

    private Optional<VarianteCircuito> getLatestVariante(Long idCircuito) {
        List<VarianteCircuito> variantes = varianteCircuitoRepository.findByCircuitoIdCircuito(idCircuito);
        return variantes.stream().max(Comparator.comparingInt(VarianteCircuito::getAnioDesde));
    }

    private CircuitoDTO toDTO(Circuito c, Optional<VarianteCircuito> variante) {
        CircuitoDTO dto = new CircuitoDTO();
        dto.setIdCircuito(c.getIdCircuito());
        dto.setNombreOficial(c.getNombreOficial());
        dto.setDescripcion(c.getDescripcion());
        dto.setEstado(c.getEstado());
        dto.setPais(c.getPais());
        dto.setCiudad(c.getCiudad());
        variante.ifPresent(v -> {
            dto.setLongitudKm(v.getLongitudKm());
            dto.setNumCurvas(v.getNumCurvas());
            dto.setSentido(v.getSentido());
            dto.setTipoCircuito(v.getTipoCircuito());
        });
        return dto;
    }
}
