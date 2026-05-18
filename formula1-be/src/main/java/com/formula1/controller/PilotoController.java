package com.formula1.controller;

import com.formula1.model.dto.PaginatedResponseDTO;
import com.formula1.model.dto.PilotoDTO;
import com.formula1.service.PilotoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pilotos")
@CrossOrigin(origins = "*")
@Tag(name = "Pilotos", description = "Gestión de pilotos de Formula 1")
public class PilotoController {

    @Autowired
    private PilotoService pilotoService;

    @GetMapping
    public ResponseEntity<PaginatedResponseDTO<PilotoDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) Integer anio) {
        return ResponseEntity.ok(pilotoService.getAll(page, size, search, anio));
    }

    @GetMapping("/{tipoDoc}/{numDoc}")
    public ResponseEntity<PilotoDTO> getById(
            @PathVariable String tipoDoc,
            @PathVariable String numDoc) {
        return ResponseEntity.ok(pilotoService.getById(tipoDoc, numDoc));
    }

    @PostMapping
    public ResponseEntity<PilotoDTO> create(@RequestBody PilotoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pilotoService.createPiloto(dto));
    }

    @PutMapping("/{tipoDoc}/{numDoc}")
    public ResponseEntity<PilotoDTO> update(
            @PathVariable String tipoDoc,
            @PathVariable String numDoc,
            @RequestBody PilotoDTO dto) {
        return ResponseEntity.ok(pilotoService.updatePiloto(tipoDoc, numDoc, dto));
    }

    @DeleteMapping("/{tipoDoc}/{numDoc}")
    public ResponseEntity<Void> delete(
            @PathVariable String tipoDoc,
            @PathVariable String numDoc) {
        pilotoService.deletePiloto(tipoDoc, numDoc);
        return ResponseEntity.noContent().build();
    }
}
