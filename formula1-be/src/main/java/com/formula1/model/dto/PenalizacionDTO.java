package com.formula1.model.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor
public class PenalizacionDTO {
    private Long idPenalizacion;
    private String nombrePiloto;
    private String alias;
    private String tipo;
    private String motivo;
    private BigDecimal magnitud;
    private LocalDate fechaResolucion;
}
