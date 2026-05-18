package com.formula1.controller;

import com.formula1.model.dto.CircuitoDTO;
import com.formula1.model.dto.PaginatedResponseDTO;
import com.formula1.service.CircuitoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/circuitos")
@CrossOrigin(origins = "*")
@Tag(name = "Circuitos", description = "Gestión de circuitos de Formula 1")
public class CircuitoController {

    @Autowired
    private CircuitoService circuitoService;

    @GetMapping
    public ResponseEntity<PaginatedResponseDTO<CircuitoDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size,
            @RequestParam(required = false) Integer anio) {
        return ResponseEntity.ok(circuitoService.getAll(page, size, anio));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CircuitoDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(circuitoService.getById(id));
    }

    @PostMapping
    public ResponseEntity<CircuitoDTO> create(@RequestBody CircuitoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(circuitoService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CircuitoDTO> update(@PathVariable Long id, @RequestBody CircuitoDTO dto) {
        return ResponseEntity.ok(circuitoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        circuitoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
