package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "resultado_clasificacion")
public class ResultadoClasificacion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resultado_clas") private Long idResultadoClas;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_sesion") private Sesion sesion;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumns({
        @JoinColumn(name = "tipo_documento", referencedColumnName = "tipo_documento"),
        @JoinColumn(name = "num_documento", referencedColumnName = "num_documento")
    }) private Piloto piloto;
    @Column(name = "posicion_parrilla") private Integer posicionParrilla;
    @Column(name = "tiempo_q1", length = 15) private String tiempoQ1;
    @Column(name = "tiempo_q2", length = 15) private String tiempoQ2;
    @Column(name = "tiempo_q3", length = 15) private String tiempoQ3;
    @Column(name = "fase_eliminacion", length = 10) private String faseEliminacion;
}
