package com.higorcraco.votacao_fullstack.repository;

import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.Pauta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PautaRepository
        extends JpaRepository<Pauta, UUID> {
}
