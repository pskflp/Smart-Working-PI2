package com.example.smartworkingsystem.repository;

import com.example.smartworkingsystem.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.example.smartworkingsystem.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByMembroId(Long membroId);

    @Query("SELECT COUNT(r) > 0 FROM Reserva r WHERE r.espaco.id = :espacoId AND r.status != 'CANCELADO' AND " +
           "((:inicio < r.dataFim AND :fim > r.dataInicio))")
    boolean existeConflito(@Param("espacoId") Long espacoId, 
                           @Param("inicio") LocalDateTime inicio, 
                           @Param("fim") LocalDateTime fim);
}
