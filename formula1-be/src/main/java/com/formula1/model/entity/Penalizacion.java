package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "penalizacion")
public class Penalizacion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_penalizacion") private Long idPenalizacion;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_resultado") private ResultadoCarrera resultadoCarrera;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
        @JoinColumn(name = "tipo_documento", referencedColumnName = "tipo_documento"),
        @JoinColumn(name = "num_documento", referencedColumnName = "num_documento")
    }) private Piloto piloto;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sesion") private Sesion sesion;
    @Column(nullable = false, length = 20) private String tipo;
    @Column(columnDefinition = "TEXT") private String motivo;
    @Column(precision = 6, scale = 2) private BigDecimal magnitud;
    @Column(name = "fecha_resolucion") private LocalDate fechaResolucion;
}
