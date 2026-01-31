package com.higorcraco.votacao_fullstack.service;

import java.util.UUID;

import com.higorcraco.votacao_fullstack.repository.PautaVotoRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

class PautaVotoServiceTest {

    @Mock
    private PautaVotoRepository repository;

    @InjectMocks
    private PautaVotoService service;

    @Test
    void existsByPautaIdAndUsuarioId() {
        UUID usuarioId = UUID.randomUUID();
        UUID pautaId = UUID.randomUUID();

        when(repository.existsByPautaIdAndUsuarioId(any(), any())).thenReturn(Boolean.TRUE);

        assertThat(service.existsByPautaIdAndUsuarioId(pautaId, usuarioId)).isTrue();

        verify(repository).existsByPautaIdAndUsuarioId(pautaId, usuarioId);
        verifyNoMoreInteractions(repository);
    }
}