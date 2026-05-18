package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "circuito")
public class Circuito {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_circuito") private Long idCircuito;
    @Column(name = "nombre_oficial", nullable = false, length = 150) private String nombreOficial;
    @Column(columnDefinition = "TEXT") private String descripcion;
    @Column(length = 60) private String pais;
    @Column(length = 60) private String ciudad;
    @Column(length = 20) private String estado = "ACTIVO";
}
