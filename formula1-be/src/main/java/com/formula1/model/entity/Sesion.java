package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "sesion")
public class Sesion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sesion") private Long idSesion;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_evento") private GranPremio granPremio;
    @Column(name = "tipo_sesion", nullable = false, length = 20) private String tipoSesion;
    @Column(nullable = false) private Integer orden;
    @Column(name = "fecha_programada") private LocalDate fechaProgramada;
    @Column(name = "hora_programada") private LocalTime horaProgramada;
    @Column(length = 15) private String estado = "PROGRAMADA";
    @Column(name = "condicion_pista", length = 15) private String condicionPista;
    @Column(name = "num_vueltas") private Integer numVueltas;
}
