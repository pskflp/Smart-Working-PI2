package com.example.smartworkingsystem.model;

import java.util.Date;

public class PlanoAssinatura {
    private Long id;
    private String nomePlano;
    private Double valorMensal;
    private Date dataInicio;
    private Date dataFim;
    private Boolean renovacaoAutomatica;

    public PlanoAssinatura() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomePlano() { return nomePlano; }
    public void setNomePlano(String nomePlano) { this.nomePlano = nomePlano; }
    public Double getValorMensal() { return valorMensal; }
    public void setValorMensal(Double valorMensal) { this.valorMensal = valorMensal; }
    public Date getDataInicio() { return dataInicio; }
    public void setDataInicio(Date dataInicio) { this.dataInicio = dataInicio; }
    public Date getDataFim() { return dataFim; }
    public void setDataFim(Date dataFim) { this.dataFim = dataFim; }
    public Boolean getRenovacaoAutomatica() { return renovacaoAutomatica; }
    public void setRenovacaoAutomatica(Boolean renovacaoAutomatica) { this.renovacaoAutomatica = renovacaoAutomatica; }

    public void renovarPlano() {}
}
