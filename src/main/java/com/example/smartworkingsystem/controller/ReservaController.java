package com.example.smartworkingsystem.controller;

import com.example.smartworkingsystem.model.*;
import com.example.smartworkingsystem.repository.ReservaRepository;
import com.example.smartworkingsystem.repository.EspacoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private EspacoRepository espacoRepository;

    @PostMapping
    public ResponseEntity<String> fazerReserva(@RequestBody Reserva reserva) {
        if (reserva.getEspaco() == null || !espacoRepository.existsById(reserva.getEspaco().getId())) {
            return new ResponseEntity<>("Espaço não encontrado", HttpStatus.NOT_FOUND);
        }

        // Simulação básica de conflito (lógica acadêmica pode ser expandida)
        reservaRepository.save(reserva);
        return new ResponseEntity<>("Reserva efetuada com sucesso!", HttpStatus.CREATED);
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<Reserva>> getReservasPorUsuario(@PathVariable Long id) {
        return new ResponseEntity<>(reservaRepository.findByUsuarioId(id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarReserva(@PathVariable Long id) {
        if (reservaRepository.existsById(id)) {
            reservaRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
