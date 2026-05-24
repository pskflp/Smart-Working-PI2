package com.example.smartworkingsystem.controller;

import com.example.smartworkingsystem.model.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    public static List<Reserva> reservas = new ArrayList<>();
    private static Long nextId = 1L;

    @PostMapping
    public ResponseEntity<String> fazerReserva(@RequestBody Reserva reserva) {
        Espaco espacoCompleto = EspacoController.espacos.stream()
                .filter(e -> e.getId().equals(reserva.getEspaco().getId()))
                .findFirst().orElse(null);

        if (espacoCompleto == null) {
            return new ResponseEntity<>("Espaço não encontrado", HttpStatus.NOT_FOUND);
        }

        reserva.setEspaco(espacoCompleto);
        
        boolean conflito = reservas.stream().anyMatch(r -> r.getEspaco().getId().equals(reserva.getEspaco().getId()) &&
            r.getDataInicio().isBefore(reserva.getDataFim()) && 
            r.getDataFim().isAfter(reserva.getDataInicio()));

        if (conflito) {
            return new ResponseEntity<>("Data Indisponível para o período selecionado", HttpStatus.CONFLICT);
        } else {
            reserva.setId(nextId++);
            reservas.add(reserva);
            return new ResponseEntity<>("Reserva efetuada com sucesso!", HttpStatus.CREATED);
        }
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<Reserva>> getReservasPorUsuario(@PathVariable Long id) {
        List<Reserva> reservasDoUsuario = reservas.stream()
                .filter(r -> r.getUsuario().getId().equals(id))
                .map(reserva -> {
                    Espaco espacoCompleto = EspacoController.espacos.stream()
                            .filter(e -> e.getId().equals(reserva.getEspaco().getId()))
                            .findFirst().orElse(null);
                    reserva.setEspaco(espacoCompleto);
                    return reserva;
                }).collect(Collectors.toList());
        return new ResponseEntity<>(reservasDoUsuario, HttpStatus.OK);
    }

    @GetMapping("/espaco/{idEspaco}")
    public ResponseEntity<List<Reserva>> getReservasPorEspaco(@PathVariable Long idEspaco) {
        List<Reserva> reservasDoEspaco = reservas.stream()
                .filter(r -> r.getEspaco().getId().equals(idEspaco))
                .collect(Collectors.toList());
        return new ResponseEntity<>(reservasDoEspaco, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarReserva(@PathVariable Long id) {
        boolean removed = reservas.removeIf(r -> r.getId().equals(id));
        if (removed) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
