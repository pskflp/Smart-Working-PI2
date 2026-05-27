package com.example.smartworkingsystem.controller;

import com.example.smartworkingsystem.model.*;
import com.example.smartworkingsystem.repository.ReservaRepository;
import com.example.smartworkingsystem.repository.EspacoRepository;
import com.example.smartworkingsystem.repository.PagamentoRepository;
import com.example.smartworkingsystem.repository.FaturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private EspacoRepository espacoRepository;

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @Autowired
    private FaturaRepository faturaRepository;

    @PostMapping
    public ResponseEntity<String> fazerReserva(@RequestBody Reserva reserva) {
        if (reserva.getEspaco() == null || reserva.getEspaco().getId() == null) {
            return ResponseEntity.badRequest().body("Espaço não informado");
        }

        Long espacoId = reserva.getEspaco().getId();
        Espaco espacoCompleto = espacoRepository.findById(espacoId).orElse(null);

        if (espacoCompleto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Espaço não encontrado");
        }

        // Validação de Status do Espaço (RF010)
        if (!"DISPONÍVEL".equalsIgnoreCase(espacoCompleto.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Este espaço não está disponível para reserva no momento (Status: " + espacoCompleto.getStatus() + ")");
        }

        // Validação de Conflito de Horário
        boolean conflito = reservaRepository.existeConflito(
            espacoCompleto.getId(), 
            reserva.getDataInicio(), 
            reserva.getDataFim()
        );

        if (conflito) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Conflito de reserva: Este espaço já está ocupado neste período.");
        }

        reserva.setEspaco(espacoCompleto);
        reserva.calcularValorTotal();
        reserva.confirmarReserva();
        
        Reserva salva = reservaRepository.save(reserva);

      
        Pagamento pagamento = new Pagamento();
        pagamento.setReserva(salva);
        pagamento.setValor(salva.getValorTotal());
        pagamento.setDataPagamento(java.time.LocalDateTime.now());
        pagamento.setMetodoPagamento("Cartão");
        pagamento.setStatus("PAGO");
        pagamentoRepository.save(pagamento);

        
        Fatura fatura = new Fatura();
        fatura.setPagamento(pagamento);
        fatura.setCodigoFatura("FAT-" + System.currentTimeMillis());
        fatura.setDataEmissao(java.time.LocalDateTime.now());
        faturaRepository.save(fatura);

        return ResponseEntity.status(HttpStatus.CREATED).body("Reserva efetuada com sucesso! Fatura gerada.");
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<Reserva>> getReservasPorUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(reservaRepository.findByUsuarioId(id));
    }

    @GetMapping("/espaco/{id}")
    public ResponseEntity<List<Reserva>> getReservasPorEspaco(@PathVariable Long id) {
        return ResponseEntity.ok(reservaRepository.findByEspacoId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarReserva(@PathVariable Long id) {
        if (reservaRepository.existsById(id)) {
            reservaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
