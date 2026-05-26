package com.example.smartworkingsystem.controller;

import com.example.smartworkingsystem.model.PlanoAssinatura;
import com.example.smartworkingsystem.model.Membro;
import com.example.smartworkingsystem.repository.PlanoAssinaturaRepository;
import com.example.smartworkingsystem.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return new ResponseEntity<>(planoRepository.findByMembroId(membroId), HttpStatus.OK);
    }

    @PostMapping("/assinar")
    public ResponseEntity<PlanoAssinatura> assinarPlano(@RequestBody PlanoAssinatura plano) {
        if (plano.getMembro() == null || plano.getMembro().getId() == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        // Verifica se o usuário existe e é um Membro
        return usuarioRepository.findById(plano.getMembro().getId())
                .filter(u -> u instanceof Membro)
                .map(u -> {
                    plano.setMembro((Membro) u);
                    plano.setDataInicio(new Date());
                    plano.setStatus("ATIVO");
                    return new ResponseEntity<>(planoRepository.save(plano), HttpStatus.CREATED);
                })
                .orElse(new ResponseEntity<>(null, HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<PlanoAssinatura> cancelarPlano(@PathVariable Long id) {
        return planoRepository.findById(id)
                .map(plano -> {
                    plano.setStatus("CANCELADO");
                    plano.setRenovacaoAutomatica(false);
                    return new ResponseEntity<>(planoRepository.save(plano), HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(null, HttpStatus.NOT_FOUND));
    }
}
