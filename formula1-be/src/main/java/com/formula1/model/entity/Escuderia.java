package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "escuderia")
public class Escuderia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_equipo") private Long idEquipo;
    @Column(name = "nombre_oficial", nullable = false, length = 150) private String nombreOficial;
    @Column(nullable = false, unique = true, length = 10) private String codigo;
    @Column(length = 60) private String nacionalidad;
    @Column(name = "fecha_fundacion") private LocalDate fechaFundacion;
    @Column(length = 20) private String estado = "ACTIVO";
    @Column(name = "pais_sede", length = 60) private String paisSede;
    @Column(name = "ciudad_sede", length = 60) private String ciudadSede;
    @Column(name = "url_foto", length = 500) private String urlFoto;
    @Column(name = "url_perfil", length = 500) private String urlPerfil;
}
