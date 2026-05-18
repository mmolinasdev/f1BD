package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Embeddable
@Data @NoArgsConstructor @AllArgsConstructor
public class PersonaId implements Serializable {
    @Column(name = "tipo_documento", length = 10) private String tipoDocumento;
    @Column(name = "num_documento", length = 20) private String numDocumento;
}
