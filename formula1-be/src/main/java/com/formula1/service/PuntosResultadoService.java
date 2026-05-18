package com.formula1.service;

import com.formula1.exception.ResourceNotFoundException;
import com.formula1.model.dto.PuntosResultadoAdminDTO;
import com.formula1.model.entity.PuntosResultado;
import com.formula1.model.entity.ReglaPuntuacion;
import com.formula1.model.entity.ResultadoCarrera;
import com.formula1.repository.PuntosResultadoRepository;
import com.formula1.repository.ReglaPuntuacionRepository;
import com.formula1.repository.ResultadoCarreraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PuntosResultadoService {

    @Autowired private PuntosResultadoRepository puntosResultadoRepository;
    @Autowired private ResultadoCarreraRepository resultadoCarreraRepository;
    @Autowired private ReglaPuntuacionRepository reglaPuntuacionRepository;

    public List<PuntosResultadoAdminDTO> getAll() {
        return puntosResultadoRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<PuntosResultadoAdminDTO> getByResultado(Long idResultado) {
        return puntosResultadoRepository.findByResultadoCarreraIdResultado(idResultado)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public PuntosResultadoAdminDTO create(PuntosResultadoAdminDTO dto) {
        ResultadoCarrera rc = resultadoCarreraRepository.findById(dto.getIdResultado())
                .orElseThrow(() -> new ResourceNotFoundException("Resultado de carrera no encontrado: " + dto.getIdResultado()));
        ReglaPuntuacion rp = reglaPuntuacionRepository.findById(dto.getIdRegla())
                .orElseThrow(() -> new ResourceNotFoundException("Regla de puntuación no encontrada: " + dto.getIdRegla()));

        PuntosResultado pr = new PuntosResultado();
        pr.setResultadoCarrera(rc);
        pr.setReglaPuntuacion(rp);
        pr.setPuntos(dto.getPuntos());
        return toDTO(puntosResultadoRepository.save(pr));
    }

    @Transactional
    public PuntosResultadoAdminDTO update(Long id, PuntosResultadoAdminDTO dto) {
        PuntosResultado pr = puntosResultadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Puntos resultado no encontrado: " + id));
        if (dto.getIdRegla() != null) {
            ReglaPuntuacion rp = reglaPuntuacionRepository.findById(dto.getIdRegla())
                    .orElseThrow(() -> new ResourceNotFoundException("Regla de puntuación no encontrada: " + dto.getIdRegla()));
            pr.setReglaPuntuacion(rp);
        }
        if (dto.getPuntos() != null) pr.setPuntos(dto.getPuntos());
        return toDTO(puntosResultadoRepository.save(pr));
    }

    @Transactional
    public void delete(Long id) {
        PuntosResultado pr = puntosResultadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Puntos resultado no encontrado: " + id));
        puntosResultadoRepository.delete(pr);
    }

    private PuntosResultadoAdminDTO toDTO(PuntosResultado pr) {
        String nombrePiloto = null;
        String alias = null;
        if (pr.getResultadoCarrera() != null && pr.getResultadoCarrera().getPiloto() != null) {
            alias = pr.getResultadoCarrera().getPiloto().getAlias();
            if (pr.getResultadoCarrera().getPiloto().getPersona() != null) {
                nombrePiloto = pr.getResultadoCarrera().getPiloto().getPersona().getNombre()
                        + " " + pr.getResultadoCarrera().getPiloto().getPersona().getApellidos();
            }
        }
        String tipoSesion = null;
        Integer posicion = null;
        if (pr.getReglaPuntuacion() != null) {
            tipoSesion = pr.getReglaPuntuacion().getTipoSesion();
            posicion = pr.getReglaPuntuacion().getPosicion();
        }
        return new PuntosResultadoAdminDTO(
                pr.getIdPuntos(),
                pr.getResultadoCarrera() != null ? pr.getResultadoCarrera().getIdResultado() : null,
                pr.getReglaPuntuacion() != null ? pr.getReglaPuntuacion().getIdRegla() : null,
                pr.getPuntos(),
                nombrePiloto,
                alias,
                tipoSesion,
                posicion
        );
    }
}
