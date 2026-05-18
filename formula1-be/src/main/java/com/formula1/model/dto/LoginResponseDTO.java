package com.formula1.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private Long id;
    private String nombreUsuario;
    private String correo;
    private String tipoUsuario;
    private String rol;
}
