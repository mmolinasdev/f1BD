package com.formula1.service;

import com.formula1.exception.ResourceNotFoundException;
import com.formula1.model.dto.ContratoDTO;
import com.formula1.model.entity.Contrato;
import com.formula1.model.entity.Escuderia;
import com.formula1.model.entity.PersonaId;
import com.formula1.model.entity.Piloto;
import com.formula1.repository.ContratoRepository;
import com.formula1.repository.EscuderiaRepository;
import com.formula1.repository.PilotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContratoService {

    @Autowired
    private ContratoRepository contratoRepository;

    @Autowired
    private PilotoRepository pilotoRepository;

    @Autowired
    private EscuderiaRepository escuderiaRepository;

    public List<ContratoDTO> getAll() {
        return contratoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public long countPilotosByAnio(int anio) {
        return contratoRepository.countPilotosByAnio(anio);
    }

    @Transactional
    public ContratoDTO create(ContratoDTO dto) {
        PersonaId pk = new PersonaId(dto.getTipoDocumento(), dto.getNumDocumento());
        Piloto piloto = pilotoRepository.findById(pk)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Piloto no encontrado: " + dto.getTipoDocumento() + "/" + dto.getNumDocumento()));
        Escuderia escuderia = escuderiaRepository.findById(dto.getIdEquipo())
                .orElseThrow(() -> new ResourceNotFoundException("Escuderia no encontrada: " + dto.getIdEquipo()));

        Contrato c = new Contrato();
        c.setPiloto(piloto);
        c.setEscuderia(escuderia);
        c.setFechaInicio(dto.getFechaInicio());
        c.setFechaFin(dto.getFechaFin());
        return toDTO(contratoRepository.save(c));
    }

    @Transactional
    public ContratoDTO update(Long id, ContratoDTO dto) {
        Contrato c = contratoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contrato no encontrado: " + id));
        if (dto.getFechaInicio() != null) c.setFechaInicio(dto.getFechaInicio());
        c.setFechaFin(dto.getFechaFin());
        if (dto.getIdEquipo() != null) {
            Escuderia escuderia = escuderiaRepository.findById(dto.getIdEquipo())
                    .orElseThrow(() -> new ResourceNotFoundException("Escuderia no encontrada: " + dto.getIdEquipo()));
            c.setEscuderia(escuderia);
        }
        return toDTO(contratoRepository.save(c));
    }

    @Transactional
    public void delete(Long id) {
        Contrato c = contratoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contrato no encontrado: " + id));
        contratoRepository.delete(c);
    }

    private ContratoDTO toDTO(Contrato c) {
        ContratoDTO dto = new ContratoDTO();
        dto.setIdContrato(c.getIdContrato());
        dto.setTipoDocumento(c.getPiloto().getId().getTipoDocumento());
        dto.setNumDocumento(c.getPiloto().getId().getNumDocumento());
        dto.setAlias(c.getPiloto().getAlias());
        if (c.getPiloto().getPersona() != null) {
            dto.setNombrePiloto(c.getPiloto().getPersona().getNombre() + " " + c.getPiloto().getPersona().getApellidos());
        }
        dto.setIdEquipo(c.getEscuderia().getIdEquipo());
        dto.setNombreEscuderia(c.getEscuderia().getNombreOficial());
        dto.setFechaInicio(c.getFechaInicio());
        dto.setFechaFin(c.getFechaFin());
        return dto;
    }
}
