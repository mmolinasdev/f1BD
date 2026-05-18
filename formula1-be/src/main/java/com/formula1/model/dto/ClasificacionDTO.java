package com.formula1.model.dto;

import java.math.BigDecimal;

public class ClasificacionDTO {
    private Integer posicion;
    private String nombre;
    private String aliasOCodigo;
    private String escuderia;
    private BigDecimal puntosTotales;
    private Integer victorias;
    private Integer podios;
    private Integer poles;

    public ClasificacionDTO() {}

    public ClasificacionDTO(Integer posicion, String nombre, String aliasOCodigo, String escuderia,
                             BigDecimal puntosTotales, Integer victorias, Integer podios, Integer poles) {
        this.posicion = posicion;
        this.nombre = nombre;
        this.aliasOCodigo = aliasOCodigo;
        this.escuderia = escuderia;
        this.puntosTotales = puntosTotales;
        this.victorias = victorias;
        this.podios = podios;
        this.poles = poles;
    }

    public Integer getPosicion() { return posicion; }
    public void setPosicion(Integer posicion) { this.posicion = posicion; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getAliasOCodigo() { return aliasOCodigo; }
    public void setAliasOCodigo(String aliasOCodigo) { this.aliasOCodigo = aliasOCodigo; }
    public String getEscuderia() { return escuderia; }
    public void setEscuderia(String escuderia) { this.escuderia = escuderia; }
    public BigDecimal getPuntosTotales() { return puntosTotales; }
    public void setPuntosTotales(BigDecimal puntosTotales) { this.puntosTotales = puntosTotales; }
    public Integer getVictorias() { return victorias; }
    public void setVictorias(Integer victorias) { this.victorias = victorias; }
    public Integer getPodios() { return podios; }
    public void setPodios(Integer podios) { this.podios = podios; }
    public Integer getPoles() { return poles; }
    public void setPoles(Integer poles) { this.poles = poles; }
}
