package com.formula1.service;

import com.formula1.exception.ResourceNotFoundException;
import com.formula1.model.dto.EscuderiaDTO;
import com.formula1.model.dto.PaginatedResponseDTO;
import com.formula1.model.entity.Escuderia;
import com.formula1.repository.EscuderiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EscuderiaService {

    @Autowired private EscuderiaRepository escuderiaRepository;

    public PaginatedResponseDTO<EscuderiaDTO> getAll(int page, int size, Integer anio) {
        List<Escuderia> all = (anio != null)
                ? escuderiaRepository.findByAnio(anio)
                : escuderiaRepository.findAll();
        long total = all.size();
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, all.size());
        List<Escuderia> paged = (fromIndex >= all.size()) ? List.of() : all.subList(fromIndex, toIndex);

        List<EscuderiaDTO> dtos = paged.stream().map(this::toDTO).collect(Collectors.toList());
        return new PaginatedResponseDTO<>(dtos, total, page, size);
    }

    public EscuderiaDTO getById(Long id) {
        return toDTO(escuderiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Escuderia no encontrada: " + id)));
    }

    @Transactional
    public EscuderiaDTO create(EscuderiaDTO dto) {
        Escuderia e = new Escuderia();
        e.setNombreOficial(dto.getNombreOficial());
        e.setCodigo(dto.getCodigo());
        e.setNacionalidad(dto.getNacionalidad());
        e.setEstado(dto.getEstado() != null ? dto.getEstado() : "ACTIVO");
        e.setPaisSede(dto.getPaisSede());
        e.setCiudadSede(dto.getCiudadSede());
        e.setUrlFoto(dto.getUrlFoto());
        return toDTO(escuderiaRepository.save(e));
    }

    @Transactional
    public EscuderiaDTO update(Long id, EscuderiaDTO dto) {
        Escuderia e = escuderiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Escuderia no encontrada: " + id));
        if (dto.getNombreOficial() != null) e.setNombreOficial(dto.getNombreOficial());
        if (dto.getCodigo() != null) e.setCodigo(dto.getCodigo());
        if (dto.getNacionalidad() != null) e.setNacionalidad(dto.getNacionalidad());
        if (dto.getEstado() != null) e.setEstado(dto.getEstado());
        if (dto.getPaisSede() != null) e.setPaisSede(dto.getPaisSede());
        if (dto.getCiudadSede() != null) e.setCiudadSede(dto.getCiudadSede());
        return toDTO(escuderiaRepository.save(e));
    }

    @Transactional
    public void delete(Long id) {
        Escuderia e = escuderiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Escuderia no encontrada: " + id));
        escuderiaRepository.delete(e);
    }

    private EscuderiaDTO toDTO(Escuderia e) {
        EscuderiaDTO dto = new EscuderiaDTO();
        dto.setIdEquipo(e.getIdEquipo());
        dto.setNombreOficial(e.getNombreOficial());
        dto.setCodigo(e.getCodigo());
        dto.setNacionalidad(e.getNacionalidad());
        dto.setEstado(e.getEstado());
        dto.setPaisSede(e.getPaisSede());
        dto.setCiudadSede(e.getCiudadSede());
        dto.setUrlFoto(e.getUrlFoto());
        return dto;
    }
}
