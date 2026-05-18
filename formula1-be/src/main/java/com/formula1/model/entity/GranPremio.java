package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "gran_premio")
public class GranPremio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento") private Long idEvento;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_temporada") private Temporada temporada;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_variante") private VarianteCircuito variante;
    @Column(name = "nombre_oficial", nullable = false, length = 150) private String nombreOficial;
    @Column(name = "num_ronda") private Integer numRonda;
    @Column(name = "fecha_inicio") private LocalDate fechaInicio;
    @Column(name = "fecha_fin") private LocalDate fechaFin;
    @Column(length = 15) private String estado = "PROGRAMADO";
}
