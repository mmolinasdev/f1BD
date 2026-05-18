package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "regla_puntuacion")
public class ReglaPuntuacion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_regla") private Long idRegla;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_temporada") private Temporada temporada;
    @Column(name = "tipo_sesion", nullable = false, length = 20) private String tipoSesion;
    @Column(nullable = false) private Integer posicion;
    @Column(name = "puntos_asignados", nullable = false, precision = 5, scale = 1) private BigDecimal puntosAsignados;
}
