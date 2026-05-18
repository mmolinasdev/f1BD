package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "usuario")
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario") private Long idUsuario;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
        @JoinColumn(name = "tipo_documento", referencedColumnName = "tipo_documento"),
        @JoinColumn(name = "num_documento", referencedColumnName = "num_documento")
    }) private Persona persona;
    @Column(nullable = false, unique = true, length = 150) private String correo;
    @Column(name = "nombre_usuario", nullable = false, unique = true, length = 60) private String nombreUsuario;
    @Column(nullable = false, length = 255) private String contrasena;
    @Column(name = "tipo_usuario", nullable = false, length = 30) private String tipoUsuario;
    @Column(length = 20) private String estado = "ACTIVO";
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_rol") private Rol rol;
}
