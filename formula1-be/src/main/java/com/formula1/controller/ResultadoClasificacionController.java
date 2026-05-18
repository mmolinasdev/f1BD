package com.formula1.controller;

import com.formula1.model.dto.ResultadoClasificacionAdminDTO;
import com.formula1.service.ResultadoClasificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/resultados/clasificacion")
@CrossOrigin(origins = "*")
public class ResultadoClasificacionController {

    @Autowired
    private ResultadoClasificacionService resultadoClasificacionService;

    @GetMapping("/sesion/{idSesion}")
    public ResponseEntity<List<ResultadoClasificacionAdminDTO>> getBySesion(@PathVariable Long idSesion) {
        return ResponseEntity.ok(resultadoClasificacionService.getBySesion(idSesion));
    }

    @PostMapping
    public ResponseEntity<ResultadoClasificacionAdminDTO> create(@RequestBody ResultadoClasificacionAdminDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resultadoClasificacionService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResultadoClasificacionAdminDTO> update(@PathVariable Long id,
                                                                  @RequestBody ResultadoClasificacionAdminDTO dto) {
        return ResponseEntity.ok(resultadoClasificacionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        resultadoClasificacionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
