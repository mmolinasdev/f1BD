package com.formula1.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDTO {
    @NotBlank private String nombreUsuario;
    @NotBlank private String contrasena;
}
