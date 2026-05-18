package com.formula1.repository;

import com.formula1.model.entity.PuntosResultado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PuntosResultadoRepository extends JpaRepository<PuntosResultado, Long> {
    List<PuntosResultado> findByResultadoCarreraIdResultado(Long idResultado);
}
