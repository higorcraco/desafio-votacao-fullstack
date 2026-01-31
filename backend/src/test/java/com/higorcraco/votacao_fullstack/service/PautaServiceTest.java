package com.higorcraco.votacao_fullstack.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import com.higorcraco.votacao_fullstack.domain.Pauta;
import com.higorcraco.votacao_fullstack.domain.PautaVoto;
import com.higorcraco.votacao_fullstack.domain.Usuario;
import com.higorcraco.votacao_fullstack.dto.CreatePautaDto;
import com.higorcraco.votacao_fullstack.dto.VotoDto;
import com.higorcraco.votacao_fullstack.exception.NotFoundException;
import com.higorcraco.votacao_fullstack.repository.PautaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PautaServiceTest {

    @Mock
    private PautaRepository pautaRepository;

    @Mock
    private PautaVotoService pautaVotoService;

    @Mock
    private UsuarioService usuarioService;

    private PautaService pautaService;

    @BeforeEach
    void setUp() {
        pautaService = new PautaService(pautaVotoService, usuarioService);
        ReflectionTestUtils.setField(pautaService, "repository", pautaRepository);
    }

    private Pauta getPauta() {
        Pauta pauta = new Pauta();
        pauta.setId(UUID.randomUUID());
        pauta.setDescricao("Pauta sobre orçamento");
        pauta.setDuracao(60L);
        pauta.setDataCriacao(LocalDateTime.now());
        pauta.setDataFinalVotacao(LocalDateTime.now().plusMinutes(60));
        pauta.setVotos(new ArrayList<>());
        return pauta;
    }

    private Usuario getUsuario() {
        Usuario usuario = new Usuario();
        usuario.setId(UUID.randomUUID());
        usuario.setCpf("12345678901");
        return usuario;
    }

    @Test
    void create() {
        CreatePautaDto dto = new CreatePautaDto();
        dto.setDescricao("Nova pauta");
        dto.setDuracao(30L);

        Pauta pautaMock = getPauta();
        when(pautaRepository.saveAndFlush(any(Pauta.class))).thenReturn(pautaMock);

        Pauta resultado = pautaService.create(dto);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(pautaMock.getId());
        verify(pautaRepository, times(1)).saveAndFlush(any(Pauta.class));
    }


    @Test
    void adicionaVoto() {
        Pauta pautaMock = getPauta();
        Usuario usuarioMock = getUsuario();
        UUID pautaId = pautaMock.getId();
        UUID usuarioId = usuarioMock.getId();

        VotoDto votoDto = new VotoDto();
        votoDto.setUsuarioId(usuarioId);
        votoDto.setVoto(true);

        when(usuarioService.findByIdThrow(usuarioId)).thenReturn(usuarioMock);
        when(pautaRepository.findById(pautaId)).thenReturn(Optional.of(pautaMock));
        when(pautaVotoService.existsByPautaIdAndUsuarioId(pautaId, usuarioId)).thenReturn(false);
        when(pautaRepository.saveAndFlush(any(Pauta.class))).thenReturn(pautaMock);

        PautaVoto resultado = pautaService.adicionaVoto(pautaId, votoDto);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getPauta()).isEqualTo(pautaMock);
        assertThat(resultado.getUsuario()).isEqualTo(usuarioMock);
        verify(pautaRepository, times(1)).saveAndFlush(pautaMock);
    }

    @Test
    void adicionaVoto_quandoPautaFinalizada_deveLancarIllegalStateException() {
        Usuario usuarioMock = getUsuario();
        UUID usuarioId = usuarioMock.getId();

        Pauta pautaFinalizada = new Pauta();
        pautaFinalizada.setId(UUID.randomUUID());
        pautaFinalizada.setDataFinalVotacao(LocalDateTime.now().minusHours(1));

        VotoDto votoDto = new VotoDto();
        votoDto.setUsuarioId(usuarioId);
        votoDto.setVoto(true);

        when(usuarioService.findByIdThrow(usuarioId)).thenReturn(usuarioMock);
        when(pautaRepository.findById(pautaFinalizada.getId())).thenReturn(Optional.of(pautaFinalizada));

        assertThatThrownBy(() -> pautaService.adicionaVoto(pautaFinalizada.getId(), votoDto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Esta pauta já está finalizada");

        verify(pautaRepository, never()).saveAndFlush(any(Pauta.class));
    }

    @Test
    void adicionaVoto_quandoUsuarioJaVotou_deveLancarIllegalStateException() {
        Pauta pautaMock = getPauta();
        Usuario usuarioMock = getUsuario();
        UUID pautaId = pautaMock.getId();
        UUID usuarioId = usuarioMock.getId();

        VotoDto votoDto = new VotoDto();
        votoDto.setUsuarioId(usuarioId);
        votoDto.setVoto(true);

        when(usuarioService.findByIdThrow(usuarioId)).thenReturn(usuarioMock);
        when(pautaRepository.findById(pautaId)).thenReturn(Optional.of(pautaMock));
        when(pautaVotoService.existsByPautaIdAndUsuarioId(pautaId, usuarioId)).thenReturn(true);

        assertThatThrownBy(() -> pautaService.adicionaVoto(pautaId, votoDto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Você já votou nesta pauta");

        verify(pautaRepository, never()).saveAndFlush(any(Pauta.class));
    }

    @Test
    void adicionaVoto_quandoUsuarioNaoExiste_deveLancarNotFoundException() {
        Pauta pautaMock = getPauta();
        UUID pautaId = pautaMock.getId();
        UUID usuarioId = UUID.randomUUID();

        VotoDto votoDto = new VotoDto();
        votoDto.setUsuarioId(usuarioId);
        votoDto.setVoto(true);

        when(usuarioService.findByIdThrow(usuarioId)).thenThrow(new NotFoundException("Usuario", "id", usuarioId.toString()));

        assertThatThrownBy(() -> pautaService.adicionaVoto(pautaId, votoDto))
                .isInstanceOf(NotFoundException.class);

        verify(pautaRepository, never()).saveAndFlush(any(Pauta.class));
    }

    @Test
    void adicionaVoto_quandoPautaNaoExiste_deveLancarNotFoundException() {
        Usuario usuarioMock = getUsuario();
        UUID pautaId = UUID.randomUUID();
        UUID usuarioId = usuarioMock.getId();

        VotoDto votoDto = new VotoDto();
        votoDto.setUsuarioId(usuarioId);
        votoDto.setVoto(true);

        when(usuarioService.findByIdThrow(usuarioId)).thenReturn(usuarioMock);
        when(pautaRepository.findById(pautaId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> pautaService.adicionaVoto(pautaId, votoDto))
                .isInstanceOf(NotFoundException.class);

        verify(pautaRepository, never()).saveAndFlush(any(Pauta.class));
    }
}