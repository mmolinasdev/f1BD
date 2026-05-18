package com.formula1.controller;

import com.formula1.model.dto.PuntosResultadoAdminDTO;
import com.formula1.service.PuntosResultadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/puntos-resultado")
@CrossOrigin(origins = "*")
public class PuntosResultadoController {

    @Autowired
    private PuntosResultadoService puntosResultadoService;

    @GetMapping
    public ResponseEntity<List<PuntosResultadoAdminDTO>> getAll() {
        return ResponseEntity.ok(puntosResultadoService.getAll());
    }

    @GetMapping("/resultado/{idResultado}")
    public ResponseEntity<List<PuntosResultadoAdminDTO>> getByResultado(@PathVariable Long idResultado) {
        return ResponseEntity.ok(puntosResultadoService.getByResultado(idResultado));
    }

    @PostMapping
    public ResponseEntity<PuntosResultadoAdminDTO> create(@RequestBody PuntosResultadoAdminDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(puntosResultadoService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PuntosResultadoAdminDTO> update(@PathVariable Long id,
                                                           @RequestBody PuntosResultadoAdminDTO dto) {
        return ResponseEntity.ok(puntosResultadoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        puntosResultadoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
