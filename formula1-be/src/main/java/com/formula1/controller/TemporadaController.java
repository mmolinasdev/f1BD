package com.formula1.controller;

import com.formula1.model.dto.ClasificacionDTO;
import com.formula1.model.dto.TemporadaDTO;
import com.formula1.service.GranPremioService;
import com.formula1.service.TemporadaService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/temporadas")
@CrossOrigin(origins = "*")
@Tag(name = "Temporadas", description = "Gestión de temporadas de Formula 1")
public class TemporadaController {

    @Autowired
    private TemporadaService temporadaService;

    @Autowired
    private GranPremioService granPremioService;

    @GetMapping
    public ResponseEntity<List<TemporadaDTO>> getAll() {
        return ResponseEntity.ok(temporadaService.getAll());
    }

    @GetMapping("/{anio}")
    public ResponseEntity<TemporadaDTO> getByAnio(@PathVariable Integer anio) {
        return ResponseEntity.ok(temporadaService.getByAnio(anio));
    }

    @GetMapping("/{anio}/clasificacion/pilotos")
    public ResponseEntity<List<ClasificacionDTO>> getClasificacionPilotos(@PathVariable Integer anio) {
        return ResponseEntity.ok(temporadaService.getClasificacionPilotos(anio));
    }

    @GetMapping("/{anio}/clasificacion/constructores")
    public ResponseEntity<List<ClasificacionDTO>> getClasificacionConstructores(@PathVariable Integer anio) {
        return ResponseEntity.ok(temporadaService.getClasificacionConstructores(anio));
    }

    @GetMapping("/{anio}/gps")
    public ResponseEntity<?> getGpsByTemporada(
            @PathVariable Integer anio,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        return ResponseEntity.ok(granPremioService.getByTemporada(anio, page, size));
    }

    @PostMapping
    public ResponseEntity<TemporadaDTO> create(@RequestBody TemporadaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(temporadaService.create(dto));
    }

    @PutMapping("/{anio}")
    public ResponseEntity<TemporadaDTO> update(@PathVariable Integer anio, @RequestBody TemporadaDTO dto) {
        return ResponseEntity.ok(temporadaService.update(anio, dto));
    }

    @DeleteMapping("/{anio}")
    public ResponseEntity<Void> delete(@PathVariable Integer anio) {
        temporadaService.delete(anio);
        return ResponseEntity.noContent().build();
    }
}
