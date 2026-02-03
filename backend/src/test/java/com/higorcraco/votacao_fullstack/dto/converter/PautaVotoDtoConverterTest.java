package com.higorcraco.votacao_fullstack.dto.converter;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.Pauta;
import com.higorcraco.votacao_fullstack.domain.PautaVoto;
import com.higorcraco.votacao_fullstack.domain.Usuario;
import com.higorcraco.votacao_fullstack.dto.PautaVotoDto;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PautaVotoDtoConverterTest {

    private final PautaVotoDtoConverter pautaVotoDtoConverter = new PautaVotoDtoConverter();

    @Test
    void from() {
        PautaVoto pautaVoto = getPautaVoto();

        PautaVotoDto resultado = pautaVotoDtoConverter.from(pautaVoto);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(pautaVoto.getId());
        assertThat(resultado.getVoto()).isEqualTo(pautaVoto.getVoto());
        assertThat(resultado.getPautaId()).isEqualTo(pautaVoto.getPauta().getId());
        assertThat(resultado.getUsuarioId()).isEqualTo(pautaVoto.getUsuario().getId());
    }

    @Test
    void from_quandoPautaEhNula() {
        PautaVoto pautaVoto = new PautaVoto();
        pautaVoto.setId(UUID.randomUUID());
        pautaVoto.setVoto(true);
        pautaVoto.setUsuario(new Usuario());
        pautaVoto.getUsuario().setId(UUID.randomUUID());

        PautaVotoDto resultado = pautaVotoDtoConverter.from(pautaVoto);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getPautaId()).isNull();
        assertThat(resultado.getUsuarioId()).isNotNull();
    }

    @Test
    void from_quandoUsuarioEhNulo() {
        PautaVoto pautaVoto = new PautaVoto();
        pautaVoto.setId(UUID.randomUUID());
        pautaVoto.setVoto(false);
        pautaVoto.setPauta(new Pauta());
        pautaVoto.getPauta().setId(UUID.randomUUID());

        PautaVotoDto resultado = pautaVotoDtoConverter.from(pautaVoto);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getPautaId()).isNotNull();
        assertThat(resultado.getUsuarioId()).isNull();
    }

    @Test
    void from_quandoEntityEhNula() {
        PautaVotoDto resultado = pautaVotoDtoConverter.from(null);

        assertThat(resultado).isNull();
    }

    private PautaVoto getPautaVoto() {
        PautaVoto pautaVoto = new PautaVoto();
        pautaVoto.setId(UUID.randomUUID());
        pautaVoto.setVoto(true);

        Usuario usuario = new Usuario();
        usuario.setId(UUID.randomUUID());
        usuario.setCpf("12345678901");
        pautaVoto.setUsuario(usuario);

        Pauta pauta = new Pauta();
        pauta.setId(UUID.randomUUID());
        pauta.setTitulo("Pauta Título");
        pauta.setDescricao("Descrição");
        pauta.setDuracao(60L);
        pauta.setDataCriacao(Instant.now());
        pauta.setDataFinalVotacao(Instant.now().plus(60, ChronoUnit.MINUTES));
        pauta.setVotos(new ArrayList<>());
        pautaVoto.setPauta(pauta);

        return pautaVoto;
    }
}
