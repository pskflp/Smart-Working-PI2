package com.example.smartworkingsystem.model;

import java.time.LocalDateTime;

public class Fatura {
    private Long id;
    private String codigoFatura;
    private LocalDateTime dataEmissao;
    private byte[] arquivoPDF;

    public Fatura() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigoFatura() { return codigoFatura; }
    public void setCodigoFatura(String codigoFatura) { this.codigoFatura = codigoFatura; }
    public LocalDateTime getDataEmissao() { return dataEmissao; }
    public void setDataEmissao(LocalDateTime dataEmissao) { this.dataEmissao = dataEmissao; }
    public byte[] getArquivoPDF() { return arquivoPDF; }
    public void setArquivoPDF(byte[] arquivoPDF) { this.arquivoPDF = arquivoPDF; }

    public void gerarFatura() {}
    public void baixarFatura() {}
}
