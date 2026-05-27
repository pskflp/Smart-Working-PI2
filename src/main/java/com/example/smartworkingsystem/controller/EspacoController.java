package com.example.smartworkingsystem.controller;

import com.example.smartworkingsystem.model.Espaco;
import com.example.smartworkingsystem.repository.EspacoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/espacos")
public class EspacoController {

    @Autowired
    private EspacoRepository espacoRepository;

    @GetMapping
    public ResponseEntity<List<Espaco>> listarEspacos(@RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(espacoRepository.findAll().stream()
                .filter(e -> e.getStatus().equalsIgnoreCase(status))
                .collect(Collectors.toList()));
        }
        return ResponseEntity.ok(espacoRepository.findAll());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Espaco> atualizarStatus(@PathVariable Long id, @RequestParam String novoStatus) {
        return espacoRepository.findById(id)
                .map(espaco -> {
                    espaco.setStatus(novoStatus.toUpperCase());
                    return ResponseEntity.ok(espacoRepository.save(espaco));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Espaco> cadastrarEspaco(@RequestBody Espaco espaco) {
        if (espaco.getStatus() == null) {
            espaco.setStatus("DISPONÍVEL");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(espacoRepository.save(espaco));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Espaco> atualizarEspaco(@PathVariable Long id, @RequestBody Espaco espacoAtualizado) {
        return espacoRepository.findById(id)
                .map(espaco -> {
                    espaco.setNome(espacoAtualizado.getNome());
                    espaco.setEndereco(espacoAtualizado.getEndereco());
                    espaco.setTipo(espacoAtualizado.getTipo());
                    espaco.setPrecoHora(espacoAtualizado.getPrecoHora());
                    espaco.setPrecoDia(espacoAtualizado.getPrecoDia());
                    espaco.setPrecoMes(espacoAtualizado.getPrecoMes());
                    espaco.setFotoBase64(espacoAtualizado.getFotoBase64());
                    espaco.setPoliticaCancelamento(espacoAtualizado.getPoliticaCancelamento());
                    espaco.setStatus(espacoAtualizado.getStatus());
                    return ResponseEntity.ok(espacoRepository.save(espaco));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEspaco(@PathVariable Long id) {
        if (espacoRepository.existsById(id)) {
            espacoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
