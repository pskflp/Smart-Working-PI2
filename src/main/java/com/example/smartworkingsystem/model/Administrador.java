package com.example.smartworkingsystem.model;

public class Administrador extends Usuario {
    public Administrador(String nome, String email, String senha) {
        super(nome, email, senha);
    }

    public void gerenciarMembros() {}
    public void bloquearEspaco() {}
    public void gerarRelatorios() {}
    public void visualizarDashboard() {}
}
