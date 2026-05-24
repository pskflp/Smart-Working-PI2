package com.example.smartworkingsystem.model;

import java.time.LocalDateTime;

public class Evento {
    private Long id;
    private String titulo;
    private String descricao;
    private LocalDateTime dataEvento;

    public Evento() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public LocalDateTime getDataEvento() { return dataEvento; }
    public void setDataEvento(LocalDateTime dataEvento) { this.dataEvento = dataEvento; }

    public void criarEvento() {}
    public void notificarMembros() {}
}
