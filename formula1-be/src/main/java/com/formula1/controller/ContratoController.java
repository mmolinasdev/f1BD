package com.formula1.controller;

import com.formula1.model.dto.ContratoDTO;
import com.formula1.service.ContratoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contratos")
@CrossOrigin(origins = "*")
@Tag(name = "Contratos", description = "Gestión de contratos piloto-escudería")
public class ContratoController {

    @Autowired
    private ContratoService contratoService;

    @GetMapping
    public ResponseEntity<List<ContratoDTO>> getAll() {
        return ResponseEntity.ok(contratoService.getAll());
    }

    @GetMapping("/count/anio/{anio}")
    public ResponseEntity<Long> countPilotosByAnio(@PathVariable int anio) {
        return ResponseEntity.ok(contratoService.countPilotosByAnio(anio));
    }

    @PostMapping
    public ResponseEntity<ContratoDTO> create(@RequestBody ContratoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contratoService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContratoDTO> update(@PathVariable Long id, @RequestBody ContratoDTO dto) {
        return ResponseEntity.ok(contratoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contratoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
