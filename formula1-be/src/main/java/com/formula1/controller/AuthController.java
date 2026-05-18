package com.formula1.controller;

import com.formula1.model.dto.LoginRequestDTO;
import com.formula1.model.dto.LoginResponseDTO;
import com.formula1.model.entity.Usuario;
import com.formula1.repository.UsuarioRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request) {
        Optional<Usuario> opt = usuarioRepository.findByNombreUsuario(request.getNombreUsuario());

        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuario o contraseña incorrectos"));
        }

        Usuario usuario = opt.get();

        if (!request.getContrasena().equals(usuario.getContrasena())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuario o contraseña incorrectos"));
        }

        if (!"ACTIVO".equals(usuario.getEstado())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Usuario inactivo"));
        }

        String rolNombre = usuario.getRol() != null ? usuario.getRol().getNombre() : "LECTOR";

        return ResponseEntity.ok(new LoginResponseDTO(
                usuario.getIdUsuario(),
                usuario.getNombreUsuario(),
                usuario.getCorreo(),
                usuario.getTipoUsuario(),
                rolNombre
        ));
    }
}
