package com.formula1.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class GranPremioDTO {
    private Long idEvento;
    private String nombreOficial;
    private Integer numRonda;
    private Integer anioTemporada;
    private Long idVariante;
    private String nombreCircuito;
    private String paisCircuito;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String estado;
    private BigDecimal longitudKm;

    public GranPremioDTO() {}

    public GranPremioDTO(Long idEvento, String nombreOficial, Integer numRonda, Integer anioTemporada,
                         String nombreCircuito, String paisCircuito, LocalDate fechaInicio,
                         LocalDate fechaFin, String estado, BigDecimal longitudKm) {
        this.idEvento = idEvento;
        this.nombreOficial = nombreOficial;
        this.numRonda = numRonda;
        this.anioTemporada = anioTemporada;
        this.nombreCircuito = nombreCircuito;
        this.paisCircuito = paisCircuito;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = estado;
        this.longitudKm = longitudKm;
    }

    public Long getIdEvento() { return idEvento; }
    public void setIdEvento(Long idEvento) { this.idEvento = idEvento; }
    public String getNombreOficial() { return nombreOficial; }
    public void setNombreOficial(String nombreOficial) { this.nombreOficial = nombreOficial; }
    public Integer getNumRonda() { return numRonda; }
    public void setNumRonda(Integer numRonda) { this.numRonda = numRonda; }
    public Integer getAnioTemporada() { return anioTemporada; }
    public void setAnioTemporada(Integer anioTemporada) { this.anioTemporada = anioTemporada; }
    public Long getIdVariante() { return idVariante; }
    public void setIdVariante(Long idVariante) { this.idVariante = idVariante; }
    public String getNombreCircuito() { return nombreCircuito; }
    public void setNombreCircuito(String nombreCircuito) { this.nombreCircuito = nombreCircuito; }
    public String getPaisCircuito() { return paisCircuito; }
    public void setPaisCircuito(String paisCircuito) { this.paisCircuito = paisCircuito; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public BigDecimal getLongitudKm() { return longitudKm; }
    public void setLongitudKm(BigDecimal longitudKm) { this.longitudKm = longitudKm; }
}
