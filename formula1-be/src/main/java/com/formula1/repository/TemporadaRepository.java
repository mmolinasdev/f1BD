package com.formula1.repository;

import com.formula1.model.entity.Temporada;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TemporadaRepository extends JpaRepository<Temporada, Long> {
    Optional<Temporada> findByAnio(Integer anio);
    List<Temporada> findAllByOrderByAnioDesc();
}
