package com.example.smartworkingsystem.controller;

import com.example.smartworkingsystem.model.Pagamento;
import com.example.smartworkingsystem.repository.PagamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @GetMapping("/financeiro")
    public ResponseEntity<Map<String, Object>> getRelatorioFinanceiro() {
        List<Pagamento> pagamentos = pagamentoRepository.findAll();

        Double faturamentoTotal = pagamentos.stream()
                .filter(p -> "CONCLUIDO".equals(p.getStatus()))
                .mapToDouble(Pagamento::getValor)
                .sum();

        // Faturamento por Espaço (Top 5)
        Map<String, Double> faturamentoPorEspaco = pagamentos.stream()
                .filter(p -> "CONCLUIDO".equals(p.getStatus()) && p.getReserva() != null)
                .collect(Collectors.groupingBy(
                        p -> p.getReserva().getEspaco().getNome(),
                        Collectors.summingDouble(Pagamento::getValor)
                ));

        // Faturamento por Plano
        Map<String, Double> faturamentoPorPlano = pagamentos.stream()
                .filter(p -> "CONCLUIDO".equals(p.getStatus()) && p.getPlano() != null)
                .collect(Collectors.groupingBy(
                        p -> p.getPlano().getNomePlano(),
                        Collectors.summingDouble(Pagamento::getValor)
                ));

        Map<String, Object> relatorio = new HashMap<>();
        relatorio.put("faturamentoTotal", faturamentoTotal);
        relatorio.put("faturamentoPorEspaco", faturamentoPorEspaco);
        relatorio.put("faturamentoPorPlano", faturamentoPorPlano);
        relatorio.put("totalPagamentos", pagamentos.size());

        return new ResponseEntity<>(relatorio, HttpStatus.OK);
    }
}
