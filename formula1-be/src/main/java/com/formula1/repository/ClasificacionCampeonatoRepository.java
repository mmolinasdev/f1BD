package com.formula1.repository;

import com.formula1.model.entity.ClasificacionCampeonato;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClasificacionCampeonatoRepository extends JpaRepository<ClasificacionCampeonato, Long> {
    List<ClasificacionCampeonato> findByTemporadaAnioAndTipoOrderByPosicionAsc(Integer anio, String tipo);
}
