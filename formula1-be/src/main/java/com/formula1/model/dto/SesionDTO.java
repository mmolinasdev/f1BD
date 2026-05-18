package com.formula1.model.dto;

public class SesionDTO {
    private Long idSesion;
    private Long idEvento;
    private String nombreGP;
    private String tipoSesion;
    private Integer orden;
    private String fechaProgramada;
    private String estado;
    private String condicionPista;
    private Integer numVueltas;

    public SesionDTO() {}

    public SesionDTO(Long idSesion, Long idEvento, String nombreGP, String tipoSesion,
                     Integer orden, String fechaProgramada, String estado,
                     String condicionPista, Integer numVueltas) {
        this.idSesion = idSesion;
        this.idEvento = idEvento;
        this.nombreGP = nombreGP;
        this.tipoSesion = tipoSesion;
        this.orden = orden;
        this.fechaProgramada = fechaProgramada;
        this.estado = estado;
        this.condicionPista = condicionPista;
        this.numVueltas = numVueltas;
    }

    public Long getIdSesion() { return idSesion; }
    public void setIdSesion(Long idSesion) { this.idSesion = idSesion; }

    public Long getIdEvento() { return idEvento; }
    public void setIdEvento(Long idEvento) { this.idEvento = idEvento; }

    public String getNombreGP() { return nombreGP; }
    public void setNombreGP(String nombreGP) { this.nombreGP = nombreGP; }

    public String getTipoSesion() { return tipoSesion; }
    public void setTipoSesion(String tipoSesion) { this.tipoSesion = tipoSesion; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }

    public String getFechaProgramada() { return fechaProgramada; }
    public void setFechaProgramada(String fechaProgramada) { this.fechaProgramada = fechaProgramada; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getCondicionPista() { return condicionPista; }
    public void setCondicionPista(String condicionPista) { this.condicionPista = condicionPista; }

    public Integer getNumVueltas() { return numVueltas; }
    public void setNumVueltas(Integer numVueltas) { this.numVueltas = numVueltas; }
}
