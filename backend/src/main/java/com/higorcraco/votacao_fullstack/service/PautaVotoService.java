package com.higorcraco.votacao_fullstack.service;

import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.PautaVoto;
import com.higorcraco.votacao_fullstack.repository.PautaVotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PautaVotoService extends ReadOnlyService<PautaVoto, UUID> {

    public boolean existsByPautaIdAndUsuarioId(UUID pautaId, UUID usuarioId) {
        return getRepository(PautaVotoRepository.class).existsByPautaIdAndUsuarioId(pautaId, usuarioId);
    }

    public PautaVoto save(PautaVoto pautaVoto) {
        return getRepository().saveAndFlush(pautaVoto);
    }
}
