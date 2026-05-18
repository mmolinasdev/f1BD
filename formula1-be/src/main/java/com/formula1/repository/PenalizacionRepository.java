package com.formula1.repository;

import com.formula1.model.entity.Penalizacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PenalizacionRepository extends JpaRepository<Penalizacion, Long> {

    @Query("SELECT p FROM Penalizacion p WHERE p.resultadoCarrera.sesion.granPremio.idEvento = :idEvento ORDER BY p.idPenalizacion ASC")
    List<Penalizacion> findByGranPremioId(@Param("idEvento") Long idEvento);
}
