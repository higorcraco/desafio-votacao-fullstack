package com.higorcraco.votacao_fullstack.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import com.higorcraco.votacao_fullstack.client.CpfValidatorClient;
import com.higorcraco.votacao_fullstack.domain.Pauta;
import com.higorcraco.votacao_fullstack.domain.PautaVoto;
import com.higorcraco.votacao_fullstack.domain.Usuario;
import com.higorcraco.votacao_fullstack.domain.integracao.enums.CpfStatusEnum;
import com.higorcraco.votacao_fullstack.dto.CreatePautaDto;
import com.higorcraco.votacao_fullstack.dto.VotoDto;
import com.higorcraco.votacao_fullstack.dto.integracao.CpfStatusDto;
import com.higorcraco.votacao_fullstack.exception.NotFoundException;
import com.higorcraco.votacao_fullstack.exception.integracao.CpfIntegracaoInvalidoException;
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
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PautaServiceTest {

    @Mock
    private PautaRepository pautaRepository;

    @Mock
    private PautaVotoService pautaVotoService;

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private CpfValidatorClient cpfValidatorClient;

    private PautaService pautaService;

    @BeforeEach
    void setUp() {
        pautaService = new PautaService(pautaVotoService, usuarioService, cpfValidatorClient);
        ReflectionTestUtils.setField(pautaService, "repository", pautaRepository);
    }

    private Pauta getPauta() {
        Pauta pauta = new Pauta();
        pauta.setId(UUID.randomUUID());
        pauta.setTitulo("Pauta título");
        pauta.setDescricao("Pauta sobre orçamento");
        pauta.setDuracao(60L);
        pauta.setDataCriacao(Instant.now());
        pauta.setDataFinalVotacao(Instant.now().plus(60, ChronoUnit.MINUTES));
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
        dto.setTitulo("Título");
        dto.setDescricao("Nova pauta");
        dto.setDuracao(30L);

        when(pautaRepository.saveAndFlush(any(Pauta.class))).thenAnswer(i -> i.getArgument(0));

        Pauta resultado = pautaService.create(dto);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getTitulo()).isEqualTo(dto.getTitulo());
        assertThat(resultado.getDescricao()).isEqualTo(dto.getDescricao());
        assertThat(resultado.getDuracao()).isEqualTo(dto.getDuracao());
        assertThat(resultado.getDataCriacao()).isNotNull();
        assertThat(resultado.getDataFinalVotacao()).isNotNull();
        assertThat(resultado.getDataFinalVotacao()).isAfter(resultado.getDataCriacao());
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
        when(cpfValidatorClient.consultaStatus(usuarioMock.getCpf()))
                .thenReturn(new CpfStatusDto(CpfStatusEnum.ABLE_TO_VOTE.name()));
        when(pautaVotoService.existsByPautaIdAndUsuarioId(pautaId, usuarioId)).thenReturn(false);
        when(pautaVotoService.save(any(PautaVoto.class))).thenAnswer(i -> {
            PautaVoto pautaVoto = i.getArgument(0);
            pautaVoto.setId(UUID.randomUUID());
            pautaVoto.setPauta(pautaMock);
            pautaVoto.setUsuario(usuarioMock);
            return pautaVoto;
        });

        PautaVoto resultado = pautaService.adicionaVoto(pautaId, votoDto);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getPauta()).isEqualTo(pautaMock);
        assertThat(resultado.getUsuario()).isEqualTo(usuarioMock);

        verify(pautaVotoService).save(any(PautaVoto.class));
        verifyNoMoreInteractions(usuarioService, pautaRepository, cpfValidatorClient, pautaVotoService);
    }

    @Test
    void adicionaVoto_quandoPautaFinalizada_deveLancarIllegalStateException() {
        Usuario usuarioMock = getUsuario();
        UUID usuarioId = usuarioMock.getId();

        Pauta pautaFinalizada = new Pauta();
        pautaFinalizada.setId(UUID.randomUUID());
        pautaFinalizada.setDataFinalVotacao(Instant.now().minus(1, ChronoUnit.HOURS));

        VotoDto votoDto = new VotoDto();
        votoDto.setUsuarioId(usuarioId);
        votoDto.setVoto(true);

        when(usuarioService.findByIdThrow(usuarioId)).thenReturn(usuarioMock);
        when(pautaRepository.findById(pautaFinalizada.getId())).thenReturn(Optional.of(pautaFinalizada));
        when(cpfValidatorClient.consultaStatus(usuarioMock.getCpf()))
                .thenReturn(new CpfStatusDto(CpfStatusEnum.ABLE_TO_VOTE.name()));

        assertThatThrownBy(() -> pautaService.adicionaVoto(pautaFinalizada.getId(), votoDto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Esta pauta já está finalizada");

        verify(pautaRepository, never()).saveAndFlush(any(Pauta.class));
        verifyNoMoreInteractions(usuarioService, pautaRepository, cpfValidatorClient);
        verifyNoInteractions(pautaVotoService);
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
        when(cpfValidatorClient.consultaStatus(usuarioMock.getCpf()))
                .thenReturn(new CpfStatusDto(CpfStatusEnum.ABLE_TO_VOTE.name()));
        when(pautaVotoService.existsByPautaIdAndUsuarioId(pautaId, usuarioId)).thenReturn(true);

        assertThatThrownBy(() -> pautaService.adicionaVoto(pautaId, votoDto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Você já votou nesta pauta");

        verify(pautaRepository, never()).saveAndFlush(any(Pauta.class));
        verifyNoMoreInteractions(usuarioService, pautaRepository, cpfValidatorClient, pautaVotoService);
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
        verifyNoMoreInteractions(usuarioService);
        verifyNoInteractions(pautaRepository, cpfValidatorClient, pautaVotoService);
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

        verifyNoMoreInteractions(usuarioService, pautaRepository, cpfValidatorClient);
        verifyNoInteractions(pautaVotoService);
    }

    @Test
    void adicionaVoto_quandoUsuarioEstaInabilitado_deveLancarCpfInvalidoException() {
        Usuario usuarioMock = getUsuario();
        UUID usuarioId = usuarioMock.getId();

        Pauta pauta = new Pauta();
        pauta.setId(UUID.randomUUID());

        VotoDto votoDto = new VotoDto();
        votoDto.setUsuarioId(usuarioId);
        votoDto.setVoto(true);

        when(usuarioService.findByIdThrow(usuarioId)).thenReturn(usuarioMock);
        when(pautaRepository.findById(pauta.getId())).thenReturn(Optional.of(pauta));
        when(cpfValidatorClient.consultaStatus(usuarioMock.getCpf()))
                .thenReturn(new CpfStatusDto(CpfStatusEnum.UNABLE_TO_VOTE.name()));

        assertThatThrownBy(() -> pautaService.adicionaVoto(pauta.getId(), votoDto))
                .isInstanceOf(CpfIntegracaoInvalidoException.class)
                .hasMessageContaining("Este CPF está inabilitado para votos");

        verify(pautaRepository, never()).saveAndFlush(any(Pauta.class));
        verifyNoMoreInteractions(usuarioService, pautaRepository, cpfValidatorClient);
        verifyNoInteractions(pautaVotoService);
    }
}