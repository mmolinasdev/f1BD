package com.formula1.model.dto;

public class ResultadoClasificacionAdminDTO {
    private Long idResultadoClas;
    private Long idSesion;
    private String tipoDocumento;
    private String numDocumento;
    private String nombrePiloto;
    private String alias;
    private Integer posicionParrilla;
    private String tiempoQ1;
    private String tiempoQ2;
    private String tiempoQ3;
    private String faseEliminacion;

    public ResultadoClasificacionAdminDTO() {}

    public ResultadoClasificacionAdminDTO(Long idResultadoClas, Long idSesion, String tipoDocumento,
                                           String numDocumento, String nombrePiloto, String alias,
                                           Integer posicionParrilla,
                                           String tiempoQ1, String tiempoQ2, String tiempoQ3,
                                           String faseEliminacion) {
        this.idResultadoClas = idResultadoClas;
        this.idSesion = idSesion;
        this.tipoDocumento = tipoDocumento;
        this.numDocumento = numDocumento;
        this.nombrePiloto = nombrePiloto;
        this.alias = alias;
        this.posicionParrilla = posicionParrilla;
        this.tiempoQ1 = tiempoQ1;
        this.tiempoQ2 = tiempoQ2;
        this.tiempoQ3 = tiempoQ3;
        this.faseEliminacion = faseEliminacion;
    }

    public Long getIdResultadoClas() { return idResultadoClas; }
    public void setIdResultadoClas(Long idResultadoClas) { this.idResultadoClas = idResultadoClas; }

    public Long getIdSesion() { return idSesion; }
    public void setIdSesion(Long idSesion) { this.idSesion = idSesion; }

    public String getTipoDocumento() { return tipoDocumento; }
    public void setTipoDocumento(String tipoDocumento) { this.tipoDocumento = tipoDocumento; }

    public String getNumDocumento() { return numDocumento; }
    public void setNumDocumento(String numDocumento) { this.numDocumento = numDocumento; }

    public String getNombrePiloto() { return nombrePiloto; }
    public void setNombrePiloto(String nombrePiloto) { this.nombrePiloto = nombrePiloto; }

    public String getAlias() { return alias; }
    public void setAlias(String alias) { this.alias = alias; }

    public Integer getPosicionParrilla() { return posicionParrilla; }
    public void setPosicionParrilla(Integer posicionParrilla) { this.posicionParrilla = posicionParrilla; }

    public String getTiempoQ1() { return tiempoQ1; }
    public void setTiempoQ1(String tiempoQ1) { this.tiempoQ1 = tiempoQ1; }

    public String getTiempoQ2() { return tiempoQ2; }
    public void setTiempoQ2(String tiempoQ2) { this.tiempoQ2 = tiempoQ2; }

    public String getTiempoQ3() { return tiempoQ3; }
    public void setTiempoQ3(String tiempoQ3) { this.tiempoQ3 = tiempoQ3; }

    public String getFaseEliminacion() { return faseEliminacion; }
    public void setFaseEliminacion(String faseEliminacion) { this.faseEliminacion = faseEliminacion; }
}
