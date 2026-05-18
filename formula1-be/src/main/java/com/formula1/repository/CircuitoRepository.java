package com.formula1.repository;

import com.formula1.model.entity.Circuito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CircuitoRepository extends JpaRepository<Circuito, Long> {
    List<Circuito> findByEstado(String estado);

    @Query("SELECT DISTINCT v.circuito FROM VarianteCircuito v " +
           "WHERE EXISTS (SELECT g FROM GranPremio g WHERE g.variante = v AND g.temporada.anio = :anio)")
    List<Circuito> findByAnio(@Param("anio") int anio);
}
