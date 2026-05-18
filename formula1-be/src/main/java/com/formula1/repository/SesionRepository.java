package com.formula1.repository;

import com.formula1.model.entity.Sesion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SesionRepository extends JpaRepository<Sesion, Long> {
    List<Sesion> findByGranPremioIdEventoOrderByOrdenAsc(Long idEvento);
    List<Sesion> findByGranPremioIdEvento(Long idEvento);
    Optional<Sesion> findByGranPremioIdEventoAndTipoSesion(Long idEvento, String tipoSesion);
}
