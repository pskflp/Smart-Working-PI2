package com.example.smartworkingsystem.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagamento")
public class Pagamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double valor;
    private LocalDateTime dataPagamento;
    private String metodoPagamento;
    private String status;
    private String justificativaEstorno;

    @ManyToOne
    @JoinColumn(name = "fk_reserva")
    private Reserva reserva;

    @ManyToOne
    @JoinColumn(name = "fk_plano")
    private PlanoAssinatura plano;

    public Pagamento() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }
    public LocalDateTime getDataPagamento() { return dataPagamento; }
    public void setDataPagamento(LocalDateTime dataPagamento) { this.dataPagamento = dataPagamento; }
    public String getMetodoPagamento() { return metodoPagamento; }
    public void setMetodoPagamento(String metodoPagamento) { this.metodoPagamento = metodoPagamento; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getJustificativaEstorno() { return justificativaEstorno; }
    public void setJustificativaEstorno(String justificativaEstorno) { this.justificativaEstorno = justificativaEstorno; }
    public Reserva getReserva() { return reserva; }
    public void setReserva(Reserva reserva) { this.reserva = reserva; }
    public PlanoAssinatura getPlano() { return plano; }
    public void setPlano(PlanoAssinatura plano) { this.plano = plano; }

    public void processarPagamento() {}
    public void processarReembolso() {}
}
