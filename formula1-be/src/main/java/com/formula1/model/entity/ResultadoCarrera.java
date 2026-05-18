package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "resultado_carrera")
public class ResultadoCarrera {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resultado") private Long idResultado;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_sesion") private Sesion sesion;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumns({
        @JoinColumn(name = "tipo_documento", referencedColumnName = "tipo_documento"),
        @JoinColumn(name = "num_documento", referencedColumnName = "num_documento")
    }) private Piloto piloto;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_contrato") private Contrato contrato;
    @Column(name = "posicion_final") private Integer posicionFinal;
    @Column(name = "tiempo_total", length = 20) private String tiempoTotal;
    @Column(name = "vueltas_completadas") private Integer vueltasCompletadas;
    @Column(name = "estado_finalizacion", nullable = false, length = 15) private String estadoFinalizacion = "FINALIZADO";
    @Column(precision = 4, scale = 1) private BigDecimal puntos = BigDecimal.ZERO;
    @Column(name = "vuelta_rapida") private Boolean vueltaRapida = false;
    @Column(name = "vueltas_lideradas") private Integer vueltasLideradas;
    @Column(name = "pos_salida") private Integer posSalida;
    @Column(name = "num_paradas_boxes") private Integer numParadasBoxes;
}
