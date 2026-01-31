package com.higorcraco.votacao_fullstack.service;

import java.time.LocalDateTime;
import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.Pauta;
import com.higorcraco.votacao_fullstack.domain.PautaVoto;
import com.higorcraco.votacao_fullstack.domain.Usuario;
import com.higorcraco.votacao_fullstack.domain.enums.PautaStatusEnum;
import com.higorcraco.votacao_fullstack.dto.CreatePautaDto;
import com.higorcraco.votacao_fullstack.dto.VotoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PautaService extends ReadOnlyService<Pauta, UUID>{

    private final PautaVotoService pautaVotoService;
    private final UsuarioService usuarioService;

    public Pauta create(CreatePautaDto createPautaDto) {
        Pauta pauta = new Pauta();
        pauta.setDescricao(createPautaDto.getDescricao());
        pauta.setDuracao(createPautaDto.getDuracao());
        pauta.setDataCriacao(LocalDateTime.now());
        pauta.setDataFinalVotacao(pauta.getDataCriacao().plusMinutes(pauta.getDuracao()));

        return getRepository().saveAndFlush(pauta);
    }

    public PautaVoto adicionaVoto(UUID pautaId, VotoDto voto) {
        Usuario usuario = usuarioService.findByIdThrow(voto.getUsuarioId());
        Pauta pauta = this.findByIdThrow(pautaId);

        if (PautaStatusEnum.FINALIZADA.equals(pauta.getStatus())) {
            throw new IllegalStateException("Esta pauta já está finalizada");
        }

        if (pautaVotoService.existsByPautaIdAndUsuarioId(pautaId, voto.getUsuarioId())) {
            throw new IllegalStateException("Você já votou nesta pauta");
        }

        PautaVoto novoVoto = new PautaVoto();
        novoVoto.setPauta(pauta);
        novoVoto.setUsuario(usuario);

        pauta.getVotos().add(novoVoto);

        getRepository().saveAndFlush(pauta);
        return novoVoto;
    }
}
