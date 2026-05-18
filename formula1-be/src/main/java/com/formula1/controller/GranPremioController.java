package com.formula1.controller;

import com.formula1.model.dto.GranPremioDTO;
import com.formula1.model.dto.PenalizacionDTO;
import com.formula1.model.dto.ResultadoCarreraDTO;
import com.formula1.model.dto.ResultadoClasificacionDTO;
import com.formula1.service.GranPremioService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gps")
@CrossOrigin(origins = "*")
@Tag(name = "Grandes Premios", description = "Gestión de Grandes Premios de Formula 1")
public class GranPremioController {

    @Autowired
    private GranPremioService granPremioService;

    @GetMapping("/{id}")
    public ResponseEntity<GranPremioDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(granPremioService.getById(id));
    }

    @GetMapping("/{id}/resultados")
    public ResponseEntity<List<ResultadoCarreraDTO>> getResultados(@PathVariable Long id) {
        return ResponseEntity.ok(granPremioService.getResultados(id));
    }

    @GetMapping("/{id}/clasificacion")
    public ResponseEntity<List<ResultadoClasificacionDTO>> getClasificacion(@PathVariable Long id) {
        return ResponseEntity.ok(granPremioService.getClasificacion(id));
    }

    @GetMapping("/{id}/penalizaciones")
    public ResponseEntity<List<PenalizacionDTO>> getPenalizaciones(@PathVariable Long id) {
        return ResponseEntity.ok(granPremioService.getPenalizaciones(id));
    }

    @PostMapping
    public ResponseEntity<GranPremioDTO> create(@RequestBody GranPremioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(granPremioService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GranPremioDTO> update(@PathVariable Long id, @RequestBody GranPremioDTO dto) {
        return ResponseEntity.ok(granPremioService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        granPremioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
