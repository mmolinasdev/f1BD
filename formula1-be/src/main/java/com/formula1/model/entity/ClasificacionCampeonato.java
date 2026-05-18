package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "clasificacion_campeonato")
public class ClasificacionCampeonato {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_clasificacion") private Long idClasificacion;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_temporada") private Temporada temporada;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
        @JoinColumn(name = "tipo_documento", referencedColumnName = "tipo_documento"),
        @JoinColumn(name = "num_documento", referencedColumnName = "num_documento")
    }) private Piloto piloto;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_equipo") private Escuderia escuderia;
    @Column(nullable = false, length = 15) private String tipo;
    @Column(nullable = false) private Integer codigo = 0;
    @Column(nullable = false) private Integer posicion;
    @Column(name = "puntos_totales", precision = 6, scale = 1) private BigDecimal puntosTotales = BigDecimal.ZERO;
    @Column(name = "victorias") private Integer victorias = 0;
    @Column(name = "podios") private Integer podios = 0;
    @Column(name = "poles") private Integer poles = 0;
    @Column(name = "vueltas_rapidas") private Integer vueltasRapidas = 0;
}
