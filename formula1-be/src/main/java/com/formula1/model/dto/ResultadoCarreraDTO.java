package com.formula1.model.dto;

import java.math.BigDecimal;

public class ResultadoCarreraDTO {
    private Long idResultado;
    private Integer posicionFinal;
    private String nombrePiloto;
    private String alias;
    private String nombreEscuderia;
    private String tiempoTotal;
    private Integer vueltasCompletadas;
    private String estadoFinalizacion;
    private BigDecimal puntos;
    private Boolean vueltaRapida;
    private Integer posSalida;

    public ResultadoCarreraDTO() {}

    public ResultadoCarreraDTO(Long idResultado, Integer posicionFinal, String nombrePiloto,
                                String alias, String nombreEscuderia, String tiempoTotal,
                                Integer vueltasCompletadas, String estadoFinalizacion,
                                BigDecimal puntos, Boolean vueltaRapida, Integer posSalida) {
        this.idResultado = idResultado;
        this.posicionFinal = posicionFinal;
        this.nombrePiloto = nombrePiloto;
        this.alias = alias;
        this.nombreEscuderia = nombreEscuderia;
        this.tiempoTotal = tiempoTotal;
        this.vueltasCompletadas = vueltasCompletadas;
        this.estadoFinalizacion = estadoFinalizacion;
        this.puntos = puntos;
        this.vueltaRapida = vueltaRapida;
        this.posSalida = posSalida;
    }

    public Long getIdResultado() { return idResultado; }
    public void setIdResultado(Long idResultado) { this.idResultado = idResultado; }
    public Integer getPosicionFinal() { return posicionFinal; }
    public void setPosicionFinal(Integer posicionFinal) { this.posicionFinal = posicionFinal; }
    public String getNombrePiloto() { return nombrePiloto; }
    public void setNombrePiloto(String nombrePiloto) { this.nombrePiloto = nombrePiloto; }
    public String getAlias() { return alias; }
    public void setAlias(String alias) { this.alias = alias; }
    public String getNombreEscuderia() { return nombreEscuderia; }
    public void setNombreEscuderia(String nombreEscuderia) { this.nombreEscuderia = nombreEscuderia; }
    public String getTiempoTotal() { return tiempoTotal; }
    public void setTiempoTotal(String tiempoTotal) { this.tiempoTotal = tiempoTotal; }
    public Integer getVueltasCompletadas() { return vueltasCompletadas; }
    public void setVueltasCompletadas(Integer vueltasCompletadas) { this.vueltasCompletadas = vueltasCompletadas; }
    public String getEstadoFinalizacion() { return estadoFinalizacion; }
    public void setEstadoFinalizacion(String estadoFinalizacion) { this.estadoFinalizacion = estadoFinalizacion; }
    public BigDecimal getPuntos() { return puntos; }
    public void setPuntos(BigDecimal puntos) { this.puntos = puntos; }
    public Boolean getVueltaRapida() { return vueltaRapida; }
    public void setVueltaRapida(Boolean vueltaRapida) { this.vueltaRapida = vueltaRapida; }
    public Integer getPosSalida() { return posSalida; }
    public void setPosSalida(Integer posSalida) { this.posSalida = posSalida; }
}
