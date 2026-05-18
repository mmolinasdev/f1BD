package com.formula1.model.dto;

import java.time.LocalDate;

public class TemporadaDTO {
    private Long idTemporada;
    private Integer anio;
    private String estado;
    private Integer numGps;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    public TemporadaDTO() {}

    public TemporadaDTO(Long idTemporada, Integer anio, String estado, Integer numGps,
                        LocalDate fechaInicio, LocalDate fechaFin) {
        this.idTemporada = idTemporada;
        this.anio = anio;
        this.estado = estado;
        this.numGps = numGps;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    public Long getIdTemporada() { return idTemporada; }
    public void setIdTemporada(Long idTemporada) { this.idTemporada = idTemporada; }
    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Integer getNumGps() { return numGps; }
    public void setNumGps(Integer numGps) { this.numGps = numGps; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
}
