package com.formula1.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "piloto")
public class Piloto {
    @EmbeddedId private PersonaId id;
    @MapsId
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumns({
        @JoinColumn(name = "tipo_documento", referencedColumnName = "tipo_documento"),
        @JoinColumn(name = "num_documento", referencedColumnName = "num_documento")
    }) private Persona persona;
    @Column(name = "num_parrilla_permanente") private Integer numParrillaPermanente;
    @Column(length = 60) private String alias;
    @Column(name = "url_foto", length = 500) private String urlFoto;
    @Column(length = 20) private String estado = "ACTIVO";
    @Column(name = "temporada_retiro") private Integer temporadaRetiro;
    @Column(name = "motivo_retiro", columnDefinition = "TEXT") private String motivoRetiro;
}
