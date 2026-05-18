package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "rol")
public class Rol {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol") private Long idRol;
    @Column(nullable = false, unique = true, length = 50) private String nombre;
    @Column(columnDefinition = "TEXT") private String descripcion;
}
