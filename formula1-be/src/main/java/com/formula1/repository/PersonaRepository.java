package com.formula1.repository;

import com.formula1.model.entity.Persona;
import com.formula1.model.entity.PersonaId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonaRepository extends JpaRepository<Persona, PersonaId> {
}
