package com.higorcraco.votacao_fullstack.service;

import java.util.UUID;

import com.higorcraco.votacao_fullstack.repository.PautaVotoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PautaVotoServiceTest {

    @Mock
    private PautaVotoRepository repository;

    private PautaVotoService service;

    @BeforeEach
    void setUp() {
        service = new PautaVotoService();
        ReflectionTestUtils.setField(service, "repository", repository);
    }

    @Test
    void existsByPautaIdAndUsuarioId() {
        UUID usuarioId = UUID.randomUUID();
        UUID pautaId = UUID.randomUUID();

        when(repository.existsByPautaIdAndUsuarioId(pautaId, usuarioId)).thenReturn(true);

        assertThat(service.existsByPautaIdAndUsuarioId(pautaId, usuarioId)).isTrue();

        verifyNoMoreInteractions(repository);
    }
}