package com.formula1.service;

import com.formula1.exception.ResourceNotFoundException;
import com.formula1.model.dto.ResultadoCarreraAdminDTO;
import com.formula1.model.entity.Contrato;
import com.formula1.model.entity.PersonaId;
import com.formula1.model.entity.Piloto;
import com.formula1.model.entity.ResultadoCarrera;
import com.formula1.model.entity.Sesion;
import com.formula1.repository.ContratoRepository;
import com.formula1.repository.PilotoRepository;
import com.formula1.repository.ResultadoCarreraRepository;
import com.formula1.repository.SesionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResultadoCarreraService {

    @Autowired
    private ResultadoCarreraRepository resultadoCarreraRepository;

    @Autowired
    private SesionRepository sesionRepository;

    @Autowired
    private PilotoRepository pilotoRepository;

    @Autowired
    private ContratoRepository contratoRepository;

    public List<ResultadoCarreraAdminDTO> getBySesion(Long idSesion) {
        return resultadoCarreraRepository.findBySesionIdSesionOrderByPosicionFinalAsc(idSesion)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ResultadoCarreraAdminDTO create(ResultadoCarreraAdminDTO dto) {
        Sesion sesion = sesionRepository.findById(dto.getIdSesion())
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada: " + dto.getIdSesion()));

        PersonaId pilotoId = new PersonaId(dto.getTipoDocumento(), dto.getNumDocumento());
        Piloto piloto = pilotoRepository.findById(pilotoId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Piloto no encontrado: " + dto.getTipoDocumento() + "/" + dto.getNumDocumento()));

        Contrato contrato = contratoRepository.findByPilotoIdAndFechaFinIsNull(pilotoId)
                .orElse(null);

        ResultadoCarrera r = new ResultadoCarrera();
        r.setSesion(sesion);
        r.setPiloto(piloto);
        r.setContrato(contrato);
        r.setPosicionFinal(dto.getPosicionFinal());
        r.setTiempoTotal(dto.getTiempoTotal());
        r.setVueltasCompletadas(dto.getVueltasCompletadas());
        r.setEstadoFinalizacion(dto.getEstadoFinalizacion() != null ? dto.getEstadoFinalizacion() : "FINALIZADO");
        r.setPuntos(dto.getPuntos() != null ? dto.getPuntos() : java.math.BigDecimal.ZERO);
        r.setVueltaRapida(dto.getVueltaRapida() != null ? dto.getVueltaRapida() : false);
        r.setPosSalida(dto.getPosSalida());
        r.setNumParadasBoxes(dto.getNumParadasBoxes());
        r.setVueltasLideradas(dto.getVueltasLideradas());

        return toDTO(resultadoCarreraRepository.save(r));
    }

    @Transactional
    public ResultadoCarreraAdminDTO update(Long id, ResultadoCarreraAdminDTO dto) {
        ResultadoCarrera r = resultadoCarreraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resultado de carrera no encontrado: " + id));

        if (dto.getPosicionFinal() != null) r.setPosicionFinal(dto.getPosicionFinal());
        if (dto.getTiempoTotal() != null) r.setTiempoTotal(dto.getTiempoTotal());
        if (dto.getVueltasCompletadas() != null) r.setVueltasCompletadas(dto.getVueltasCompletadas());
        if (dto.getEstadoFinalizacion() != null) r.setEstadoFinalizacion(dto.getEstadoFinalizacion());
        if (dto.getPuntos() != null) r.setPuntos(dto.getPuntos());
        if (dto.getVueltaRapida() != null) r.setVueltaRapida(dto.getVueltaRapida());
        if (dto.getPosSalida() != null) r.setPosSalida(dto.getPosSalida());
        if (dto.getNumParadasBoxes() != null) r.setNumParadasBoxes(dto.getNumParadasBoxes());
        if (dto.getVueltasLideradas() != null) r.setVueltasLideradas(dto.getVueltasLideradas());

        return toDTO(resultadoCarreraRepository.save(r));
    }

    @Transactional
    public void delete(Long id) {
        ResultadoCarrera r = resultadoCarreraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resultado de carrera no encontrado: " + id));
        resultadoCarreraRepository.delete(r);
    }

    private ResultadoCarreraAdminDTO toDTO(ResultadoCarrera r) {
        String tipoDoc = null;
        String numDoc = null;
        String nombrePiloto = null;
        String alias = null;
        if (r.getPiloto() != null) {
            if (r.getPiloto().getId() != null) {
                tipoDoc = r.getPiloto().getId().getTipoDocumento();
                numDoc = r.getPiloto().getId().getNumDocumento();
            }
            alias = r.getPiloto().getAlias();
            if (r.getPiloto().getPersona() != null) {
                nombrePiloto = r.getPiloto().getPersona().getNombre()
                        + " " + r.getPiloto().getPersona().getApellidos();
            }
        }
        Long idSesion = r.getSesion() != null ? r.getSesion().getIdSesion() : null;
        return new ResultadoCarreraAdminDTO(
                r.getIdResultado(),
                idSesion,
                tipoDoc,
                numDoc,
                nombrePiloto,
                alias,
                r.getPosicionFinal(),
                r.getTiempoTotal(),
                r.getVueltasCompletadas(),
                r.getEstadoFinalizacion(),
                r.getPuntos(),
                r.getVueltaRapida(),
                r.getPosSalida(),
                r.getNumParadasBoxes(),
                r.getVueltasLideradas()
        );
    }
}
