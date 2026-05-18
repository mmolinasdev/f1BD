package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "temporada")
public class Temporada {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_temporada") private Long idTemporada;
    @Column(nullable = false, unique = true) private Integer anio;
    @Column(length = 15) private String estado = "PLANIFICADA";
    @Column(name = "num_gps") private Integer numGps;
    @Column(name = "fecha_inicio") private LocalDate fechaInicio;
    @Column(name = "fecha_fin") private LocalDate fechaFin;
}
