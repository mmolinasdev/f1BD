package com.formula1.service;

import com.formula1.exception.ResourceNotFoundException;
import com.formula1.model.dto.ResultadoClasificacionAdminDTO;
import com.formula1.model.entity.PersonaId;
import com.formula1.model.entity.Piloto;
import com.formula1.model.entity.ResultadoClasificacion;
import com.formula1.model.entity.Sesion;
import com.formula1.repository.PilotoRepository;
import com.formula1.repository.ResultadoClasificacionRepository;
import com.formula1.repository.SesionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResultadoClasificacionService {

    @Autowired
    private ResultadoClasificacionRepository resultadoClasificacionRepository;

    @Autowired
    private SesionRepository sesionRepository;

    @Autowired
    private PilotoRepository pilotoRepository;

    public List<ResultadoClasificacionAdminDTO> getBySesion(Long idSesion) {
        return resultadoClasificacionRepository.findBySesionIdSesionOrderByPosicionParrillaAsc(idSesion)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ResultadoClasificacionAdminDTO create(ResultadoClasificacionAdminDTO dto) {
        Sesion sesion = sesionRepository.findById(dto.getIdSesion())
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada: " + dto.getIdSesion()));

        PersonaId pilotoId = new PersonaId(dto.getTipoDocumento(), dto.getNumDocumento());
        Piloto piloto = pilotoRepository.findById(pilotoId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Piloto no encontrado: " + dto.getTipoDocumento() + "/" + dto.getNumDocumento()));

        ResultadoClasificacion rc = new ResultadoClasificacion();
        rc.setSesion(sesion);
        rc.setPiloto(piloto);
        rc.setPosicionParrilla(dto.getPosicionParrilla());
        rc.setTiempoQ1(dto.getTiempoQ1());
        rc.setTiempoQ2(dto.getTiempoQ2());
        rc.setTiempoQ3(dto.getTiempoQ3());
        rc.setFaseEliminacion(dto.getFaseEliminacion());

        return toDTO(resultadoClasificacionRepository.save(rc));
    }

    @Transactional
    public ResultadoClasificacionAdminDTO update(Long id, ResultadoClasificacionAdminDTO dto) {
        ResultadoClasificacion rc = resultadoClasificacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resultado de clasificación no encontrado: " + id));

        if (dto.getPosicionParrilla() != null) rc.setPosicionParrilla(dto.getPosicionParrilla());
        if (dto.getTiempoQ1() != null) rc.setTiempoQ1(dto.getTiempoQ1());
        if (dto.getTiempoQ2() != null) rc.setTiempoQ2(dto.getTiempoQ2());
        if (dto.getTiempoQ3() != null) rc.setTiempoQ3(dto.getTiempoQ3());
        if (dto.getFaseEliminacion() != null) rc.setFaseEliminacion(dto.getFaseEliminacion());

        return toDTO(resultadoClasificacionRepository.save(rc));
    }

    @Transactional
    public void delete(Long id) {
        ResultadoClasificacion rc = resultadoClasificacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resultado de clasificación no encontrado: " + id));
        resultadoClasificacionRepository.delete(rc);
    }

    private ResultadoClasificacionAdminDTO toDTO(ResultadoClasificacion rc) {
        String tipoDoc = null;
        String numDoc = null;
        String nombrePiloto = null;
        String alias = null;
        if (rc.getPiloto() != null) {
            if (rc.getPiloto().getId() != null) {
                tipoDoc = rc.getPiloto().getId().getTipoDocumento();
                numDoc = rc.getPiloto().getId().getNumDocumento();
            }
            alias = rc.getPiloto().getAlias();
            if (rc.getPiloto().getPersona() != null) {
                nombrePiloto = rc.getPiloto().getPersona().getNombre()
                        + " " + rc.getPiloto().getPersona().getApellidos();
            }
        }
        Long idSesion = rc.getSesion() != null ? rc.getSesion().getIdSesion() : null;
        return new ResultadoClasificacionAdminDTO(
                rc.getIdResultadoClas(),
                idSesion,
                tipoDoc,
                numDoc,
                nombrePiloto,
                alias,
                rc.getPosicionParrilla(),
                rc.getTiempoQ1(),
                rc.getTiempoQ2(),
                rc.getTiempoQ3(),
                rc.getFaseEliminacion()
        );
    }
}
