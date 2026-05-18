package com.formula1.service;

import com.formula1.exception.ResourceNotFoundException;
import com.formula1.model.dto.PaginatedResponseDTO;
import com.formula1.model.dto.PilotoDTO;
import com.formula1.model.entity.Contrato;
import com.formula1.model.entity.Persona;
import com.formula1.model.entity.PersonaId;
import com.formula1.model.entity.Piloto;
import com.formula1.repository.ContratoRepository;
import com.formula1.repository.PersonaRepository;
import com.formula1.repository.PilotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PilotoService {

    @Autowired
    private PilotoRepository pilotoRepository;

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private ContratoRepository contratoRepository;

    public PaginatedResponseDTO<PilotoDTO> getAll(int page, int size, String search, Integer anio) {
        List<Piloto> all;
        if (search != null && !search.isBlank()) {
            all = pilotoRepository.searchByNombreOrAlias(search);
        } else if (anio != null) {
            List<Piloto> activos = pilotoRepository.findActivosByAnio(anio);
            List<Piloto> retirados = pilotoRepository.findByEstado("RETIRADO");
            all = new java.util.ArrayList<>(activos);
            all.addAll(retirados);
        } else {
            all = pilotoRepository.findAll();
        }

        long total = all.size();
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, all.size());
        List<Piloto> paged = (fromIndex >= all.size()) ? List.of() : all.subList(fromIndex, toIndex);

        List<PilotoDTO> dtos = paged.stream().map(this::toDTO).collect(Collectors.toList());
        return new PaginatedResponseDTO<>(dtos, total, page, size);
    }

    public List<PilotoDTO> getByEscuderia(Long escuderiaId, Integer anio) {
        List<Contrato> contratos = (anio != null)
                ? contratoRepository.findByEscuderiaAndAnio(escuderiaId, anio)
                : contratoRepository.findByEscuderiaIdEquipoAndFechaFinIsNull(escuderiaId);
        return contratos.stream()
                .map(c -> toDTO(c.getPiloto()))
                .collect(Collectors.toList());
    }

    public PilotoDTO getById(String tipoDoc, String numDoc) {
        PersonaId id = new PersonaId(tipoDoc, numDoc);
        Piloto piloto = pilotoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Piloto no encontrado: " + tipoDoc + "/" + numDoc));
        return toDTO(piloto);
    }

    @Transactional
    public PilotoDTO createPiloto(PilotoDTO dto) {
        PersonaId id = new PersonaId(dto.getTipoDocumento(), dto.getNumDocumento());
        Persona persona = new Persona();
        persona.setId(id);
        persona.setNombre(dto.getNombre());
        persona.setApellidos(dto.getApellidos());
        persona.setNacionalidad(dto.getNacionalidad());
        persona.setFechaNacimiento(dto.getFechaNacimiento());
        personaRepository.save(persona);

        Piloto piloto = new Piloto();
        piloto.setId(id);
        piloto.setPersona(persona);
        piloto.setAlias(dto.getAlias());
        piloto.setNumParrillaPermanente(dto.getNumParrillaPermanente());
        piloto.setUrlFoto(dto.getUrlFoto());
        piloto.setEstado(dto.getEstado() != null ? dto.getEstado() : "ACTIVO");
        piloto.setTemporadaRetiro(dto.getTemporadaRetiro());
        pilotoRepository.save(piloto);
        return toDTO(piloto);
    }

    @Transactional
    public PilotoDTO updatePiloto(String tipoDoc, String numDoc, PilotoDTO dto) {
        PersonaId id = new PersonaId(tipoDoc, numDoc);
        Piloto piloto = pilotoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Piloto no encontrado: " + tipoDoc + "/" + numDoc));

        Persona persona = piloto.getPersona();
        if (persona != null) {
            if (dto.getNombre() != null) persona.setNombre(dto.getNombre());
            if (dto.getApellidos() != null) persona.setApellidos(dto.getApellidos());
            if (dto.getNacionalidad() != null) persona.setNacionalidad(dto.getNacionalidad());
            if (dto.getFechaNacimiento() != null) persona.setFechaNacimiento(dto.getFechaNacimiento());
            personaRepository.save(persona);
        }

        if (dto.getAlias() != null) piloto.setAlias(dto.getAlias());
        if (dto.getNumParrillaPermanente() != null) piloto.setNumParrillaPermanente(dto.getNumParrillaPermanente());
        if (dto.getEstado() != null) piloto.setEstado(dto.getEstado());
        if (dto.getTemporadaRetiro() != null) piloto.setTemporadaRetiro(dto.getTemporadaRetiro());
        pilotoRepository.save(piloto);
        return toDTO(piloto);
    }

    @Transactional
    public void deletePiloto(String tipoDoc, String numDoc) {
        PersonaId id = new PersonaId(tipoDoc, numDoc);
        Piloto piloto = pilotoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Piloto no encontrado: " + tipoDoc + "/" + numDoc));
        pilotoRepository.delete(piloto);
        personaRepository.deleteById(id);
    }

    private PilotoDTO toDTO(Piloto p) {
        PilotoDTO dto = new PilotoDTO();
        dto.setTipoDocumento(p.getId().getTipoDocumento());
        dto.setNumDocumento(p.getId().getNumDocumento());
        if (p.getPersona() != null) {
            dto.setNombre(p.getPersona().getNombre());
            dto.setApellidos(p.getPersona().getApellidos());
            dto.setNacionalidad(p.getPersona().getNacionalidad());
            dto.setFechaNacimiento(p.getPersona().getFechaNacimiento());
        }
        dto.setAlias(p.getAlias());
        dto.setNumParrillaPermanente(p.getNumParrillaPermanente());
        dto.setUrlFoto(p.getUrlFoto());
        dto.setEstado(p.getEstado());
        dto.setTemporadaRetiro(p.getTemporadaRetiro());

        // Look up current contract (fechaFin IS NULL)
        Optional<Contrato> contrato = contratoRepository.findByPilotoIdAndFechaFinIsNull(p.getId());
        contrato.ifPresent(c -> {
            if (c.getEscuderia() != null) {
                dto.setEscuderiaActual(c.getEscuderia().getNombreOficial());
                dto.setEscuderiaId(c.getEscuderia().getIdEquipo());
            }
        });

        return dto;
    }
}
