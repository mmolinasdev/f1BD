package com.formula1.repository;

import com.formula1.model.entity.VarianteCircuito;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VarianteCircuitoRepository extends JpaRepository<VarianteCircuito, Long> {
    List<VarianteCircuito> findByCircuitoIdCircuito(Long idCircuito);
}
