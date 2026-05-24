package com.example.smartworkingsystem.model;

import java.time.LocalDateTime;

public class Reserva {
    private Long id;
    private Usuario usuario;
    private Espaco espaco;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private Double valorTotal;
    private String status;
    private TipoReserva tipo;

    public Reserva() {}

    public Reserva(Usuario usuario, Espaco espaco, LocalDateTime dataInicio, LocalDateTime dataFim, TipoReserva tipo) {
        this.usuario = usuario;
        this.espaco = espaco;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.tipo = tipo;
        this.status = "CONFIRMADO";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public Espaco getEspaco() { return espaco; }
    public void setEspaco(Espaco espaco) { this.espaco = espaco; }
    public LocalDateTime getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDateTime dataInicio) { this.dataInicio = dataInicio; }
    public LocalDateTime getDataFim() { return dataFim; }
    public void setDataFim(LocalDateTime dataFim) { this.dataFim = dataFim; }
    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public TipoReserva getTipo() { return tipo; }
    public void setTipo(TipoReserva tipo) { this.tipo = tipo; }

    public void calcularValorTotal() {}
    public void confirmarReserva() {}
    public void cancelarReserva() {}
}
