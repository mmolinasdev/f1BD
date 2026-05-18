package com.formula1.model.dto;

public class EscuderiaDTO {
    private Long idEquipo;
    private String nombreOficial;
    private String codigo;
    private String nacionalidad;
    private String estado;
    // Campos derivados (solo lectura)
    private String paisSede;
    private String ciudadSede;
    private String urlFoto;

    public EscuderiaDTO() {}

    public EscuderiaDTO(Long idEquipo, String nombreOficial, String codigo, String nacionalidad,
                        String estado, String paisSede, String ciudadSede, String urlFoto) {
        this.idEquipo = idEquipo;
        this.nombreOficial = nombreOficial;
        this.codigo = codigo;
        this.nacionalidad = nacionalidad;
        this.estado = estado;
        this.paisSede = paisSede;
        this.ciudadSede = ciudadSede;
        this.urlFoto = urlFoto;
    }

    public Long getIdEquipo() { return idEquipo; }
    public void setIdEquipo(Long idEquipo) { this.idEquipo = idEquipo; }
    public String getNombreOficial() { return nombreOficial; }
    public void setNombreOficial(String nombreOficial) { this.nombreOficial = nombreOficial; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getNacionalidad() { return nacionalidad; }
    public void setNacionalidad(String nacionalidad) { this.nacionalidad = nacionalidad; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getPaisSede() { return paisSede; }
    public void setPaisSede(String paisSede) { this.paisSede = paisSede; }
    public String getCiudadSede() { return ciudadSede; }
    public void setCiudadSede(String ciudadSede) { this.ciudadSede = ciudadSede; }
    public String getUrlFoto() { return urlFoto; }
    public void setUrlFoto(String urlFoto) { this.urlFoto = urlFoto; }
}
