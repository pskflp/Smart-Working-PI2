package com.example.smartworkingsystem.model;

import java.time.LocalDateTime;

public class Pagamento {
    private Long id;
    private Double valor;
    private LocalDateTime dataPagamento;
    private String metodoPagamento;
    private String status;
    private String justificativaEstorno;

    public Pagamento() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }
    public LocalDateTime dataPagamento() { return dataPagamento; }
    public void setDataPagamento(LocalDateTime dataPagamento) { this.dataPagamento = dataPagamento; }
    public String getMetodoPagamento() { return metodoPagamento; }
    public void setMetodoPagamento(String metodoPagamento) { this.metodoPagamento = metodoPagamento; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getJustificativaEstorno() { return justificativaEstorno; }
    public void setJustificativaEstorno(String justificativaEstorno) { this.justificativaEstorno = justificativaEstorno; }

    public void processarPagamento() {}
    public void processarReembolso() {}
}
