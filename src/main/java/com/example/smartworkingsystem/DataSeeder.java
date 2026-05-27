package com.example.smartworkingsystem;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.smartworkingsystem.model.Administrador;
import com.example.smartworkingsystem.repository.UsuarioRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.findByEmail("admin@email.com").isEmpty()) {
            Administrador admin = new Administrador();
            admin.setNome("Admin");
            admin.setEmail("admin@email.com");
            admin.setTelefone("0000000000");
            admin.setSenha(hashSenha("admin123")); 
            
            usuarioRepository.save(admin);
            System.out.println("Usuário Admin criado: admin@email.com / admin123");
       
        }
    }

    private String hashSenha(String senha) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(senha.getBytes());
            StringBuilder hexString = new StringBuilder(2 * encodedhash.length);
            for (byte b : encodedhash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao processar hash da senha", e);
        }
    }
}
