package com.higorcraco.votacao_fullstack.dto.converter;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.Pauta;
import com.higorcraco.votacao_fullstack.dto.PautaDto;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PautaDtoConverterTest {

    private final PautaVotoDtoConverter pautaVotoDtoConverter = new PautaVotoDtoConverter();
    private final PautaDtoConverter pautaDtoConverter = new PautaDtoConverter(pautaVotoDtoConverter);

    @Test
    void from() {
        Pauta pauta = getPauta();

        PautaDto resultado = pautaDtoConverter.from(pauta);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(pauta.getId());
        assertThat(resultado.getTitulo()).isEqualTo(pauta.getTitulo());
        assertThat(resultado.getDescricao()).isEqualTo(pauta.getDescricao());
        assertThat(resultado.getDuracao()).isEqualTo(pauta.getDuracao());
        assertThat(resultado.getDataCriacao()).isEqualTo(pauta.getDataCriacao());
        assertThat(resultado.getDataFinalVotacao()).isEqualTo(pauta.getDataFinalVotacao());
        assertThat(resultado.getStatus()).isEqualTo(pauta.getStatus().getDescricao());
        assertThat(resultado.getVotos()).isEmpty();
    }

    @Test
    void from_quandoEntityEhNula() {
        PautaDto resultado = pautaDtoConverter.from(null);

        assertThat(resultado).isNull();
    }

    private Pauta getPauta() {
        Pauta pauta = new Pauta();
        pauta.setId(UUID.randomUUID());
        pauta.setTitulo("Pauta Título");
        pauta.setDescricao("Pauta sobre orçamento");
        pauta.setDuracao(60L);
        pauta.setDataCriacao(Instant.now());
        pauta.setDataFinalVotacao(Instant.now().plus(60, ChronoUnit.MINUTES));
        pauta.setVotos(new ArrayList<>());
        return pauta;
    }
}

