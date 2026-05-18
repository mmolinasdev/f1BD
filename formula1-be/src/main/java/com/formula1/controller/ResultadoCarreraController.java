package com.formula1.controller;

import com.formula1.model.dto.ResultadoCarreraAdminDTO;
import com.formula1.service.ResultadoCarreraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/resultados/carrera")
@CrossOrigin(origins = "*")
public class ResultadoCarreraController {

    @Autowired
    private ResultadoCarreraService resultadoCarreraService;

    @GetMapping("/sesion/{idSesion}")
    public ResponseEntity<List<ResultadoCarreraAdminDTO>> getBySesion(@PathVariable Long idSesion) {
        return ResponseEntity.ok(resultadoCarreraService.getBySesion(idSesion));
    }

    @PostMapping
    public ResponseEntity<ResultadoCarreraAdminDTO> create(@RequestBody ResultadoCarreraAdminDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resultadoCarreraService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResultadoCarreraAdminDTO> update(@PathVariable Long id,
                                                            @RequestBody ResultadoCarreraAdminDTO dto) {
        return ResponseEntity.ok(resultadoCarreraService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        resultadoCarreraService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
