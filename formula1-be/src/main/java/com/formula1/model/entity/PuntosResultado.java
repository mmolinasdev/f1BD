package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "puntos_resultado")
public class PuntosResultado {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_puntos") private Long idPuntos;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_resultado", nullable = false) private ResultadoCarrera resultadoCarrera;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_regla", nullable = false) private ReglaPuntuacion reglaPuntuacion;
    @Column(nullable = false, precision = 4, scale = 1) private BigDecimal puntos;
}
