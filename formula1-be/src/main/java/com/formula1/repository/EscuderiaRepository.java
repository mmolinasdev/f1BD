package com.formula1.repository;

import com.formula1.model.entity.Escuderia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface EscuderiaRepository extends JpaRepository<Escuderia, Long> {
    List<Escuderia> findByEstado(String estado);
    Optional<Escuderia> findByCodigo(String codigo);

    @Query("SELECT DISTINCT e FROM Escuderia e WHERE EXISTS " +
           "(SELECT c FROM Contrato c WHERE c.escuderia = e " +
           "AND YEAR(c.fechaInicio) <= :anio " +
           "AND (c.fechaFin IS NULL OR YEAR(c.fechaFin) >= :anio))")
    List<Escuderia> findByAnio(@Param("anio") int anio);
}
