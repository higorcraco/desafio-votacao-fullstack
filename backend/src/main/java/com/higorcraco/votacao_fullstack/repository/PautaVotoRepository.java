package com.higorcraco.votacao_fullstack.repository;

import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.PautaVoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PautaVotoRepository
        extends JpaRepository<PautaVoto, UUID> {

    boolean existsByPautaIdAndUsuarioId(UUID pautaId, UUID usuarioId);
}
