package com.formula1.model.dto;

import java.math.BigDecimal;

public class PuntosResultadoAdminDTO {
    private Long idPuntos;
    private Long idResultado;
    private Long idRegla;
    private BigDecimal puntos;
    private String nombrePiloto;
    private String alias;
    private String tipoSesion;
    private Integer posicion;

    public PuntosResultadoAdminDTO() {}

    public PuntosResultadoAdminDTO(Long idPuntos, Long idResultado, Long idRegla,
                                    BigDecimal puntos, String nombrePiloto, String alias,
                                    String tipoSesion, Integer posicion) {
        this.idPuntos = idPuntos;
        this.idResultado = idResultado;
        this.idRegla = idRegla;
        this.puntos = puntos;
        this.nombrePiloto = nombrePiloto;
        this.alias = alias;
        this.tipoSesion = tipoSesion;
        this.posicion = posicion;
    }

    public Long getIdPuntos() { return idPuntos; }
    public void setIdPuntos(Long idPuntos) { this.idPuntos = idPuntos; }

    public Long getIdResultado() { return idResultado; }
    public void setIdResultado(Long idResultado) { this.idResultado = idResultado; }

    public Long getIdRegla() { return idRegla; }
    public void setIdRegla(Long idRegla) { this.idRegla = idRegla; }

    public BigDecimal getPuntos() { return puntos; }
    public void setPuntos(BigDecimal puntos) { this.puntos = puntos; }

    public String getNombrePiloto() { return nombrePiloto; }
    public void setNombrePiloto(String nombrePiloto) { this.nombrePiloto = nombrePiloto; }

    public String getAlias() { return alias; }
    public void setAlias(String alias) { this.alias = alias; }

    public String getTipoSesion() { return tipoSesion; }
    public void setTipoSesion(String tipoSesion) { this.tipoSesion = tipoSesion; }

    public Integer getPosicion() { return posicion; }
    public void setPosicion(Integer posicion) { this.posicion = posicion; }
}
