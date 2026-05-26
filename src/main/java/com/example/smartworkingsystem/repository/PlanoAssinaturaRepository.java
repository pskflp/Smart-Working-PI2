package com.example.smartworkingsystem.repository;

import com.example.smartworkingsystem.model.PlanoAssinatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlanoAssinaturaRepository extends JpaRepository<PlanoAssinatura, Long> {
    List<PlanoAssinatura> findByMembroId(Long membroId);
}
