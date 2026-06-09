package com.example.smartworkingsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Version;

@Entity
@Table(name = "espaco")
public class Espaco {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    private String nome;
    private String identificadorUnico;
    private String endereco;
    private Double precoHora;
    private Double precoDia;
    private Double precoMes;
    private String status;

    @JsonIgnore
    @Column(columnDefinition = "LONGTEXT")
    private String fotoBase64;

    private String tipo;
    private String politicaCancelamento;

    public Espaco() {}

    public Espaco(Long id, String identificadorUnico, String nome, String tipo, Double precoHora, Double precoDia, Double precoMes, String fotoBase64, String endereco, String politicaCancelamento) {
        this.id = id;
        this.identificadorUnico = identificadorUnico;
        this.nome = nome;
        this.tipo = tipo;
        this.precoHora = precoHora;
        this.precoDia = precoDia;
        this.precoMes = precoMes;
        this.fotoBase64 = fotoBase64;
        this.endereco = endereco;
        this.politicaCancelamento = politicaCancelamento;
        this.status = "DISPONÍVEL";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getIdentificadorUnico() { return identificadorUnico; }
    public void setIdentificadorUnico(String identificadorUnico) { this.identificadorUnico = identificadorUnico; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public Double getPrecoHora() { return precoHora; }
    public void setPrecoHora(Double precoHora) { this.precoHora = precoHora; }
    public Double getPrecoDia() { return precoDia; }
    public void setPrecoDia(Double precoDia) { this.precoDia = precoDia; }
    public Double getPrecoMes() { return precoMes; }
    public void setPrecoMes(Double precoMes) { this.precoMes = precoMes; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getFotoBase64() { return fotoBase64; }
    public void setFotoBase64(String fotoBase64) { this.fotoBase64 = fotoBase64; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getPoliticaCancelamento() { return politicaCancelamento; }
    public void setPoliticaCancelamento(String politicaCancelamento) { this.politicaCancelamento = politicaCancelamento; }

    public void consultarDisponibilidade() {}
}
