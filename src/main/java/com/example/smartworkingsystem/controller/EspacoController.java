package com.example.smartworkingsystem.controller;

import com.example.smartworkingsystem.model.Espaco;
import com.example.smartworkingsystem.repository.EspacoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/espacos")
public class EspacoController {

    @Autowired
    private EspacoRepository espacoRepository;

    @GetMapping
    public ResponseEntity<List<Espaco>> listarEspacos() {
        return new ResponseEntity<>(espacoRepository.findAll(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Espaco> cadastrarEspaco(@RequestBody Espaco espaco) {
        return new ResponseEntity<>(espacoRepository.save(espaco), HttpStatus.CREATED);
    }
}
