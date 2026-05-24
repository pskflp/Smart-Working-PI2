package com.example.smartworkingsystem.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "plano_assinatura")
public class PlanoAssinatura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomePlano;
    private Double valorMensal;
    private Date dataInicio;
    private Date dataFim;
    private Boolean renovacaoAutomatica;

    @ManyToOne
    @JoinColumn(name = "fk_membro")
    private Membro membro;

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
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Membro getMembro() { return membro; }
    public void setMembro(Membro membro) { this.membro = membro; }

    public void renovarPlano() {}
}
