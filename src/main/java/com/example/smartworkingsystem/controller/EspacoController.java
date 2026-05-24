package com.example.smartworkingsystem.controller;

import com.example.smartworkingsystem.model.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/espacos")
public class EspacoController {

    public static List<Espaco> espacos = new ArrayList<>();
    private static Long nextEspacoId = 1L;

    @GetMapping
    public ResponseEntity<List<Espaco>> listarEspacos() {
        return new ResponseEntity<>(espacos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Espaco> cadastrarEspaco(@RequestBody Espaco espaco) {
        espaco.setId(nextEspacoId++);
        espacos.add(espaco);
        return new ResponseEntity<>(espaco, HttpStatus.CREATED);
    }
}
