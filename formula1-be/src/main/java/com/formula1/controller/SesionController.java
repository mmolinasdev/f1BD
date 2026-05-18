package com.formula1.controller;

import com.formula1.model.dto.SesionDTO;
import com.formula1.service.SesionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sesiones")
@CrossOrigin(origins = "*")
public class SesionController {

    @Autowired
    private SesionService sesionService;

    @GetMapping
    public ResponseEntity<List<SesionDTO>> getAll() {
        return ResponseEntity.ok(sesionService.getAll());
    }

    @GetMapping("/gp/{idGP}")
    public ResponseEntity<List<SesionDTO>> getByGP(@PathVariable Long idGP) {
        return ResponseEntity.ok(sesionService.getByGranPremio(idGP));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SesionDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(sesionService.getById(id));
    }

    @PostMapping
    public ResponseEntity<SesionDTO> create(@RequestBody SesionDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sesionService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SesionDTO> update(@PathVariable Long id, @RequestBody SesionDTO dto) {
        return ResponseEntity.ok(sesionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sesionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
