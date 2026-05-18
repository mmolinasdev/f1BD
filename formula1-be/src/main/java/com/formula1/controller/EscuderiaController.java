package com.formula1.controller;

import com.formula1.model.dto.EscuderiaDTO;
import com.formula1.model.dto.PaginatedResponseDTO;
import com.formula1.model.dto.PilotoDTO;
import com.formula1.service.EscuderiaService;
import com.formula1.service.PilotoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/escuderias")
@CrossOrigin(origins = "*")
@Tag(name = "Escuderias", description = "Gestión de escuderías de Formula 1")
public class EscuderiaController {

    @Autowired
    private EscuderiaService escuderiaService;

    @Autowired
    private PilotoService pilotoService;

    @GetMapping
    public ResponseEntity<PaginatedResponseDTO<EscuderiaDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Integer anio) {
        return ResponseEntity.ok(escuderiaService.getAll(page, size, anio));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EscuderiaDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(escuderiaService.getById(id));
    }

    @GetMapping("/{id}/pilotos")
    public ResponseEntity<List<PilotoDTO>> getPilotosByEscuderia(
            @PathVariable Long id,
            @RequestParam(required = false) Integer anio) {
        return ResponseEntity.ok(pilotoService.getByEscuderia(id, anio));
    }

    @PostMapping
    public ResponseEntity<EscuderiaDTO> create(@RequestBody EscuderiaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(escuderiaService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EscuderiaDTO> update(@PathVariable Long id, @RequestBody EscuderiaDTO dto) {
        return ResponseEntity.ok(escuderiaService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        escuderiaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
