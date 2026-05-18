package com.formula1.repository;

import com.formula1.model.entity.GranPremio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GranPremioRepository extends JpaRepository<GranPremio, Long> {
    List<GranPremio> findByTemporadaAnioOrderByNumRondaAsc(Integer anio);
}
