package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "variante_circuito")
public class VarianteCircuito {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_variante") private Long idVariante;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_circuito") private Circuito circuito;
    @Column(name = "anio_desde", nullable = false) private Integer anioDesde;
    @Column(name = "anio_hasta") private Integer anioHasta;
    @Column(name = "tipo_circuito", length = 15) private String tipoCircuito;
    @Column(name = "nombre_oficial", length = 150) private String nombreOficial;
    @Column(name = "longitud_km", precision = 5, scale = 3) private BigDecimal longitudKm;
    @Column(name = "num_curvas") private Integer numCurvas;
    @Column(length = 15) private String sentido;
}
