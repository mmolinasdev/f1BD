package com.formula1.model.dto;

import java.math.BigDecimal;

public class CircuitoDTO {
    private Long idCircuito;
    private String nombreOficial;
    private String descripcion;
    private String estado;
    // Campos derivados (solo lectura)
    private String pais;
    private String ciudad;
    // from variante
    private BigDecimal longitudKm;
    private Integer numCurvas;
    private String sentido;
    private String tipoCircuito;

    public CircuitoDTO() {}

    public CircuitoDTO(Long idCircuito, String nombreOficial, String pais, String ciudad,
                       String estado, BigDecimal longitudKm, Integer numCurvas,
                       String sentido, String tipoCircuito) {
        this.idCircuito = idCircuito;
        this.nombreOficial = nombreOficial;
        this.pais = pais;
        this.ciudad = ciudad;
        this.estado = estado;
        this.longitudKm = longitudKm;
        this.numCurvas = numCurvas;
        this.sentido = sentido;
        this.tipoCircuito = tipoCircuito;
    }

    public Long getIdCircuito() { return idCircuito; }
    public void setIdCircuito(Long idCircuito) { this.idCircuito = idCircuito; }
    public String getNombreOficial() { return nombreOficial; }
    public void setNombreOficial(String nombreOficial) { this.nombreOficial = nombreOficial; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getPais() { return pais; }
    public void setPais(String pais) { this.pais = pais; }
    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public BigDecimal getLongitudKm() { return longitudKm; }
    public void setLongitudKm(BigDecimal longitudKm) { this.longitudKm = longitudKm; }
    public Integer getNumCurvas() { return numCurvas; }
    public void setNumCurvas(Integer numCurvas) { this.numCurvas = numCurvas; }
    public String getSentido() { return sentido; }
    public void setSentido(String sentido) { this.sentido = sentido; }
    public String getTipoCircuito() { return tipoCircuito; }
    public void setTipoCircuito(String tipoCircuito) { this.tipoCircuito = tipoCircuito; }
}
