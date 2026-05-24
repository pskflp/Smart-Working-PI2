package com.example.smartworkingsystem.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reserva")
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fk_usuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "fk_espaco")
    private Espaco espaco;

    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private Double valorTotal;
    private String status;

    @Enumerated(EnumType.STRING)
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

    public void calcularValorTotal() {
        if (espaco == null || tipo == null || dataInicio == null || dataFim == null) return;
        
        long duracao;
        switch (tipo) {
            case HORA:
                duracao = java.time.Duration.between(dataInicio, dataFim).toHours();
                this.valorTotal = duracao * espaco.getPrecoHora();
                break;
            case DIA:
                duracao = java.time.ChronoUnit.DAYS.between(dataInicio.toLocalDate(), dataFim.toLocalDate());
                if (duracao == 0) duracao = 1;
                this.valorTotal = duracao * espaco.getPrecoDia();
                break;
            case MES:
                duracao = java.time.ChronoUnit.MONTHS.between(dataInicio.toLocalDate(), dataFim.toLocalDate());
                if (duracao == 0) duracao = 1;
                this.valorTotal = duracao * espaco.getPrecoMes();
                break;
        }
    }

    public void confirmarReserva() {
        this.status = "CONFIRMADO";
    }

    public void cancelarReserva() {
        this.status = "CANCELADO";
    }
}
