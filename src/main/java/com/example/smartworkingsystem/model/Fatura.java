package com.example.smartworkingsystem.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fatura")
public class Fatura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigoFatura;
    private LocalDateTime dataEmissao;

    @Lob
    private byte[] arquivoPDF;

    @OneToOne
    @JoinColumn(name = "fk_pagamento")
    private Pagamento pagamento;

    public Fatura() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigoFatura() { return codigoFatura; }
    public void setCodigoFatura(String codigoFatura) { this.codigoFatura = codigoFatura; }
    public LocalDateTime getDataEmissao() { return dataEmissao; }
    public void setDataEmissao(LocalDateTime dataEmissao) { this.dataEmissao = dataEmissao; }
    public byte[] getArquivoPDF() { return arquivoPDF; }
    public void setArquivoPDF(byte[] arquivoPDF) { this.arquivoPDF = arquivoPDF; }
    public Pagamento getPagamento() { return pagamento; }
    public void setPagamento(Pagamento pagamento) { this.pagamento = pagamento; }

    public void gerarFatura() {}
    public void baixarFatura() {}
}
