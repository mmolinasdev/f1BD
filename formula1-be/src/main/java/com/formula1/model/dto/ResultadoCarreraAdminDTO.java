package com.formula1.model.dto;

import java.math.BigDecimal;

public class ResultadoCarreraAdminDTO {
    private Long idResultado;
    private Long idSesion;
    private String tipoDocumento;
    private String numDocumento;
    private String nombrePiloto;
    private String alias;
    private Integer posicionFinal;
    private String tiempoTotal;
    private Integer vueltasCompletadas;
    private String estadoFinalizacion;
    private BigDecimal puntos;
    private Boolean vueltaRapida;
    private Integer posSalida;
    private Integer numParadasBoxes;
    private Integer vueltasLideradas;

    public ResultadoCarreraAdminDTO() {}

    public ResultadoCarreraAdminDTO(Long idResultado, Long idSesion, String tipoDocumento,
                                     String numDocumento, String nombrePiloto, String alias,
                                     Integer posicionFinal, String tiempoTotal,
                                     Integer vueltasCompletadas, String estadoFinalizacion,
                                     BigDecimal puntos, Boolean vueltaRapida, Integer posSalida,
                                     Integer numParadasBoxes, Integer vueltasLideradas) {
        this.idResultado = idResultado;
        this.idSesion = idSesion;
        this.tipoDocumento = tipoDocumento;
        this.numDocumento = numDocumento;
        this.nombrePiloto = nombrePiloto;
        this.alias = alias;
        this.posicionFinal = posicionFinal;
        this.tiempoTotal = tiempoTotal;
        this.vueltasCompletadas = vueltasCompletadas;
        this.estadoFinalizacion = estadoFinalizacion;
        this.puntos = puntos;
        this.vueltaRapida = vueltaRapida;
        this.posSalida = posSalida;
        this.numParadasBoxes = numParadasBoxes;
        this.vueltasLideradas = vueltasLideradas;
    }

    public Long getIdResultado() { return idResultado; }
    public void setIdResultado(Long idResultado) { this.idResultado = idResultado; }

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

    public Integer getPosicionFinal() { return posicionFinal; }
    public void setPosicionFinal(Integer posicionFinal) { this.posicionFinal = posicionFinal; }

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

    public Integer getNumParadasBoxes() { return numParadasBoxes; }
    public void setNumParadasBoxes(Integer numParadasBoxes) { this.numParadasBoxes = numParadasBoxes; }

    public Integer getVueltasLideradas() { return vueltasLideradas; }
    public void setVueltasLideradas(Integer vueltasLideradas) { this.vueltasLideradas = vueltasLideradas; }
}
