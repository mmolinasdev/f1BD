package com.formula1.repository;

import com.formula1.model.entity.ResultadoClasificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResultadoClasificacionRepository extends JpaRepository<ResultadoClasificacion, Long> {
    List<ResultadoClasificacion> findBySesionIdSesionOrderByPosicionParrillaAsc(Long idSesion);
}
