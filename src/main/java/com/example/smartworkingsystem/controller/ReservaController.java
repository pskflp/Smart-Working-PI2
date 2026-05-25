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

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @Autowired
    private FaturaRepository faturaRepository;

    @PostMapping
    public ResponseEntity<String> fazerReserva(@RequestBody Reserva reserva) {
        Espaco espacoCompleto = espacoRepository.findById(reserva.getEspaco().getId()).orElse(null);

        if (espacoCompleto == null) {
            return new ResponseEntity<>("Espaço não encontrado", HttpStatus.NOT_FOUND);
        }

        // Validação de Conflito de Horário
        boolean conflito = reservaRepository.existeConflito(
            espacoCompleto.getId(), 
            reserva.getDataInicio(), 
            reserva.getDataFim()
        );

        if (conflito) {
            return new ResponseEntity<>("Conflito de reserva: Este espaço já está ocupado neste período.", HttpStatus.CONFLICT);
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

        return new ResponseEntity<>("Reserva efetuada com sucesso! Fatura gerada.", HttpStatus.CREATED);
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<Reserva>> getReservasPorUsuario(@PathVariable Long id) {
        return new ResponseEntity<>(reservaRepository.findByMembroId(id), HttpStatus.OK);
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
