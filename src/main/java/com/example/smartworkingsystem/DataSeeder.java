package com.example.smartworkingsystem;


import java.time.LocalDateTime;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.smartworkingsystem.model.Administrador;
import com.example.smartworkingsystem.model.Espaco;
import com.example.smartworkingsystem.model.Membro;
import com.example.smartworkingsystem.model.Reserva;
import com.example.smartworkingsystem.model.TipoReserva;
import com.example.smartworkingsystem.model.Usuario;
import com.example.smartworkingsystem.repository.EspacoRepository;
import com.example.smartworkingsystem.repository.ReservaRepository;
import com.example.smartworkingsystem.repository.UsuarioRepository;

@Component
public class DataSeeder {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EspacoRepository espacoRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @PostConstruct
    public void seedData() {
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Administrador("João Landlord", "admin@email.com", "123456");
            Membro comum = new Membro("João Worker", "cliente@email.com", "123456");
            usuarioRepository.save(admin);
            usuarioRepository.save(comum);

            Espaco espaco1 = new Espaco(null, "ESP-001", "Sala de Reunião A", "Sala", 50.0, 350.0, 5000.0, "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==", "Av. Paulista, 123", "Cancelamento gratuito até 24h antes");
            Espaco espaco2 = new Espaco(null, "ESP-002", "Mesa Compartilhada B", "Mesa", 25.0, 150.0, 2000.0, "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==", "Rua Augusta, 456", "Cancelamento gratuito até 48h antes");
            espacoRepository.save(espaco1);
            espacoRepository.save(espaco2);

            Reserva reserva1 = new Reserva(comum, espaco1, LocalDateTime.now().plusDays(1), LocalDateTime.now().plusDays(1).plusHours(2), TipoReserva.HORA);
            Reserva reserva2 = new Reserva(comum, espaco2, LocalDateTime.now().plusDays(3), LocalDateTime.now().plusDays(4), TipoReserva.DIA);
            reservaRepository.save(reserva1);
            reservaRepository.save(reserva2);
        }
    }
}
