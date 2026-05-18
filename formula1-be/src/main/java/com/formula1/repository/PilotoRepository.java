package com.formula1.repository;

import com.formula1.model.entity.Piloto;
import com.formula1.model.entity.PersonaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PilotoRepository extends JpaRepository<Piloto, PersonaId> {
    List<Piloto> findByEstado(String estado);

    @Query("SELECT p FROM Piloto p WHERE " +
           "LOWER(p.persona.nombre) LIKE LOWER(CONCAT('%',:q,'%')) OR " +
           "LOWER(p.persona.apellidos) LIKE LOWER(CONCAT('%',:q,'%')) OR " +
           "LOWER(p.alias) LIKE LOWER(CONCAT('%',:q,'%'))")
    List<Piloto> searchByNombreOrAlias(@Param("q") String q);

    @Query("SELECT DISTINCT p FROM Piloto p WHERE p.estado = 'ACTIVO' AND EXISTS " +
           "(SELECT c FROM Contrato c WHERE c.piloto = p " +
           "AND YEAR(c.fechaInicio) <= :anio " +
           "AND (c.fechaFin IS NULL OR YEAR(c.fechaFin) >= :anio))")
    List<Piloto> findActivosByAnio(@Param("anio") int anio);
}
