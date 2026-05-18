package com.formula1.repository;

import com.formula1.model.entity.Contrato;
import com.formula1.model.entity.PersonaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ContratoRepository extends JpaRepository<Contrato, Long> {
    List<Contrato> findByPilotoId(PersonaId pilotoId);
    Optional<Contrato> findByPilotoIdAndFechaFinIsNull(PersonaId pilotoId);
    List<Contrato> findByEscuderiaIdEquipoAndFechaFinIsNull(Long idEquipo);

    @Query("SELECT c FROM Contrato c WHERE c.escuderia.idEquipo = :idEquipo " +
           "AND YEAR(c.fechaInicio) <= :anio " +
           "AND (c.fechaFin IS NULL OR YEAR(c.fechaFin) >= :anio)")
    List<Contrato> findByEscuderiaAndAnio(@Param("idEquipo") Long idEquipo, @Param("anio") int anio);

    @Query("SELECT c FROM Contrato c WHERE c.piloto.id = :pilotoId " +
           "AND YEAR(c.fechaInicio) <= :anio " +
           "AND (c.fechaFin IS NULL OR YEAR(c.fechaFin) >= :anio)")
    Optional<Contrato> findByPilotoIdAndAnio(@Param("pilotoId") PersonaId pilotoId, @Param("anio") int anio);

    @Query("SELECT COUNT(DISTINCT c.piloto.id) FROM Contrato c " +
           "WHERE YEAR(c.fechaInicio) <= :anio " +
           "AND (c.fechaFin IS NULL OR YEAR(c.fechaFin) >= :anio)")
    long countPilotosByAnio(@Param("anio") int anio);
}
