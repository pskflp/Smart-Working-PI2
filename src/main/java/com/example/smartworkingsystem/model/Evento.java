package com.example.smartworkingsystem.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evento")
public class Evento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descricao;
    private LocalDateTime dataEvento;

    @ManyToOne
    @JoinColumn(name = "fk_admin")
    private Administrador administrador;

    public Evento() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public LocalDateTime getDataEvento() { return dataEvento; }
    public void setDataEvento(LocalDateTime dataEvento) { this.dataEvento = dataEvento; }
    public Administrador getAdministrador() { return administrador; }
    public void setAdministrador(Administrador administrador) { this.administrador = administrador; }

    public void criarEvento() {}
    public void notificarMembros() {}
}
