package com.example.smartworkingsystem.controller;

import com.example.smartworkingsystem.model.PlanoAssinatura;
import com.example.smartworkingsystem.model.Membro;
import com.example.smartworkingsystem.repository.PlanoAssinaturaRepository;
import com.example.smartworkingsystem.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/planos")
public class PlanoAssinaturaController {

    @Autowired
    private PlanoAssinaturaRepository planoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/membro/{membroId}")
    public ResponseEntity<List<PlanoAssinatura>> listarPlanosPorMembro(@PathVariable Long membroId) {
        return ResponseEntity.ok(planoRepository.findByMembroId(membroId));
    }

    @PostMapping("/assinar")
    public ResponseEntity<PlanoAssinatura> assinarPlano(@RequestBody PlanoAssinatura plano) {
        if (plano.getMembro() == null || plano.getMembro().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Long membroId = plano.getMembro().getId();

        // Verifica se o usuário existe e é um Membro
        return usuarioRepository.findById(membroId)
                .filter(u -> u instanceof Membro)
                .map(u -> {
                    plano.setMembro((Membro) u);
                    plano.setDataInicio(new Date());
                    plano.setStatus("ATIVO");
                    return ResponseEntity.status(HttpStatus.CREATED).body(planoRepository.save(plano));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<PlanoAssinatura> cancelarPlano(@PathVariable Long id) {
        return planoRepository.findById(id)
                .map(plano -> {
                    plano.setStatus("CANCELADO");
                    plano.setRenovacaoAutomatica(false);
                    return ResponseEntity.ok(planoRepository.save(plano));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
