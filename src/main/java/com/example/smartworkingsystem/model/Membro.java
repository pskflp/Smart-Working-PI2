package com.example.smartworkingsystem.model;

import javax.persistence.*;

@Entity
@Table(name = "membro")
@PrimaryKeyJoinColumn(name = "id_membro")
public class Membro extends Usuario {
    private String endereco;

    public Membro() {}

    public Membro(String nome, String email, String senha) {
        super(nome, email, senha);
    }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public void reservarEspaco() {}
    public void alterarPlano() {}
    public void editarPerfil() {}
    public void visualizarHistorico() {}
    public void excluirConta() {}
}
