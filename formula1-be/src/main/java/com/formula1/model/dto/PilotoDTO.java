package com.formula1.model.dto;

import java.time.LocalDate;

public class PilotoDTO {
    private String tipoDocumento;
    private String numDocumento;
    private String nombre;
    private String apellidos;
    private String nacionalidad;
    private LocalDate fechaNacimiento;
    private String alias;
    private Integer numParrillaPermanente;
    private String urlFoto;
    private String estado;
    private Integer temporadaRetiro;
    private String escuderiaActual;
    private Long escuderiaId;

    public PilotoDTO() {}

    public PilotoDTO(String tipoDocumento, String numDocumento, String nombre, String apellidos,
                     String nacionalidad, LocalDate fechaNacimiento, String alias,
                     Integer numParrillaPermanente, String urlFoto, String estado,
                     Integer temporadaRetiro, String escuderiaActual, Long escuderiaId) {
        this.tipoDocumento = tipoDocumento;
        this.numDocumento = numDocumento;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.nacionalidad = nacionalidad;
        this.fechaNacimiento = fechaNacimiento;
        this.alias = alias;
        this.numParrillaPermanente = numParrillaPermanente;
        this.urlFoto = urlFoto;
        this.estado = estado;
        this.temporadaRetiro = temporadaRetiro;
        this.escuderiaActual = escuderiaActual;
        this.escuderiaId = escuderiaId;
    }

    public String getTipoDocumento() { return tipoDocumento; }
    public void setTipoDocumento(String tipoDocumento) { this.tipoDocumento = tipoDocumento; }
    public String getNumDocumento() { return numDocumento; }
    public void setNumDocumento(String numDocumento) { this.numDocumento = numDocumento; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }
    public String getNacionalidad() { return nacionalidad; }
    public void setNacionalidad(String nacionalidad) { this.nacionalidad = nacionalidad; }
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    public String getAlias() { return alias; }
    public void setAlias(String alias) { this.alias = alias; }
    public Integer getNumParrillaPermanente() { return numParrillaPermanente; }
    public void setNumParrillaPermanente(Integer numParrillaPermanente) { this.numParrillaPermanente = numParrillaPermanente; }
    public String getUrlFoto() { return urlFoto; }
    public void setUrlFoto(String urlFoto) { this.urlFoto = urlFoto; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Integer getTemporadaRetiro() { return temporadaRetiro; }
    public void setTemporadaRetiro(Integer temporadaRetiro) { this.temporadaRetiro = temporadaRetiro; }
    public String getEscuderiaActual() { return escuderiaActual; }
    public void setEscuderiaActual(String escuderiaActual) { this.escuderiaActual = escuderiaActual; }
    public Long getEscuderiaId() { return escuderiaId; }
    public void setEscuderiaId(Long escuderiaId) { this.escuderiaId = escuderiaId; }
}
