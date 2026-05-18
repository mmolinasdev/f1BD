package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "persona")
public class Persona {
    @EmbeddedId private PersonaId id;
    @Column(nullable = false, length = 100) private String nombre;
    @Column(nullable = false, length = 100) private String apellidos;
    @Column(name = "fecha_nacimiento") private LocalDate fechaNacimiento;
    @Column(length = 60) private String nacionalidad;
    @Column(name = "fecha_alta") private LocalDate fechaAlta;
    @Column(length = 20) private String estado = "ACTIVO";

    @PrePersist
    public void prePersist() {
        if (fechaAlta == null) fechaAlta = LocalDate.now();
    }
}
