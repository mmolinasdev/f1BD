package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "contrato")
public class Contrato {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contrato") private Long idContrato;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
        @JoinColumn(name = "tipo_documento", referencedColumnName = "tipo_documento"),
        @JoinColumn(name = "num_documento", referencedColumnName = "num_documento")
    }) private Piloto piloto;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_equipo") private Escuderia escuderia;
    @Column(name = "fecha_inicio", nullable = false) private LocalDate fechaInicio;
    @Column(name = "fecha_fin") private LocalDate fechaFin;
}
