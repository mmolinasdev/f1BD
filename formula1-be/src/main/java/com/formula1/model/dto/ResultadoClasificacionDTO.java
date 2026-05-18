package com.formula1.model.dto;

public class ResultadoClasificacionDTO {
    private Integer posicionParrilla;
    private String nombrePiloto;
    private String alias;
    private String nombreEscuderia;
    private String tiempoQ1;
    private String tiempoQ2;
    private String tiempoQ3;
    private String faseEliminacion;

    public ResultadoClasificacionDTO() {}

    public ResultadoClasificacionDTO(Integer posicionParrilla, String nombrePiloto, String alias,
                                      String nombreEscuderia, String tiempoQ1, String tiempoQ2,
                                      String tiempoQ3, String faseEliminacion) {
        this.posicionParrilla = posicionParrilla;
        this.nombrePiloto = nombrePiloto;
        this.alias = alias;
        this.nombreEscuderia = nombreEscuderia;
        this.tiempoQ1 = tiempoQ1;
        this.tiempoQ2 = tiempoQ2;
        this.tiempoQ3 = tiempoQ3;
        this.faseEliminacion = faseEliminacion;
    }

    public Integer getPosicionParrilla() { return posicionParrilla; }
    public void setPosicionParrilla(Integer posicionParrilla) { this.posicionParrilla = posicionParrilla; }
    public String getNombrePiloto() { return nombrePiloto; }
    public void setNombrePiloto(String nombrePiloto) { this.nombrePiloto = nombrePiloto; }
    public String getAlias() { return alias; }
    public void setAlias(String alias) { this.alias = alias; }
    public String getNombreEscuderia() { return nombreEscuderia; }
    public void setNombreEscuderia(String nombreEscuderia) { this.nombreEscuderia = nombreEscuderia; }
    public String getTiempoQ1() { return tiempoQ1; }
    public void setTiempoQ1(String tiempoQ1) { this.tiempoQ1 = tiempoQ1; }
    public String getTiempoQ2() { return tiempoQ2; }
    public void setTiempoQ2(String tiempoQ2) { this.tiempoQ2 = tiempoQ2; }
    public String getTiempoQ3() { return tiempoQ3; }
    public void setTiempoQ3(String tiempoQ3) { this.tiempoQ3 = tiempoQ3; }
    public String getFaseEliminacion() { return faseEliminacion; }
    public void setFaseEliminacion(String faseEliminacion) { this.faseEliminacion = faseEliminacion; }
}
