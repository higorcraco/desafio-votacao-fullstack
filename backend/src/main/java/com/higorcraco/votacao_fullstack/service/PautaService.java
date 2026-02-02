package com.higorcraco.votacao_fullstack.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import com.higorcraco.votacao_fullstack.client.CpfValidatorClient;
import com.higorcraco.votacao_fullstack.domain.Pauta;
import com.higorcraco.votacao_fullstack.domain.PautaVoto;
import com.higorcraco.votacao_fullstack.domain.Usuario;
import com.higorcraco.votacao_fullstack.domain.enums.PautaStatusEnum;
import com.higorcraco.votacao_fullstack.domain.integracao.enums.CpfStatusEnum;
import com.higorcraco.votacao_fullstack.dto.CreatePautaDto;
import com.higorcraco.votacao_fullstack.dto.VotoDto;
import com.higorcraco.votacao_fullstack.dto.integracao.CpfStatusDto;
import com.higorcraco.votacao_fullstack.exception.integracao.CpfIntegracaoInvalidoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PautaService extends ReadOnlyService<Pauta, UUID>{

    private final PautaVotoService pautaVotoService;
    private final UsuarioService usuarioService;
    private final CpfValidatorClient cpfValidatorClient;

    public Pauta create(CreatePautaDto createPautaDto) {
        Pauta pauta = new Pauta();
        pauta.setDescricao(createPautaDto.getDescricao());
        pauta.setDuracao(createPautaDto.getDuracao());
        pauta.setDataCriacao(Instant.now());
        pauta.setDataFinalVotacao(pauta.getDataCriacao().plus(pauta.getDuracao(), ChronoUnit.MINUTES));

        return getRepository().saveAndFlush(pauta);
    }

    public PautaVoto adicionaVoto(UUID pautaId, VotoDto voto) {
        Usuario usuario = usuarioService.findByIdThrow(voto.getUsuarioId());
        Pauta pauta = this.findByIdThrow(pautaId);

        CpfStatusDto cpfStatus = cpfValidatorClient.consultaStatus(usuario.getCpf());

        if (CpfStatusEnum.UNABLE_TO_VOTE.name().equals(cpfStatus.getStatus())) {
            throw new CpfIntegracaoInvalidoException("Este CPF está inabilitado para votos");
        }

        if (PautaStatusEnum.FINALIZADA.equals(pauta.getStatus())) {
            throw new IllegalStateException("Esta pauta já está finalizada");
        }

        if (pautaVotoService.existsByPautaIdAndUsuarioId(pautaId, voto.getUsuarioId())) {
            throw new IllegalStateException("Você já votou nesta pauta");
        }

        PautaVoto novoVoto = new PautaVoto();
        novoVoto.setPauta(pauta);
        novoVoto.setUsuario(usuario);
        novoVoto.setVoto(voto.getVoto());

        return pautaVotoService.save(novoVoto);
    }
}
