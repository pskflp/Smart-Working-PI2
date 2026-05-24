package com.example.smartworkingsystem.model;

import javax.persistence.*;

@Entity
@Table(name = "administrador")
@PrimaryKeyJoinColumn(name = "id_admin")
public class Administrador extends Usuario {
    public Administrador() {}

    public Administrador(String nome, String email, String senha) {
        super(nome, email, senha);
    }

    public void gerenciarMembros() {}
    public void bloquearEspaco() {}
    public void gerarRelatorios() {}
    public void visualizarDashboard() {}
}
